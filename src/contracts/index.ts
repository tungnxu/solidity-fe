import DoggToken from './DoggToken.json'
import MasterChef from './MasterChef.json'
import MockMATIC from './MockMATIC.json'
import MockUSDC from './MockUSDC.json'
import ERC20 from './ERC20.json'
import Vault from './Vault.json'

const contracts: {
    [any: string]: {
        address?: string;
        abi: any
    }
} = {
    DoggToken,
    MasterChef,
    MockMATIC,
    MockUSDC,
    ERC20,
    Vault
}

export default contracts