import { Card, List } from 'antd'
import { type FC, useState } from 'react'
import { UserSubjectCollection } from './type'
import InfiniteScroll from 'react-infinite-scroll-component'
import Item from './collection-item'

const CollectionList: FC<{ list: UserSubjectCollection[] }> = ({ list }) => {
    const pageSize = 20
    const [data, setData] = useState<UserSubjectCollection[]>(list.slice(0, pageSize))
    const loadMoreData = () => {
        setData(list.slice(0, data.length + pageSize))
    }
    return (
        <Card bodyStyle={{ padding: '12px  0 0 0' }} style={{ marginBottom: '16px' }}>
            <InfiniteScroll
                dataLength={data.length}
                next={loadMoreData}
                hasMore={data.length < list.length}
                loader={null}
            >
                <List
                    dataSource={data}
                    renderItem={(item) => (<List.Item key={item.subject_id}><Item collection={item}></Item></List.Item>)}
                ></List>
            </InfiniteScroll>
        </Card>
    )
}

export default CollectionList
