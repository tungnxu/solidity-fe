/* eslint-disable jsx-a11y/anchor-is-valid */
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import * as React from 'react';
import useProvider from '../hooks/useProvider';
import useSigner from '../hooks/useSigner';
import MockUSDC from '../contracts/MockUSDC.json';
import MockMATIC from '../contracts/MockMATIC.json';

const MintPanel = () => {
    const { account } = useWeb3React()
    const signer = useSigner();
    const provider = useProvider();
    // const usdc = useContract("DoggToken");

    const mintUSDC = React.useCallback(() => {
        console.log("Mint nao");
        const usdc = new ethers.Contract(MockUSDC.address, MockUSDC.abi, signer)
        if (!usdc) return
        return usdc.mint(account, parseEther("100"))
    }, [signer, account])

    const mintMATIC = React.useCallback(() => {
        const matic = new ethers.Contract(MockMATIC.address, MockMATIC.abi, signer)

        return matic.mint(account, parseEther("100"))
    }, [signer, account])

    React.useEffect(() => {
        const USDC = new ethers.Contract(MockUSDC.address, MockUSDC.abi, provider);

        USDC.on("Transfer", (from, to, amount, event) => {
            console.log({ from, to, amount, event })
        })
        const MATIC = new ethers.Contract(MockMATIC.address, MockMATIC.abi, provider);

        MATIC.on("Transfer", (from, to, amount, event) => {
            console.log({ from, to, amount, event })
        })
    }, [provider])

    return (
        <div className="navbar-start">

        <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">
                Mint Coin
            </a>

            <div className="navbar-dropdown">
                <a className="navbar-item" onClick={mintUSDC}>
                    Mint 100 USDC
                </a>
                <a  className="navbar-item" onClick={mintMATIC}>
                    Jobs 100 Matic
                </a>
            </div>
        </div>
    </div>
    );

}
export default MintPanel;