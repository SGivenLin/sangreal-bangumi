import type { CollectionRes, IGroup, IGroupRate } from './type'

class CollectionData {
    static groupRateList: IGroupRate[] = [10, 9, 8, 7, [6, 1], 0]
    collectionList: CollectionRes['data']
    constructor(collectionList: CollectionRes['data']) {
        this.collectionList = collectionList
    }

    groupCollectionByRate(groupRate: IGroupRate[] = CollectionData.groupRateList) {
        const group: IGroup = new Map()
        groupRate.forEach(item => {
            group.set(item, [])
        })
        this.collectionList.forEach(collection => {
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

    static groupRate2Str(rate: IGroupRate) {
        return Array.isArray(rate) ? `${rate[0]}-${rate[1]}分` : rate === 0 ? '未评分' : `${rate}分`
    }
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

export default CollectionData