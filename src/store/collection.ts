import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CollectionRes } from 'src/component/collection/type'

interface InitialState{
    collectionList: CollectionRes['data'],
}

const initialState: InitialState = {
    collectionList: [],
}

export const counterSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        setCollectionList: (state, action: PayloadAction<CollectionRes['data']>) => {
            state.collectionList = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setCollectionList } = counterSlice.actions

export default counterSlice.reducer