import { useEffect, useReducer } from 'react'
import Item from './collection-item'
import List from './collection-list'
import type { CollectionRes, IGroup } from './type'
import { groupCollectionByRate } from './utils'
import { Collapse, type CollapseProps, Card, Divider } from 'antd'
import { DatabaseOutlined, UserOutlined } from '@ant-design/icons'
import './index.styl'
import { useAppSelector } from 'src/store'
import { baseUrl } from 'src/lib/const'

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
        </List>
    }))
}

function Collection( { collectionList } : { collectionList: CollectionRes['data'] }) {
    const [ groupList, dispatch ] = useReducer((state: IGroupList, group: IGroup )=> {
        let list: IGroupList = []
        for(const [rate, collectionList] of group) {
            const title = Array.isArray(rate) ? `${rate[0]}-${rate[1]}分` : rate === 0 ? '未评分' : `${rate}分`
            collectionList.length && list.push({
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

    const username = useAppSelector(state => state.userInfo.searchUserInfo.username)
    const userLink = username ? `${baseUrl}/user/${username}` : '#'
    const hookPreventDefault = (test: () => boolean, fn?: React.DOMAttributes<HTMLAnchorElement>['onClick']) => {
        const cb: React.DOMAttributes<HTMLAnchorElement>['onClick'] = e => {
            test() && e.preventDefault();
            fn && fn(e)
        }
        return cb
    }

    const onUserNameLinkClick = hookPreventDefault(() => !username)
    return (
        <Card bodyStyle={{padding: 0}}>
            <div style={{
                color: '#1677ff',
                fontSize: 20,
                fontWeight: 'bold',
                padding: '8px 20px 0',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <span>
                    <UserOutlined style={{paddingRight: 4}}></UserOutlined>
                    <a onClick={onUserNameLinkClick} target="_blank" href={userLink} rel="noreferrer">{ username || '-' }</a>
                </span>
                <span>
                    <DatabaseOutlined style={{paddingRight: 4}}></DatabaseOutlined>
                    <a onClick={onUserNameLinkClick} target="_blank" href={`${baseUrl}/anime/list/${username}/collect`} rel="noreferrer">收藏：{ collectionList.length }</a>
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