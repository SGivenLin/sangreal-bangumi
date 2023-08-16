import { useEffect, useReducer } from 'react'
import Item from './collection-item'
import List from './collection-list'
import type { CollectionRes, IGroup } from './type'
import CollectionData from './CollectionData'
import { Collapse, type CollapseProps, Card, Divider } from 'antd'
import { DatabaseOutlined, UserOutlined } from '@ant-design/icons'
import './index.styl'
import { useAppSelector } from 'src/store'
import { UserNameLink, CollectionLink } from '../common/link'

type IGroupList = Array<{
    title: string,
    collectionList: CollectionRes['data'],
}>

function getItems(list: IGroupList): CollapseProps['items'] {
    return list.map(item => ({
        key: item.title,
        label: <GroupTitle subject={item}></GroupTitle>,
        children: <List key={item.title}>
            { item.collectionList.map(collection => <Collection.Item collection={collection} key={collection.subject_id}></Collection.Item>) }
        </List>,
    }))
}

function Collection( { collectionList } : { collectionList: CollectionRes['data'] }) {
    
    const [ groupList, dispatch ] = useReducer((state: IGroupList, group: IGroup )=> {
        let list: IGroupList = []
        for(const [rate, collectionList] of group) {
            const title = CollectionData.groupRate2Str(rate)
            collectionList.length && list.push({
                title,
                collectionList: collectionList,
            })
        }
        return list
    }, [])
    useEffect(() => {
        const collectionData = new CollectionData(collectionList)
        dispatch(collectionData.groupCollectionByRate())
    }, [collectionList])

    const username = useAppSelector(state => state.userInfo.searchUserInfo.username)
    return (
        <Card bodyStyle={{padding: 0}}>
            <div style={{
                color: '#1677ff',
                fontSize: 20,
                fontWeight: 'bold',
                padding: '8px 20px 0',
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <span>
                    <UserOutlined style={{paddingRight: 4}}></UserOutlined>
                    <UserNameLink username={username} disabled={!username}>{ username || '-' }</UserNameLink>
                </span>
                <span>
                    <DatabaseOutlined style={{paddingRight: 4}}></DatabaseOutlined>
                    <CollectionLink username={username} disabled={!collectionList.length}>收藏：{ collectionList.length }</CollectionLink>
                </span>
            
            </div>
            <Divider style={{ margin:'8px 0 0 0' }}></Divider>
            <Collapse
                bordered={false}
                ghost
                size='large'
                items={getItems(groupList)}
            />
        </Card>

    )
}

function GroupTitle({ subject }: { subject: IGroupList[number] }) {
    return (
        <div>
            <span className="group-title">{ subject.title }</span>
            <span className="group-count">({ subject.collectionList.length })</span>
        </div>
    )
}

Collection.Item = Item
Collection.List = List


export default Collection