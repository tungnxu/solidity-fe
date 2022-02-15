import { ethers } from 'ethers';
import { useMemo } from 'react';

export default function useProvider() {
    return useMemo(() => { return new ethers.providers.Web3Provider(window.ethereum) }, [])
}
