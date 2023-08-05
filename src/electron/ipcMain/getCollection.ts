import { ipcMain } from 'electron'
import { getCollectionListCache, setCollectionListCache } from './const'
import { once } from './utils'
import type { CollectionRes } from 'src/component/Collection/type'
import Store from 'electron-store'
import api from 'src/service'

const store = new Store<Record<string, CollectionRes['data']>>({
    name: 'collection'
})

async function setGetCollectionIpc() {
    ipcMain.handle(getCollectionListCache, once(async (e: any, data: { username: string }) => {
        const res = await diffCollectionCache(data.username)
        return res
    }))

    ipcMain.handle(setCollectionListCache, once(async (e: any, data: { username: string, collection: CollectionRes['data'] }) => {
        return store.set(data.username, data.collection)
    }))
}

interface GetCollectionListCache {
    useCache: boolean,
    collection: CollectionRes['data']
}

async function diffCollectionCache(username: string): Promise<GetCollectionListCache> {
    let cacheCollection  = store.get(username, [])
    let useCache = false
    const latestCollection = await api.getCollectionList({
        subject_type:2,
        type:2,
        limit:1,
    }, { username }).catch(e => ({ data: [] }))
    if (cacheCollection.length && latestCollection.data.length && JSON.stringify(cacheCollection[0]) === JSON.stringify(latestCollection.data[0])) {
        useCache = true
    }
    return { useCache, collection: cacheCollection }
}

export default setGetCollectionIpc
export type { GetCollectionListCache }