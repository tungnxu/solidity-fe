import { combineReducers, configureStore } from "@reduxjs/toolkit"
import application from "./application/reducer"

const reducer = combineReducers({
    application
})

const store = configureStore({
    reducer
})

export type AppState = ReturnType<typeof reducer>

export default store