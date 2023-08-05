import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import collectionReducer from './collection'
import authorReducer from './author'
import userInfoReducer from './userInfo'
import loadingReducer from 'src/store/loading'

const store = configureStore({
    reducer: {
        collection: collectionReducer,
        author: authorReducer,
        userInfo: userInfoReducer,
        loading: loadingReducer,
    },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector