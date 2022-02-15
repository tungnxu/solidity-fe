/* eslint-disable jsx-a11y/anchor-is-valid */
import { useWeb3React } from '@web3-react/core';
import { BigNumber, Contract, ethers } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useERC20 from '../hooks/useERC20';
import { AppState } from '../state';

interface PoolInfo {
    lpToken: string, allocPoint: BigNumber, lastRewardBlock: BigNumber, accSushiPerShare: BigNumber
}

interface UserInfo {
    amount: BigNumber, rewardDebt: BigNumber
}

export default function Vault({ vault }: { vault: Contract }) {
    const { account, chainId } = useWeb3React();
    const blockNumber = useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])

    const [lpToken, setlpToken] = useState("");
    const [poolInfo, setPoolInfo] = useState({} as PoolInfo);
    const [userInfo, setUserInfo] = useState({} as UserInfo);
    const [pendingSushi, setPendingSushi] = useState(BigNumber.from(0));
    const [lpBalance, setLpBalance] = useState(BigNumber.from(0));
    const [inputValue, setInputValue] = useState(BigNumber.from(0));
    const [withdrawValue, setWithdrawValue] = useState(BigNumber.from(0));
    const [balanceInFarm, setBalanceInFarm] = useState(BigNumber.from(0));


    const lpContract = useERC20(`LP`, lpToken);

    useEffect(() => {
        vault.wantAddress().then((lpToken: string) => {
            setlpToken(lpToken)
        })
    },[vault])

    useEffect(() => {
        if (!lpContract.contract || !account) return
        lpContract?.contract?.balanceOf(account).then((balance: BigNumber) => {
            setLpBalance(balance)
        })
    }, [lpContract?.contract, account, blockNumber])

    useEffect(() => {
        vault.balanceInFarm().then((balanceInFarm: BigNumber) => {
            setBalanceInFarm(balanceInFarm)
        })
    },[account, vault, blockNumber])

    // useEffect(() => {
    //     vault.userInfo(poolId, account).then(([amount, rewardDebt]: [BigNumber, BigNumber]) => {
    //         setUserInfo({
    //             amount, rewardDebt
    //         })
    //     })
    // }, [account, blockNumber, vault, poolId]);

    const compound = useCallback(() => {
        return vault.compound()
    }, [vault])

    const deposit = useCallback(() => {
        return vault.deposit(inputValue)
    }, [inputValue, vault])
    const withdraw = useCallback(() => {
        return vault.withdraw(withdrawValue)
    }, [withdrawValue, vault])

    const approve = useCallback(() => {
        if (!lpContract.contract || !vault?.address) return
        if (inputValue.gt(BigNumber.from(0)))
            return lpContract.contract.approve(vault.address, inputValue)
    }, [lpContract?.contract, vault?.address, inputValue])

    return <div style={{ marginTop: 30 }}>
        <div className="pool-list">
            <article className="pool panel is-warning">
                <div className="panel-heading is-flex is-justify-content-space-between is-4 title m-0">
                    #{1} - ETH/DOGG
                    <nav className="level">
                        <div className="level-item has-text-centered mr-5 pr-5">
                            <div>
                                <p className="heading has-text-grey">Deposited</p>
                                <p className="title is-4">{ethers.utils.formatEther(balanceInFarm).toString()}</p>
                            </div>
                        </div>
                    

                        <div className="level-item has-text-centered">
                            <div>
                                <p className="heading has-text-grey">TVL</p>
                                <p className="title is-4">-</p>
                            </div>
                        </div>


                    </nav>

                </div>
                <div className="columns m-0 p-0">
                    <div className="column">
                        <div className="form container p-2">
                            <div className="field is-flex is-align-items-center" >

                                <p className="control has-icons-left has-icons-right mr-2" style={{ "width": "300px" }}>
                                    <input value={inputValue.toString()} onChange={(e) => setInputValue(BigNumber.from(e.target.value))} className="input" type="text" placeholder="Deposit" />
                                    <span className="icon is-small is-left">
                                        DE
                                    </span>

                                </p>
                                <button className="button is-warning is-light" onClick={deposit}>Deposit</button>
                                <button className="button is-warning is-light" onClick={approve}>Approve</button>

                            </div>

                        </div>
                        <div className="has-text-left ml-3">
                            <small className="has-text-grey">BALANCE</small>
                            <h3 onClick={() => { setInputValue(lpBalance) }} className="title is-5"> {ethers.utils.formatEther(lpBalance)?.toString()} SLP-ETH/DOGG </h3>
                        </div>

                    </div>
                    <div className="column ">
                        <div className="form container p-2">
                            <div className="field is-flex is-align-items-center">
                                <p className="control has-icons-left mr-2" style={{ "width": "300px" }}>
                                    <input value={withdrawValue.toString()} onChange={(e) => setWithdrawValue(BigNumber.from(e.target.value))} className="input" type="text" placeholder="Withdraw" />
                                    <span className="icon is-small is-left">
                                        WI
                                    </span>
                                </p>
                                <button onClick={withdraw} className="button is-warning is-light">Withdraw</button>

                            </div>
                        </div>
                        <div className="has-text-left ml-3">
                            <small className="has-text-grey">DEPOSTED:</small>
                            <h3 onClick={() => { setWithdrawValue(balanceInFarm) }} className="title is-5"> {ethers.utils.formatEther(balanceInFarm).toString()}  SLP-ETH/DOGG </h3>
                        </div>
                    </div>
                    <div className="column has-background-success-light">
                        <div className="has-text-centered pl-5">
                            {/* <small className="has-text-grey">REWARDs</small>
                            <h3 className="title is-5"> {pendingSushi?.toString()} DOGG </h3> */}
                            <button onClick={compound} className="button is-warning">Compound</button>
                        </div>
                    </div>

                </div>


            </article>
        </div>
    </div>;
}
