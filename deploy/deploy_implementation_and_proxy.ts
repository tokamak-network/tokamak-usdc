// Copyright 2023 justin
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
    networkConfigItem,
} from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployImplementationAndProxy: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment,
) {
    const { deployments, getNamedAccounts, network, ethers } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId!

    const waitBlockConfirmations = chainId === 31337 ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS
    const THROWAWAY_ADDRESS = "0x0000000000000000000000000000000000000001"
    log("----------------------------------------------------")
    let proxyAdminAddress = networkConfig[chainId]["PROXY_ADMIN_ADDRESS"]
    let ownerAddress = networkConfig[chainId]["OWNER_ADDRESS"]
    let pauserAddress = networkConfig[chainId]["PAUSER_ADDRESS"]
    let blacklisterAddress = networkConfig[chainId]["BLACKLISTER_ADDRESS"]
    let lostAndFoundAddress = networkConfig[chainId]["LOST_AND_FOUND_ADDRESS"]
    let masterMinterOwnerAddress = networkConfig[chainId]["MASTERMINTER_OWNER_ADDRESS"]
    let fiatTokenImplementationAddress = networkConfig[chainId]["FIAT_TOKEN_IMPLEMENTATION_ADDRESS"]
    let tokenName = networkConfig[chainId]["TOKEN_NAME"]
    let tokenSymbol = networkConfig[chainId]["TOKEN_SYMBOL"]
    let tokenCurrency = networkConfig[chainId]["TOKEN_CURRENCY"]
    let tokenDecimals = networkConfig[chainId]["TOKEN_DECIMALS"]

    console.log(`Proxy Admin:                ${proxyAdminAddress}`)
    console.log(`Owner:                      ${ownerAddress}`)
    console.log(`Pauser:                     ${pauserAddress}`)
    console.log(`Blacklister:                ${blacklisterAddress}`)
    console.log(`Lost and Found:             ${lostAndFoundAddress}`)
    console.log(`Master Minter Owner:        ${masterMinterOwnerAddress}`)
    console.log(`FiatTokenImplementationAddress: ${fiatTokenImplementationAddress}`)

    console.log("Deploying and linking SignatureChecker library contract...")
    const signatureChecker = await deploy("SignatureChecker", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    console.log("SignatureChecker library contract deployed to:", signatureChecker.address)
    console.log("Deploying FiatTokenImplementation contract...")
    const fiatTokenV2_2 = await deploy("FiatTokenV2_2", {
        from: deployer,
        args: [],
        log: true,
        libraries: {
            SignatureChecker: signatureChecker.address,
        },
        waitConfirmations: waitBlockConfirmations,
    })
    fiatTokenImplementationAddress = fiatTokenV2_2.address
    console.log("FiatTokenImplementation contract deployed to:", fiatTokenImplementationAddress)
    console.log("Initializing implementation contract with dummy values...")
    // These values are dummy values because we only rely on the implementation
    // deployment for delegatecall logic, not for actual state storage.
    const fiatTokenV2_2Contract = await ethers.getContractAt(
        "FiatTokenV2_2",
        fiatTokenImplementationAddress,
    )
    let tx = await fiatTokenV2_2Contract.initialize(
        "",
        "",
        "",
        0,
        THROWAWAY_ADDRESS,
        THROWAWAY_ADDRESS,
        THROWAWAY_ADDRESS,
        THROWAWAY_ADDRESS,
    )
    await tx.wait()
    console.log("initialize tx hash:", tx.hash)

    tx = await fiatTokenV2_2Contract.initializeV2("")
    await tx.wait()
    console.log("initializeV2 tx hash:", tx.hash)
    tx = await fiatTokenV2_2Contract.initializeV2_1(THROWAWAY_ADDRESS)
    await tx.wait()
    console.log("initializeV2_1 tx hash:", tx.hash)
    tx = await fiatTokenV2_2Contract.initializeV2_2([], "")
    await tx.wait()
    console.log("initializeV2_2 tx hash:", tx.hash)

    console.log("Deploying proxy contract...")
    const fiatTokenProxy = await deploy("FiatTokenProxy", {
        from: deployer,
        args: [fiatTokenImplementationAddress],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })
    console.log("Proxy contract deployed to:", fiatTokenProxy.address)

    // Now that the proxy contract has been deployed, we can deploy the master minter.
    console.log("Deploying MasterMinter contract...")
    const masterMinter = await deploy("MasterMinter", {
        from: deployer,
        args: [fiatTokenProxy.address],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })
    console.log("MasterMinter contract deployed to:", masterMinter.address)

    // Change the master minter to be owned by the master minter owner
    console.log("Transferring ownership of MasterMinter contract...")
    const masterMinterContract = await ethers.getContractAt("MasterMinter", masterMinter.address)
    tx = await masterMinterContract.transferOwnership(masterMinterOwnerAddress)
    await tx.wait()
    console.log("masterMinterContract transferOwnership tx hash:", tx.hash)

    // Now that the master minter is set up, we can go back to setting up the proxy and
    // implementation contracts.
    console.log("Reassigning proxy contract admin...")
    // Need to change admin first, or the call to initialize won't work
    // since admin can only call methods in the proxy, and not forwarded methods
    let FiatTokenProxyContract = await ethers.getContractAt(
        "FiatTokenProxy",
        fiatTokenProxy.address,
    )
    tx = await FiatTokenProxyContract.changeAdmin(proxyAdminAddress)
    await tx.wait()
    console.log("FiatTokenProxyContract changeAdmin tx hash:", tx.hash)

    //Change the Calling Contract Address
    console.log("Initializing proxy contract...")
    FiatTokenProxyContract = await ethers.getContractAt("FiatTokenV2_2", fiatTokenProxy.address)
    tx = await FiatTokenProxyContract.initialize(
        tokenName,
        tokenSymbol,
        tokenCurrency,
        tokenDecimals,
        masterMinter.address,
        pauserAddress,
        blacklisterAddress,
        ownerAddress,
    )
    await tx.wait()
    console.log("FiatTokenProxyContract initialize tx hash:", tx.hash)

    // Do the V2 initialization
    console.log("Initializing V2...")
    tx = await FiatTokenProxyContract.initializeV2(tokenName)
    await tx.wait()
    console.log("FiatTokenProxyContract initializeV2 tx hash:", tx.hash)

    // Do the V2_1 initialization
    console.log("Initializing V2.1...")
    tx = await FiatTokenProxyContract.initializeV2_1(lostAndFoundAddress)
    await tx.wait()
    console.log("FiatTokenProxyContract initializeV2_1 tx hash:", tx.hash)

    // Do the V2_2 initialization
    console.log("Initializing V2.2...")
    tx = await FiatTokenProxyContract.initializeV2_2([], tokenSymbol)
    await tx.wait()
    console.log("FiatTokenProxyContract initializeV2_2 tx hash:", tx.hash)

    console.log("Deployment finished")

    // verify if not local
    if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
        await verify(signatureChecker.address, [])
        await verify(fiatTokenV2_2.address, [], "contracts/v2/FiatTokenV2_2.sol:FiatTokenV2_2")
        await verify(
            fiatTokenProxy.address,
            [fiatTokenImplementationAddress],
            "contracts/v1/FiatTokenProxy.sol:FiatTokenProxy",
        )
        await verify(
            masterMinter.address,
            [fiatTokenProxy.address],
            "contracts/minting/MasterMinter.sol:MasterMinter",
        )
    }
}

export default deployImplementationAndProxy
deployImplementationAndProxy.tags = ["all", "usdc"]
