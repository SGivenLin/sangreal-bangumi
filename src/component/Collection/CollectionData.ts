import type { CollectionRes, IGroupRange, IGroup } from './type'

class CollectionData {
    static groupRateList: IGroupRange[] = [0, [1, 6], 7, 8, 9, 10]
    static groupDateList: IGroupRange[] = [ -Infinity ,[0, 1979], [1980, 1989], [1990, 1999], [2000, 2009], [2010, 2019], [2020, Infinity]]
    collectionList: CollectionRes['data']
    constructor(collectionList: CollectionRes['data']) {
        this.collectionList = collectionList
    }

    groupByRate(groupRate: IGroupRange[] = CollectionData.groupRateList) {
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
        return Array.from(group)
    }

    static groupRate2Str(rate: IGroupRange) {
        return Array.isArray(rate) ? `${rate[0]}-${rate[1]}分` : rate === 0 ? '未评分' : `${rate}分`
    }

    static groupDate2Str(date: IGroupRange) {
        if (date === -Infinity) {
            return '未知'
        } else if (Array.isArray(date)) {
            if (date[1] === Infinity) {
                return `${date[0]} 至今`
            } else {
                return `${date[0]} - ${date[1]}`
            }
        } else {
            return String(date)
        }
    }

    groupByDate(groupDate: IGroupRange[] = CollectionData.groupDateList) {
        const group: IGroup = new Map()
        groupDate.forEach(item => {
            group.set(item, [])
        })
        this.collectionList.forEach(collection => {
            const date = collection.subject.date
            const year = Number(date?.split('-')[0])
            const key = getMapKey(year, group) || -Infinity
            if (key !== null) {
                group.get(key)?.push(collection)
            } else {
                console.error(`未找到key:${date}`, collection)
            }
        })
        return Array.from(group)
    }
}


function getMapKey(rate: number, map: IGroup): IGroupRange | null {
    if (map.get(rate)) {
        return rate
    } else {
        for(let key of map.keys()) {
            if (Array.isArray(key)) {
                const max = Math.max(...key)
                const min = Math.min(...key)
                if (rate <= max && rate >= min) {
                    return key
                }
            }
        }
    }
    return null
}

export default CollectionData