import './collection-item.styl'
import type { UserSubjectCollection } from './type'

const baseUrl = 'https://bangumi.tv'

export default function CollectionItem({ collection }: { collection: UserSubjectCollection }) {
    const subject = collection.subject
    return (
        <div className="subject-item">
            <img src={ subject.images.small } alt={ subject.name_cn } />
            <div className="bangumi-content">
                <a className="title" target="_blank" href={`${baseUrl}/subject/${subject.id}`} rel="noreferrer">{ subject.name_cn }</a>
                <span className="sub-title">{ subject.name }</span>
            </div>
        </div>
    )
}
