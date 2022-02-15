export enum ChainId {
    Mumbai= 80001,
    Kovan= 42,
}

const contractAddress: { [any: number]: { [any: string]: string } } = {
    [ChainId.Mumbai]: {
        "DoggToken": "0xF463cC3eb7Abc9A77468b106540163DCa22322b6",
        "MasterChef": "0x3dAB41B4ab1aFdf0737A234c47f1B767e7906F42",
        "MockMATIC": "0xBf08352210549e2B89d004E45b765A1982325232",
        "MockUSDC": "0x7692F47137609C009F05Cd516F746cc60f8309E3",
        "Vault": ""
    },
    [ChainId.Kovan]: {
        "DoggToken": "0xCF887dBdfC5b1239D24713C8D789Ea795B261f14",
        "MasterChef": "0x6127233E3FD41Ce8BD1532E9975fa4ef356a693C",
        "Vault": "0xe97aE6aa402a2456E4c12018CeAcAfEc4b21dDC1"
    }
}

// const masterchefPool = {
//     "0x3dAB41B4ab1aFdf0737A234c47f1B767e7906F42": [
        
//     ]
// }

export default contractAddress