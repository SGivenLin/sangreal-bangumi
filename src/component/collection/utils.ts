import type { CollectionRes, IGroup, IGroupRate } from './type'

function groupCollectionByRate(collectionList: CollectionRes['data'], groupRate: Array<IGroupRate>) {
    const group: IGroup = new Map()
    groupRate.forEach(item => {
        group.set(item, [])
    })
    collectionList.forEach(collection => {
        const rate = collection.rate
        const key = getMapKey(rate, group)
        if (key !== null) {
            group.get(key)?.push(collection)
        } else {
            console.error(`未找到key:${rate}`, collection)
        }
    })
    return group
}

function getMapKey(rate: CollectionRes['data'][number]['rate'], map: IGroup): IGroupRate | null {
    if (map.get(rate)) {
        return rate
    } else {
        for(let key of map.keys()) {
            if (Array.isArray(key)) {
                const [ max, min ] = key
                if (rate <= max && rate >= min) {
                    return key
                }
            }
        }
    }
    return null
}

export {
    groupCollectionByRate
}