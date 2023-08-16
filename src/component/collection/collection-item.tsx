import './collection-item.styl'
import type { UserSubjectCollection } from './type'
import { Rate } from 'antd'
import { decodeSubjectName } from 'src/lib/utils'
import { BangumiLink } from 'src/component/common/link'

export default function CollectionItem({ collection }: { collection: UserSubjectCollection }) {
    const subject = decodeSubjectName(collection.subject)
    return (
        <div className="subject-collection-item">
            <img src={ subject.images?.small } alt={ subject.name_cn } />
            <div className="bangumi-content">
                <div className='title'>
                    <BangumiLink className="main-title" bangumi={subject}></BangumiLink>
                    <span className="sub-title">{ subject.name }</span>
                </div>
                <div className='info'>
                    <span>{ subject.eps + '话' }</span>
                    <span>{ ' / ' + subject.date }</span>
                </div>
                <div className='rate'>
                    <Rate value={subject.score / 2} disabled allowHalf style={{ fontSize: '15px' }}/>
                    <span> ({subject.score})</span>
                </div>
            </div>
        </div>
    )
}
