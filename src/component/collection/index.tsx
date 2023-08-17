import { type RefObject, useEffect, useReducer, useRef, type FC } from 'react'
import List from './collection-list'
import type { CollectionRes, IGroupRange, UserSubjectCollection } from './type'
import CollectionData from './CollectionData'
import { Collapse, type CollapseProps, Card, Divider } from 'antd'
import { DatabaseOutlined, UserOutlined } from '@ant-design/icons'
import './index.styl'
import { useAppSelector } from 'src/store'
import { UserNameLink, CollectionLink } from '../common/link'
import { useQuery } from 'src/lib/url'

type IGroupList = Array<{
    title: string,
    collectionList: CollectionRes['data'],
}>

const GroupTitle: FC<{ subject: IGroupList[number] }> = ({ subject }) => {
    return (
        <div>
            <span className="group-title">{ subject.title }</span>
            <span className="group-count">({ subject.collectionList.length })</span>
        </div>
    )
}

function getItems(list: IGroupList, name: string | undefined, ref: RefObject<HTMLDivElement>): CollapseProps['items'] {
    return list.map(item => {
        return {
            key: item.title,
            ref: name === item.title ? ref : undefined,
            label:  <GroupTitle subject={item}></GroupTitle>,
            children: <List key={item.title} list={item.collectionList}></List>,
        }
    })
}

interface CollectionParams {
    group?: 'rate' | 'date',
    name?: string
}
function Collection( { collectionList } : { collectionList: CollectionRes['data'] }) {
    const ref = useRef<HTMLDivElement>(null)
    const { group = 'rate', name } = useQuery<CollectionParams>()
    const groupListMap = {
        rate: useCollectionListByRate,
        date: useCollectionListByDate,
    }

    const groupList = groupListMap[group](collectionList)
    const items = getItems(groupList, name, ref)
    const username = useAppSelector(state => state.userInfo.searchUserInfo.username)

    useEffect(() => {
        name && ref.current?.scrollIntoView({ behavior: 'smooth' })
    })

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
                defaultActiveKey={name || undefined}
                items={items}
            />
        </Card>

    )
}

function useCollectionListByRate(collectionList: CollectionRes['data']) {
    const [ groupList, dispatch ] = useReducer((state: IGroupList, group: [IGroupRange, UserSubjectCollection[]][])=> {
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
        dispatch(collectionData.groupByRate())
    }, [collectionList])

    return groupList.reverse()
}


function useCollectionListByDate(collectionList: CollectionRes['data']) {
    const [ groupList, dispatch ] = useReducer((state: IGroupList, group: [IGroupRange, UserSubjectCollection[]][])=> {
        let list: IGroupList = []
        for(const [date, collectionList] of group) {
            const title = CollectionData.groupDate2Str(date)
            collectionList.length && list.push({
                title,
                collectionList: collectionList,
            })
        }
        return list
    }, [])
    useEffect(() => {
        const collectionData = new CollectionData(collectionList)
        dispatch(collectionData.groupByDate())
    }, [collectionList])

    return groupList.reverse()
}

export default Collection