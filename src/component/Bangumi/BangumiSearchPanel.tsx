import { Input, Modal, type ModalFuncProps, List, message } from "antd"
import './BangumiSearchPanel.styl'
import api from 'src/service'
import { SubjectType, BangumiSearchResult, BangumiBySearch } from './type'
import { useState } from "react"
import { decodeSubjectName } from "src/lib/utils"
import { baseUrl } from "src/lib/const"
import { useLoading } from "src/lib/hooks"

type OnSelect = (bangumi: BangumiBySearch) => void

const BangumiSearchPanel = (props: ModalFuncProps & { onSelect: OnSelect }) => {
    const [ bangumiList, setBangumiList ] = useState<BangumiSearchResult['list']>([])
    
    const [ loading, onSearch ] = useLoading(async (val: string) => {
        val = val.trim()
        if (!val) return

        try {
            const res = await api.getSubjectListBySearch({
                type: SubjectType.anime,
                responseGroup: 'large',
                start: 0,
                max_results: 25,
            }, {
                keywords: encodeURIComponent(val)
            })
            setBangumiList(res.list)
        } catch (e: any){
            console.error(e)
            message.error(e?.message || '未知错误')
        }
    })

    const onClick = (item: BangumiBySearch, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        props.onSelect(item)
    }

    const onClickLink = (link: string, e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
        window.open(link, '_blank')
    }

    return  <Modal
        footer={null}
        title="动画搜索"
        { ...props }
    >
        <div className="bangumi-search-panel-content">
            <Input.Search
                className="bangumi-search-input"
                placeholder="动画名称"
                allowClear
                enterButton="搜索"
                size="large"
                loading={loading}
                onSearch={onSearch}
            />
            {/* <div className="demo">123</div> */}
            <div className="shadow"></div>
            <List
                header={<div style={{ fontWeight: 'bold' }}>搜索结果:</div>}
                dataSource={bangumiList}
                renderItem={item => {
                    item = decodeSubjectName(item)
                    const url = `${baseUrl}/subject/${item.id}`
                    return <List.Item className="bangumi-item" onClick={(e) => onClick(item, e)}>
                        <div><img className="bangumi-img" src={ item.images?.small } alt={item.name}></img></div>
                        <div className="content">
                            <div><a className="main-title" onClick={e => onClickLink(url, e)} href={url} target="_blank" rel="noreferrer">{ item.name_cn }</a></div>
                            <div className="sub-title">{item.name}</div>
                            <div className="date"> { item.air_date } </div>
                            <div className="score">
                                { item?.rating?.score || '' }
                                { item?.rating?.total && <span className="count">({ item?.rating?.total }人评分)</span> }
                            </div>
                        </div>
                        <div>
                            <div className="id">ID { item.id }</div>
                            { item.rank && <div className="rank">Rank { item.rank }</div> }
                        </div>
                    </List.Item>
                }}
            ></List>
        </div>
    </Modal>
}

export default BangumiSearchPanel