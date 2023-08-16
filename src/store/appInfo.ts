import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface InitialState{
    app: {
        appName: string,
        version: string
        isLatest: boolean | null
    },
}

const initialState: InitialState = {
    app: {
        appName: '',
        version: '',
        isLatest: null
    },
}

export const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppInfo(state, action: PayloadAction<Partial<InitialState['app']>>) {
            if (action.payload.version) {
                action.payload.version = action.payload.version.replace(/^([^v])/i, 'v$1')
            }

            Object.assign(state.app, action.payload)
        },
    },
})

// Action creators are generated for each case reducer function
export const { setAppInfo } = slice.actions
export default slice.reducer