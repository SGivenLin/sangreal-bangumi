import type { CollectionRes } from 'src/component/Collection/type'
import Store from 'electron-store'
import api from 'src/service'

const store = new Store<Record<string, CollectionRes['data']>>({
    name: 'collection',
})

async function setCollectionListCache(username: string, collection: CollectionRes['data']) {
    store.set(username, collection)
}

interface CollectionListCacheResult {
    useCache: boolean,
    collection: CollectionRes['data']
}

async function diffCollectionCache(username: string): Promise<CollectionListCacheResult> {
    let cacheCollection  = store.get(username, [])
    let useCache = false
    const latestCollection = await api.getCollectionList({
        subject_type:2,
        type:2,
        limit:1,
    }, { username }).catch(e => ({ total: null }))
    if (cacheCollection.length === latestCollection.total && cacheCollection[0].updated_at === latestCollection.data[0].updated_at) {
        useCache = true
    }
    return { useCache, collection: cacheCollection }
}

export { setCollectionListCache, diffCollectionCache }
export type { CollectionListCacheResult }