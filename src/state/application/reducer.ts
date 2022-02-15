import { createReducer } from "@reduxjs/toolkit";
import { updateBlockNumber, updateBlockTimestamp, updateChainId, setChainConnectivityWarning } from "./actions";

export interface ApplicationState {
    readonly blockNumber: { readonly [chainId: number]: number }
    readonly blockTimestamp: { readonly [chainId: number]: number }
    readonly chainConnectivityWarning: boolean
    readonly chainId: number | null
}

const initialState: ApplicationState = {
    blockNumber: {},
    blockTimestamp: {},
    chainConnectivityWarning: false,
    chainId: null
}

const application = createReducer(initialState, (builder) => {
    builder
        .addCase(updateBlockNumber, (state, action) => {
            const { chainId, blockNumber } = action.payload
            if (typeof state.blockNumber[chainId] !== 'number') {
                state.blockNumber[chainId] = blockNumber
            } else {
                state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
            }
        })
        .addCase(updateBlockTimestamp, (state, action) => {
            const { chainId, blockTimestamp } = action.payload
            if (typeof state.blockTimestamp[chainId] !== 'number') {
                state.blockTimestamp[chainId] = blockTimestamp
            } else {
                state.blockTimestamp[chainId] = Math.max(blockTimestamp, state.blockTimestamp[chainId])
            }
        })
        .addCase(updateChainId, (state, action) => {
            const { chainId } = action.payload
            state.chainId = chainId
        })
        .addCase(setChainConnectivityWarning, (state, action) => {
            const { chainConnectivityWarning } = action.payload
            state.chainConnectivityWarning = chainConnectivityWarning
        })
})

export default application