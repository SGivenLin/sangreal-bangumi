import type { CollectionRes } from 'src/component/Collection/type'
import Store from 'electron-store'
import api from 'src/service'

interface CollectionStore {
    collection: CollectionRes['data'],
    updateDate: number,  
}

const store = new Store<Record<string, CollectionStore>>({
    name: 'collection',
})

async function setCollectionListCache(username: string, collection: CollectionRes['data']) {
    store.set(username, {
        collection,
        updateDate: Date.now(),
    })
}

interface CollectionListCacheResult {
    useCache: boolean,
    result: CollectionStore,
}

async function diffCollectionCache(username: string): Promise<CollectionListCacheResult> {
    let result  = store.get(username, {collection: [], updateDate: 0 })
    const collection = result.collection
    let useCache = false
    const latestCollection = await api.getCollectionList({
        subject_type:2,
        type:2,
        limit:1,
    }, { username }).catch(e => ({ total: null }))
    if (latestCollection.total && collection.length === latestCollection.total && collection[0].updated_at === latestCollection.data[0].updated_at) {
        useCache = true
    }
    return { useCache, result }
}

export { setCollectionListCache, diffCollectionCache }
export type { CollectionListCacheResult }