import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useMemo } from 'react';
import Contracts from '../contracts'
import contractAddress, { ChainId } from '../utils/contractAddress';
import useSigner from './useSigner';

export default function useContract(name: string, abi?: any) {
    const _abi = Contracts[name].abi
    const { chainId } = useWeb3React();

    const signer = useSigner()

    const _contractAddress = useMemo(() => {
        if (!chainId) return
        const contractList = contractAddress[chainId as ChainId]
        if (!contractList) return
        return contractAddress[chainId as ChainId][name as any]
    }, [chainId, name])

    return useMemo(() => {
        if (!_contractAddress) return
        return new ethers.Contract(_contractAddress, abi || _abi, signer)
    }, [signer, _contractAddress, _abi, abi])
}
