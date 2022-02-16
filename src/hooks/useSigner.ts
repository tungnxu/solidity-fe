import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import useProvider from './useProvider';

export default function useSigner() {
    // const provider = useProvider()
    const {library} = useWeb3React()
    return useMemo(() => {
        return library.getSigner()
    }, [library])
}
