import './collection-item.styl'
import type { UserSubjectCollection } from './type'
import { Rate } from 'antd';
import { baseUrl } from 'src/lib/const'
import { decodeSubjectName } from 'src/lib/utils';

export default function CollectionItem({ collection }: { collection: UserSubjectCollection }) {
    const subject = decodeSubjectName(collection.subject)
    return (
        <div className="subject-collection-item">
            <img src={ subject.images?.small } alt={ subject.name_cn } />
            <div className="bangumi-content">
                <div className='title'>
                    <a className="main-title" target="_blank" href={`${baseUrl}/subject/${subject.id}`} rel="noreferrer">{ subject.name_cn }</a>
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
