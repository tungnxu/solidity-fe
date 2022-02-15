import { ethers } from 'ethers';
import { useMemo } from 'react';
import useSigner from './useSigner';
import ERC20Abi from '../contracts/ERC20.json'

export default function useERC20(name: string, address: string) {

    const signer = useSigner()

    const contract = useMemo(() => {
        if (!address) return
        return new ethers.Contract(address, ERC20Abi.abi, signer)
    }, [signer, address])

    return {
        name,
        contract
    }
}
