import { Block } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useDebounce from '../hooks/useDebounce';
import useIsWindowVisible from '../hooks/useIsWindowVisible';
import useProvider from '../hooks/useProvider';
import { updateBlockNumber, updateBlockTimestamp, updateChainId } from './application/actions';

export default function ApplicationUpdater(): null {
    const { chainId, library } = useWeb3React();
    // const library = useProvider();
    const windowVisible = useIsWindowVisible()
    const dispatch = useDispatch()
  
    const [state, setState] = useState<{
      chainId: number | undefined
      blockNumber: number | null
      blockTimestamp: number | null
    }>({
      chainId,
      blockNumber: null,
      blockTimestamp: null,
    })
  
    const blockCallback = useCallback(
      (block: Block) => {
        setState((state) => {
          if (chainId === state.chainId) {
            if (typeof state.blockNumber !== 'number' && typeof state.blockTimestamp !== 'number')
              return { chainId, blockNumber: block.number, blockTimestamp: block.timestamp }
            return {
              chainId,
              // @ts-ignore TYPE NEEDS FIXING
              blockNumber: Math.max(block.number, state.blockNumber),
              // @ts-ignore TYPE NEEDS FIXING
              blockTimestamp: Math.max(block.timestamp, state.blockTimestamp),
            }
          }
          return state
        })
      },
      [chainId, setState]
    )
  
    const onBlock = useCallback(
      (number) => {
        // @ts-ignore TYPE NEEDS FIXING
        return library.getBlock(number).then(blockCallback)
      },
      [blockCallback, library]
    )
  
    // attach/detach listeners
    useEffect(() => {
      if (!library || !chainId || !windowVisible) return undefined
  
      setState({ chainId, blockNumber: null, blockTimestamp: null })
  
      library
        .getBlock('latest')
        .then(blockCallback)
        .catch((error: any) => console.error(`Failed to get block for chainId: ${chainId}`, error))
  
      library.on('block', onBlock)
      return () => {
        library.removeListener('block', onBlock)
      }
    }, [dispatch, chainId, library, windowVisible, blockCallback, onBlock])
  
    const debouncedState = useDebounce(state, 100)
  
    useEffect(() => {
      if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
      dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
    }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])
  
    useEffect(() => {
      if (!debouncedState.chainId || !debouncedState.blockTimestamp || !windowVisible) return
      dispatch(updateBlockTimestamp({ chainId: debouncedState.chainId, blockTimestamp: debouncedState.blockTimestamp }))
    }, [windowVisible, dispatch, debouncedState.blockTimestamp, debouncedState.chainId])
  
    useEffect(() => {
      // @ts-ignore TYPE NEEDS FIXING
      dispatch(updateChainId({ chainId: debouncedState.chainId ? debouncedState.chainId ?? null : null }))
    }, [dispatch, debouncedState.chainId])
  
    // useEffect(() => {
    //   if (!account || !library?.provider?.request || !library?.provider?.isMetaMask) {
    //     return;
    //   }
    //   switchToNetwork({ library })
    //     .then((x) => x ?? dispatch(setImplements3085({ implements3085: true })))
    //     .catch(() => dispatch(setImplements3085({ implements3085: false })));
    // }, [account, chainId, dispatch, library]);
  
    return null
  }
  