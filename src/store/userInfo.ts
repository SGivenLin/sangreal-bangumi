import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface InitialState{
    searchUserInfo: {
        username: string
    },
}

const initialState: InitialState = {
    searchUserInfo: {
        username: ''
    }
}

export const slice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setSearchUserInfo: (state, action: PayloadAction<InitialState['searchUserInfo']>) => {
            state.searchUserInfo = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setSearchUserInfo } = slice.actions
export default slice.reducer