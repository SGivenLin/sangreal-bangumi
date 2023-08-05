import './author-item.styl'
import type { AuthorData } from './type'
import { baseUrl } from 'src/lib/const'
import { decodeHtml } from 'src/lib/utils'
import { formatSubjectString } from 'src/component/Collection/utils'
import { Divider } from 'antd'

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

export default function AuthorList({ authorData, index }: { authorData: AuthorData[], index: number }) {
    const author = authorData[0]
    const image = JSON.parse(author.author_images || '{}').small
    const subjectList = groupBySubject(authorData)
    const author_name = decodeHtml(author.author_name)

    const val = ['#FE2D46', '#FF6600', '#FAA90E'][index]
    let style = val ?  {
        backgroundImage: `linear-gradient(to right, ${val} 40%, ${val}00)`,
        fontWeight: 'bold',
    } : {}
    return (
        <div className="subject-author-item">
            <div className='item-header'>
                <img src={ image } alt={ author_name } />
                <div className="bangumi-content">
                    <a className="title" target="_blank" href={`${baseUrl}/person/${author.author_id}`} rel="noreferrer">{ author_name }</a>
                    <span className="subject-count">({ subjectList.length })</span>
                </div>
                <span className='bangumi-rank-icon' style={style}>{ index + 1 }</span>
            </div>
            <Divider></Divider>
            <div className='bangumi-list'>
                {  subjectList.map(item => <SubjectSide authorData={item} key={item[0].subject_id}></SubjectSide>) }
            </div>
        </div>
    )
}


function SubjectSide({ authorData }: { authorData: AuthorData[] }) {
    const subject = formatSubjectString(authorData[0])
    const isIgnore = authorData.every(item => item.isIgnore)
    return (
        <div className='relation-content' style={{opacity: isIgnore ? '.6' : '1'}}>
            <div>
                <a className="title" target="_blank" href={`${baseUrl}/subject/${subject.subject_id}`} rel="noreferrer">{ subject.subject.name_cn || subject.subject.name }</a>
                <span className='rate'>
                    <span className='subject-rate'> ({ subject.rate || '-' }</span>
                    <span>/</span>
                    <span className='subject-score'>{ subject.subject.score })</span>
                </span>

            </div>
            <div>
                {
                    authorData.map(item => {
                        const style = !isIgnore && item.isIgnore ? {
                            opacity: '.8',
                            fontWeight: 'normal',
                        } : {}
                        return <div key={item.subject_id + item.relation} className='tag-relation' style={style}>{ item.relation }</div>
                    })
                }
            </div>
        </div>
    )
}