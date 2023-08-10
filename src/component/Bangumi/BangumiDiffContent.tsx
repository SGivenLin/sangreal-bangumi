import './BangumiDiffContent.styl'
import { FC } from 'react'
import { BangumiContent } from './type'
import { Divider } from 'antd'
import { TeamOutlined } from '@ant-design/icons'
import { AuthorLink, BangumiLink } from '../common/link'

const diffColor = ['', '#FFE4C4', '#98FB98']

const BangumiDiffContent: FC<{ bangumiContent: BangumiContent }> = ({ bangumiContent }) => {
    return (
        <div className='bangumi-content'>
            
            <div className='bangumi-title'>
                <img src={bangumiContent.images?.small} className='bangumi-img' alt={bangumiContent.name}></img>
                <div><BangumiLink className="title" bangumi={bangumiContent}></BangumiLink></div>
            </div>
            <Divider plain><span style={{ color: '#999' }}><TeamOutlined /> staff</span></Divider>
            <div className='bangumi-staff'>
                { bangumiContent.staffList.map(item => (
                    <div key={item.relation} className="staff-item">
                        <div className='staff-label'>{ item.relation }</div>
                        <div className='staff-author'>
                            { item.authorList.map(author => {
                                    let style = {}
                                    if (author.diffType) {
                                        style = {
                                            backgroundColor: diffColor[author.diffType]
                                        }
                                    }
                                    return author.id
                                        ? <AuthorLink key={author.name} author={author} className="auhor-name" style={style}></AuthorLink>
                                        : <span style={{ color: '#000' }}>{ author.name }</span>
                                }
                            )} </div>
                    </div>
                )) }
            </div>
        </div>
    )
}

export default BangumiDiffContent