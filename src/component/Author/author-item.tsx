import './author-item.styl'
import type { AuthorData } from './type'

const baseUrl = 'https://bangumi.tv'

function groupBySubject(authorData: AuthorData[]): AuthorData[][] {
    let map: Map<AuthorData['subject_id'], AuthorData[]> = new Map()
    authorData.forEach(item => {
        if (map.has(item.subject_id)) {
            const data = map.get(item.subject_id)
            if (data) {
                map.set(item.subject_id, data.concat(item))
            }
        } else {
            map.set(item.subject_id, [item])
        }
    })
    return [ ...map.values() ]
}

export default function AuthorList({ authorData }: { authorData: AuthorData[] }) {
    const author = authorData[0]
    const image = JSON.parse(author.author_images || '{}').small
    const subjectList = groupBySubject(authorData)

    return (
        <div className="subject-item">
            <img src={ image} alt={ author.author_name } />
            <div className="bangumi-content">
                <a className="title" target="_blank" href={`${baseUrl}/person/${author.author_id}`} rel="noreferrer">{ author.author_name }</a>
            </div>
            <div className='bangumi-list'>
                {  subjectList.map(item => <SubjectSide authorData={item} key={item[0].subject_id}></SubjectSide>) }
            </div>
        </div>
    )
}


function SubjectSide({ authorData }: { authorData: AuthorData[] }) {
    const subject = authorData[0]
    return (
        <div className='relation-content'>
            <div><a className="title" target="_blank" href={`${baseUrl}/subject/${subject.subject_id}`} rel="noreferrer">{ subject.subject.name_cn }</a></div>
            <div>{ authorData.map(item => <div key={item.subject_id + item.relation} className='tag-relation'>{ item.relation }</div>) }</div>
        </div>
    )
}