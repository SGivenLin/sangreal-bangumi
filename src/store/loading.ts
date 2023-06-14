import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface InitialState{
    loading: boolean,
    text: string,
}

const initialState: InitialState = {
    loading: true,
    text: ''
}

export const slice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<Partial<InitialState>>) => {
            return {
                ...state,
                ...action.payload
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { setLoading } = slice.actions

export default slice.reducer