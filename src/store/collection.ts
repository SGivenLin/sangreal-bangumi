import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CollectionRes } from 'src/component/collection/type'
import type { PromisesResult } from 'src/lib/utils' 

interface InitialState{
    collectionList: CollectionRes['data'],
    failList: CollectionRes['data']
}

const initialState: InitialState = {
    collectionList: [],
    failList: [],
}

export const counterSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        setCollectionList: (state, action: PayloadAction<CollectionRes['data']>) => {
            state.collectionList = action.payload
        },
        setFailList: (state, action: PayloadAction<PromisesResult<any>['failResults']>) => {
            const list = state.collectionList.filter(item => {
                for(const key of action.payload) {
                    if (item.subject_id === key.key) {
                        return true
                    }
                }
                return false
            })
            state.failList = list
        },
    },
})

// Action creators are generated for each case reducer function
export const { setCollectionList, setFailList } = counterSlice.actions

export default counterSlice.reducer