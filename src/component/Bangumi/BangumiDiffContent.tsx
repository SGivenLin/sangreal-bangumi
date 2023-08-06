import './BangumiDiffContent.styl'
import { FC } from 'react'
import { BangumiContent } from './type'
import { Divider } from 'antd'
import { TeamOutlined } from '@ant-design/icons'
import { baseUrl } from 'src/lib/const'
import { decodeSubjectName, decodeHtml } from 'src/lib/utils'

const diffColor = ['', '#FFF0E3', '#98FB98']

const BangumiDiffContent: FC<{ bangumiContent: BangumiContent }> = ({ bangumiContent }) => {
    bangumiContent = decodeSubjectName(bangumiContent)
    return (
        <div className='bangumi-content'>
            
            <div className='bangumi-title'>
                <img src={bangumiContent.images?.small} className='bangumi-img' alt={bangumiContent.name}></img>
                <div><a className="title" target="_blank" href={`${baseUrl}/subject/${bangumiContent.id}`} rel="noreferrer">{ bangumiContent.name_cn }</a></div>
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
                                    return <span key={author.name} className="auhor-name" style={style}>{ decodeHtml(author.name) }</span>
                                }
                            )} </div>
                    </div>
                )) }
            </div>
        </div>
    )
}

export default BangumiDiffContent