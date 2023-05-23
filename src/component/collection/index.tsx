import { useEffect, useReducer, useState } from 'react'
import Item from './collection-item'
import List from './collection-list'
import type { CollectionRes, IGroup } from './type'
import { groupCollectionByRate } from './utils'
import './index.styl'

type IGroupList = Array<{
    title: string,
    collectionList: CollectionRes['data'],
}>

function Collection( { collectionList } : { collectionList: CollectionRes['data'] }) {
    const [ groupList, dispatch ] = useReducer((state: IGroupList, group: IGroup )=> {
        let list: IGroupList = []
        for(const [rate, collectionList] of group) {
            const title = Array.isArray(rate) ? `${rate[0]}-${rate[1]}分` : rate === 0 ? '未评分' : `${rate}分`
            list.push({
                // rate,
                title,
                collectionList: collectionList
            })
        }
        return list
    }, [])
    useEffect(() => {
        dispatch(groupCollectionByRate(collectionList, [10, 9, 8, 7, [6, 1], 0]))
    }, [ collectionList ])

                       
    return (
        <>
            {
                groupList.map(item => (
                    item.collectionList.length !== 0 &&
                    <List key={item.title}>
                        <div>
                            <span className="group-title">{ item.title }</span>
                            <span className="group-count">({ item.collectionList.length })</span>
                        </div>
                        { item.collectionList.map(collection => <Collection.Item collection={collection} key={collection.subject_id}></Collection.Item>) }
                    </List>
                ))
            }
        </>

    )
}
Collection.Item = Item
Collection.List = List


export default Collection