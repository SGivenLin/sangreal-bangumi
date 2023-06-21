import { Popover } from 'antd'
import { useAppSelector } from 'src/store'
import './result-info.styl'
import { baseUrl } from 'src/lib/const'

function ResultInfo() {
    const collectionList = useAppSelector(state => state.collection.collectionList)
    const failCollectionList = useAppSelector(state => state.collection.failList)

    const failContent = <div className='fail-content'>
        {failCollectionList.map(item => <div key={item.subject_id}><a className="title" target="_blank" href={`${baseUrl}/subject/${item.subject_id}`} rel="noreferrer">{ item.subject.name_cn }</a></div>)}
    </div>
    return (
        <div className='result-info'>
            <span>共统计收藏：{ collectionList.length - failCollectionList.length }</span>
            {
                failCollectionList.length
                ? <Popover placement="rightTop" content={failContent}><span className="result-fail">失败：{ failCollectionList.length }</span></Popover>
                : <span className="result-fail">失败：{ failCollectionList.length }</span>
            }
        </div>
    )
}

export default ResultInfo