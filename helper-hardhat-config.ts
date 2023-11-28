//import {ethers} from 'hardhat'

export interface networkConfigItem {
    name?: string
    PROXY_ADMIN_ADDRESS?: string
    OWNER_ADDRESS?: string
    MASTERMINTER_ADDRESS?: string
    MASTERMINTER_OWNER_ADDRESS?: string
    PAUSER_ADDRESS?: string
    BLACKLISTER_ADDRESS?: string
    PROXY_CONTRACT_ADDRESS?: string
    FIAT_TOKEN_IMPLEMENTATION_ADDRESS?: string
    LOST_AND_FOUND_ADDRESS?: string
    MOCK_ERC1271_WALLET_OWNER_ADDRESS?: string
    TOKEN_NAME?: string
    TOKEN_SYMBOL?: string
    TOKEN_CURRENCY?: string
    TOKEN_DECIMALS?: number
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: "localhost",
        // FiatTokenProxy admin - can upgrade implementation contract
        PROXY_ADMIN_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Owner - can configure master minter, pauser, and blacklister
        OWNER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Master Minter - can configure minters and minter allowance
        MASTERMINTER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Master Minter Owner - owner of master minter contract
        MASTERMINTER_OWNER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Pauser - can pause the contract
        PAUSER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Blacklister - can blacklist addresses
        BLACKLISTER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // FiatTokenProxy contract - override the contract address used in migrations
        PROXY_CONTRACT_ADDRESS: "",
        // FiatToken Implementation contract - deploy new proxy with an existing implementation contract
        FIAT_TOKEN_IMPLEMENTATION_ADDRESS: "",
        // LostAndFound - tokens that were locked in the contract are sent to this
        LOST_AND_FOUND_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // MockERC1271WalletOwner - can deploy and send transactions from a sample ERC1271 wallet
        MOCK_ERC1271_WALLET_OWNER_ADDRESS: "",

        // TokenName - ERC20 name of the token e.g. "USD Coin"
        TOKEN_NAME: "USD Coin",
        // TokenSymbol - Symbol of the token e.g. "USDC"
        TOKEN_SYMBOL: "USDC",
        // TokenCurrency - Currency of the token e.g. "USD"
        TOKEN_CURRENCY: "USD",
        // TokenDecimals - Number of decimals for the token e.g. 6
        TOKEN_DECIMALS: 6,
    },
    11155111: {
        name: "sepolia",
        // FiatTokenProxy admin - can upgrade implementation contract
        PROXY_ADMIN_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Owner - can configure master minter, pauser, and blacklister
        OWNER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Master Minter - can configure minters and minter allowance
        MASTERMINTER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Master Minter Owner - owner of master minter contract
        MASTERMINTER_OWNER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Pauser - can pause the contract
        PAUSER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Blacklister - can blacklist addresses
        BLACKLISTER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // FiatTokenProxy contract - override the contract address used in migrations
        PROXY_CONTRACT_ADDRESS: "",
        // FiatToken Implementation contract - deploy new proxy with an existing implementation contract
        FIAT_TOKEN_IMPLEMENTATION_ADDRESS: "",
        // LostAndFound - tokens that were locked in the contract are sent to this
        LOST_AND_FOUND_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // MockERC1271WalletOwner - can deploy and send transactions from a sample ERC1271 wallet
        MOCK_ERC1271_WALLET_OWNER_ADDRESS: "",

        // TokenName - ERC20 name of the token e.g. "USD Coin"
        TOKEN_NAME: "USD Coin",
        // TokenSymbol - Symbol of the token e.g. "USDC"
        TOKEN_SYMBOL: "USDC",
        // TokenCurrency - Currency of the token e.g. "USD"
        TOKEN_CURRENCY: "USD",
        // TokenDecimals - Number of decimals for the token e.g. 6
        TOKEN_DECIMALS: 6,
    },
    1: {
        name: "mainnet",
    },
    17000: {
        name: "holesky",
        // FiatTokenProxy admin - can upgrade implementation contract
        PROXY_ADMIN_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Owner - can configure master minter, pauser, and blacklister
        OWNER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Master Minter - can configure minters and minter allowance
        MASTERMINTER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Master Minter Owner - owner of master minter contract
        MASTERMINTER_OWNER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Pauser - can pause the contract
        PAUSER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // Blacklister - can blacklist addresses
        BLACKLISTER_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // FiatTokenProxy contract - override the contract address used in migrations
        PROXY_CONTRACT_ADDRESS: "",
        // FiatToken Implementation contract - deploy new proxy with an existing implementation contract
        FIAT_TOKEN_IMPLEMENTATION_ADDRESS: "",
        // LostAndFound - tokens that were locked in the contract are sent to this
        LOST_AND_FOUND_ADDRESS: "0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2",
        // MockERC1271WalletOwner - can deploy and send transactions from a sample ERC1271 wallet
        MOCK_ERC1271_WALLET_OWNER_ADDRESS: "",
        // TokenName - ERC20 name of the token e.g. "USD Coin"
        TOKEN_NAME: "USD Coin",
        // TokenSymbol - Symbol of the token e.g. "USDC"
        TOKEN_SYMBOL: "USDC",
        // TokenCurrency - Currency of the token e.g. "USD"
        TOKEN_CURRENCY: "USD",
        // TokenDecimals - Number of decimals for the token e.g. 6
        TOKEN_DECIMALS: 6,
    },
}

export const developmentChains = ["hardhat", "localhost"]
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6
