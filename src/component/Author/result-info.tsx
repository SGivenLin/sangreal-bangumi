import { Popover } from 'antd'
import { DatabaseOutlined, UserOutlined } from '@ant-design/icons'
import { useAppSelector } from 'src/store'
import './result-info.styl'
import { BangumiLink } from '../common/link'

function ResultInfo() {
    const collectionList = useAppSelector(state => state.collection.collectionList)
    const failCollectionList = useAppSelector(state => state.collection.failList)
    const _authorList = useAppSelector(state => state.author._authorList)
    const authorList = useAppSelector(state => state.author.authorList)

    const failContent = <ul className='fail-content'>
        {failCollectionList.map(item =>
            <li key={item.subject_id}>
                <BangumiLink className="title" bangumi={item.subject}></BangumiLink>
                <span>（{item.errmsg || '-'}）</span>
            </li>
        )}
    </ul>
    return (
        <div className='result-info'>
            <div>
                <DatabaseOutlined style={{paddingRight: 4}} />
                <Popover
                    placement="rightTop"
                    title={<span style={{color: 'red'}}>数据获取失败</span>}
                    open={failCollectionList.length === 0 ? false : undefined }
                    content={failContent}>
                    <span>统计收藏：{ `${_authorList.length ? collectionList.length - failCollectionList.length : 0} / ${collectionList.length}` }</span>
                </Popover>
            </div>
            <div>
                <UserOutlined style={{paddingRight: 4}} />
                <span>制作人员(公司)：{ `${authorList.length} / ${_authorList.length}` }</span>
            </div>
        </div>
    )
}

export default ResultInfo