/* eslint-disable jsx-a11y/anchor-is-valid */
import { useWeb3React } from "@web3-react/core";
import {
  BigNumber
  // , ethers
} from "ethers";
// import { parseEther } from "ethers/lib/utils";
import React, {
  // useCallback,
  useEffect, useState
} from "react";
// import useSigner from "../hooks/useSigner";
import useContract from "../hooks/useContract";
import { useSelector } from "react-redux";
import { AppState } from "../state";
import Pool from "../components/Pool";
import Vault from "../components/Vault";

const Dashboard = () => {
  // const { account } = useWeb3React()
  // const signer = useSigner();
  // const usdc = useContract("MockUSDC");
  const matic = useContract("MockMATIC");
  const masterChef = useContract("MasterChef");
  const vault = useContract("Vault");
  const { chainId } = useWeb3React();

  const [poolLength, setPoolLength] = useState(0);

  // const mintUSDC = useCallback(() => {
  //   if (!usdc) return
  //   return usdc.mint(account, parseEther("100"))
  // }, [signer, account, usdc])

  // const mintMATIC = useCallback(() => {
  //   if (!matic) return
  //   return matic.mint(account, parseEther("100")).send({ from: account })
  // }, [signer, account, matic])

  useEffect(() => {
    if (matic)
      matic.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event })
      })
  }, [matic])

  useEffect(() => {
    if (matic)
      matic.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event })
      })
  }, [matic])

  useEffect(() => {
    if (masterChef)
      masterChef.poolLength().then((result: BigNumber) => {
        setPoolLength(result.toNumber())
      })
  }, [masterChef])

  const blockNumber = useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])


  return (
    <div className="container">
       <section className="vault">
      <div className="has-text-centered my-5">
        <p className="title is-2">VAULT</p>
        {vault ?  <Vault vault={vault}></Vault> : null } 
      </div>
      </section>
      <section className="pool">
      <div className="has-text-centered my-5">
        <p className="title is-2">POOL</p>
      </div>
      {
        (poolLength > 0 && masterChef) && Array.from(Array(poolLength).keys()).map((i) => <Pool masterChef={masterChef} poolId={i} key={i}></Pool>)
      }
      <div>
        Block number: {chainId} - {blockNumber}
      </div>
      </section>
     
    </div>
    
  );
};

export default Dashboard;
