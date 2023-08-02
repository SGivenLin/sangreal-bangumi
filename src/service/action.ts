import api from './index'
import type { CollectionRes } from '../component/Collection/type'

async function getAllCollection(params: object, option: object, cb?: (list: CollectionRes['data']) => void) {
    const maxLength = Number.MAX_SAFE_INTEGER // todo
    let list: CollectionRes['data'] = []
    let total = Infinity

    while(list.length < total && list.length < maxLength) {
        const curOffset = list.length
        const res = await api.getCollectionList({
            ...params,
            offset: curOffset
        }, option)
        if (total === Infinity) {
            total = res.total
        }
        list = list.concat(res.data)
        cb && cb(list)
    }

    return list
}


export {
    getAllCollection
}