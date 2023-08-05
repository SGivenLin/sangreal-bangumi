import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Collection, CollectionRes } from 'src/component/Collection/type'
import { type FailList } from 'src/electron/ipcMain/const'

type failCollection = Collection & Partial<FailList[number]>

interface InitialState{
    collectionList: CollectionRes['data'],
    failList: failCollection[]
}

const initialState: InitialState = {
    collectionList: [],
    failList: [],
}

export const slice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        setCollectionList: (state, action: PayloadAction<CollectionRes['data']>) => {
            state.collectionList = action.payload
        },
        setFailList: (state, action: PayloadAction<FailList>) => {
            let list: failCollection[] = []
            state.collectionList.forEach(item => {
                for(const failInfo of action.payload) {
                    if (item.subject_id === failInfo.key) {
                        list.push({
                            ...item,
                            errno: failInfo.errno,
                            errmsg: failInfo.errmsg,
                        })
                    }
                }
            })
            state.failList = list
        },
    },
})

// Action creators are generated for each case reducer function
export const { setCollectionList, setFailList } = slice.actions

export default slice.reducer