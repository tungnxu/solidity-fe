import { useMemo } from 'react';
import useProvider from './useProvider';

export default function useSigner() {
    const provider = useProvider()
    return useMemo(() => {
        return provider.getSigner()
    }, [provider])
}
