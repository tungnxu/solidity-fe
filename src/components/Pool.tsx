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

export default function Pool({ masterChef, poolId }: { masterChef: Contract, poolId: number }) {
    const { account, chainId } = useWeb3React();
    const blockNumber = useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])

    const [poolInfo, setPoolInfo] = useState({} as PoolInfo);
    const [userInfo, setUserInfo] = useState({} as UserInfo);
    const [pendingSushi, setPendingSushi] = useState(BigNumber.from(0));
    const [lpBalance, setLpBalance] = useState(BigNumber.from(0));
    const [inputValue, setInputValue] = useState(BigNumber.from(0));
    const [withdrawValue, setWithdrawValue] = useState(BigNumber.from(0));

    const lpContract = useERC20(`LP${poolId}`, poolInfo.lpToken);

    useEffect(() => {
        if (!lpContract.contract || !account) return
        lpContract?.contract?.balanceOf(account).then((balance: BigNumber) => {
            setLpBalance(balance)
        })
    }, [lpContract?.contract, account, blockNumber])

    useEffect(() => {
        masterChef.userInfo(poolId, account).then(([amount, rewardDebt]: [BigNumber, BigNumber]) => {
            setUserInfo({
                amount, rewardDebt
            })
        })
    }, [account, blockNumber, masterChef, poolId]);

    useEffect(() => {
        masterChef.pendingSushi(poolId, account).then((_pendingSushi: BigNumber) => {
            setPendingSushi(_pendingSushi)
        })
    }, [account, blockNumber, masterChef, poolId]);

    useEffect(() => {
        masterChef.poolInfo(poolId).then(([lpToken, allocPoint, lastRewardBlock, accSushiPerShare]:
            [string, BigNumber, BigNumber, BigNumber]) => {
            setPoolInfo({
                lpToken, allocPoint, lastRewardBlock, accSushiPerShare
            })
        });
    }, [masterChef, poolId, blockNumber]);

    const getLabelToken = (pool: number) =>{
        return pool == 0 ? " ETH/DOGG": " USDC/DOGG"
    }

    const deposit = useCallback(() => {
        return masterChef.deposit(poolId, inputValue)
    }, [inputValue, poolId, masterChef])
    const withdraw = useCallback(() => {
        return masterChef.withdraw(poolId, withdrawValue)
    }, [withdrawValue, poolId, masterChef])
    const claim = useCallback(() => {
        return masterChef.deposit(poolId, BigNumber.from(0))
    }, [poolId, masterChef])

    const approve = useCallback(() => {
        if (!lpContract.contract || !masterChef?.address) return
        if (inputValue.gt(BigNumber.from(0)))
            return lpContract.contract.approve(masterChef.address, inputValue)
    }, [lpContract?.contract, masterChef?.address, inputValue])

    return <div style={{ marginTop: 30 }}>
        <div className="pool-list">
            <article className="pool panel is-light">
                <div className="panel-heading is-flex is-justify-content-space-between is-4 title m-0">
                    #{poolId} - {getLabelToken(poolId)} 
                    <nav className="level">
                        <div className="level-item has-text-centered mr-5 pr-5">
                            <div>
                                <p className="heading has-text-grey">Deposited</p>
                                <p className="title is-4">{userInfo?.amount && ethers.utils.formatEther(userInfo?.amount)?.toString()}</p>
                            </div>
                        </div>
                        <div className="level-item has-text-centered mr-5 pr-5">
                            <div>
                                <p className="heading has-text-grey">Rewards per block</p>
                                <p className="title is-4">{poolInfo?.allocPoint &&   ethers.utils.formatEther(poolInfo?.allocPoint)?.toString()} DOGG</p>
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
                                <button className="button is-primary is-light" onClick={deposit}>Deposit</button>
                                <button className="button is-primary is-light" onClick={approve}>Approve</button>

                            </div>

                        </div>
                        <div className="has-text-left ml-3">
                            <small className="has-text-grey">BALANCE</small>
                            <h3 onClick={() => { setInputValue(lpBalance) }} className="title is-5"> {lpBalance && ethers.utils.formatEther(lpBalance)?.toString()} SLP-{getLabelToken(poolId)}  </h3>
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
                                <button onClick={withdraw} className="button is-primary is-light">Withdraw</button>

                            </div>
                        </div>
                        <div className="has-text-left ml-3">
                            <small className="has-text-grey">DEPOSTED:</small>
                            <h3 onClick={() => { setWithdrawValue(userInfo?.amount) }} className="title is-5"> {userInfo?.amount && ethers.utils.formatEther(userInfo?.amount)?.toString()}  SLP-{getLabelToken(poolId)}  </h3>
                        </div>
                    </div>
                    <div className="column has-background-success-light">
                        <div className="has-text-centered pl-5">
                            <small className="has-text-grey">REWARDs</small>
                            <h3 className="title is-5"> {pendingSushi && ethers.utils.formatEther(pendingSushi)?.toString()} DOGG </h3>
                            <button onClick={claim} className="button is-success">Claim rewards</button>
                        </div>
                    </div>

                </div>


            </article>
        </div>
    </div>;
}
