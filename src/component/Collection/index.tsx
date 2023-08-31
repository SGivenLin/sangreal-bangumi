import { type RefObject, useEffect, useReducer, useRef, type FC } from 'react'
import List from './collection-list'
import type { CollectionRes } from './type'
import CollectionData from './CollectionData'
import { Collapse, type CollapseProps, Card, Divider, Select } from 'antd'
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

type CollectionGroup = 'rate' | 'date'
interface CollectionParams {
    group?: CollectionGroup
    group_name?: string
}
const collectionSelectOptions = [{
    label: '按评分',
    value: 'rate',
}, {
    label: '按播出年份',
    value: 'date',
}].map(item => ({ ...item, label: <span  style={{ color: '#808080' }}>{item.label}</span> }))

function Collection( { collectionList } : { collectionList: CollectionRes['data'] }) {
    const ref = useRef<HTMLDivElement>(null)
    const { group = 'rate', group_name } = useQuery<CollectionParams>()

    const groupListMap = {
        rate: getCollectionListByRate,
        date: getCollectionListByDate,
    }
    const [ items, dispatch ] = useReducer(( state: CollapseProps['items'], group: CollectionGroup) => {
        const groupList = groupListMap[group](collectionList)
        return getItems(groupList, group_name, ref)
    }, [])
    useEffect(() => {
        dispatch(group)
    }, [ group ])

    const username = useAppSelector(state => state.userInfo.searchUserInfo.username)
    useEffect(() => {
        group_name && ref.current?.scrollIntoView({ behavior: 'smooth' })
    }, [ group_name, items ])

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
                <div>
                    <span style={{ marginRight: 12 }}>
                        <UserOutlined style={{paddingRight: 4}}></UserOutlined>
                        <UserNameLink username={username} disabled={!username}>{ username || '-' }</UserNameLink>
                    </span>
                    <span>
                        <DatabaseOutlined style={{paddingRight: 4}}></DatabaseOutlined>
                        <CollectionLink username={username} disabled={!collectionList.length}>收藏：{ collectionList.length }</CollectionLink>
                    </span>
                </div>
                <Select
                    defaultValue={group}
                    options={collectionSelectOptions}
                    bordered={false}
                    onSelect={dispatch}
                    style={{ width: 140, textAlign: 'right' }}
                ></Select>
            </div>
            <Divider style={{ margin:'8px 0 0 0' }}></Divider>
            <Collapse
                bordered={false}
                ghost
                size='large'
                defaultActiveKey={group_name || undefined}
                items={items}
            />
        </Card>

    )
}

function getCollectionListByRate(collectionList: CollectionRes['data']) {
    const group = new CollectionData(collectionList).groupByRate()
    let list: IGroupList = []
    for(const [rate, collectionList] of group) {
        const title = CollectionData.groupRate2Str(rate)
        collectionList.length && list.push({
            title,
            collectionList: collectionList,
        })
    }
    return list.reverse()
}

function getCollectionListByDate(collectionList: CollectionRes['data']) {
    const group = new CollectionData(collectionList).groupByDate()
    let list: IGroupList = []
    for(const [date, collectionList] of group) {
        const title = CollectionData.groupDate2Str(date)
        collectionList.length && list.push({
            title,
            collectionList: collectionList,
        })
    }
    return list.reverse()
}

export default Collection