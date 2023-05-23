import { configureStore } from '@reduxjs/toolkit'
import collectionReducer from './collection'

const store = configureStore({
    reducer: {
        collection: collectionReducer
    },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch