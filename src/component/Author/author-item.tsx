import './author-item.styl'
import type { AuthorData } from './type'
import { AuthorLink, BangumiLink } from 'src/component/common/link'
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

    const val = ['#FE2D46', '#FF6600', '#FAA90E'][index]
    let style = val ?  {
        backgroundImage: `linear-gradient(to right, ${val} 40%, ${val}00)`,
        fontWeight: 'bold',
    } : {}
    return (
        <div className="subject-author-item">
            <div className='item-header'>
                <img src={ image || require('src/static/user.jpg') } alt={ author.author_name } />
                <div className="bangumi-content">
                    <AuthorLink className="title" author={author}></AuthorLink>
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
    const subject = authorData[0]
    const isIgnore = authorData.every(item => item.isIgnore)
    return (
        <div className='relation-content' style={{opacity: isIgnore ? '.6' : '1'}}>
            <div>
                <BangumiLink className="title" bangumi={subject.subject}></BangumiLink>
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