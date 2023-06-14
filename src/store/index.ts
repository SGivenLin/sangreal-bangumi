import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import collectionReducer from './collection'
import authorReducer from './author'
import loadingReducer from 'src/store/loading'

const store = configureStore({
    reducer: {
        collection: collectionReducer,
        author: authorReducer,
        loading: loadingReducer,
    },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector