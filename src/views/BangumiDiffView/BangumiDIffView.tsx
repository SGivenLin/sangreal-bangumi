import './BangumiDIffView.styl'
import { Card, Input,  Divider, Button, Col, Row, Alert, Checkbox, Tooltip } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useRef, useState } from 'react'
import api from 'src/service'
import BangumiDiffContent from 'src/component/Bangumi/BangumiDiffContent'
import BangumiSearchPanel from 'src/component/Bangumi/BangumiSearchPanel'
import { type BangumiContent, type Bangumi, type BangumiBySearch } from 'src/component/Bangumi/type'
import { Author } from 'src/component/Author/type'
import { useFullLoading, useScrollToTop } from 'src/lib/hooks'
import { addDiff, addDiffAll, getDiffText } from './getDiffRes'

const SearchBtn = ({ onClick }: { onClick?: React.DOMAttributes<HTMLSpanElement>['onClick'] }) => {
    return <Button type="link" className='search-btn'><span className='search-btn-text' onClick={onClick}>不知道id，按名搜索</span></Button>
}

const BangumiDIffView = () => {
    const [bangumiContent1, setBangumiContent1] = useState<BangumiContent>()
    const [bangumiContent2, setBangumiContent2] = useState<BangumiContent>()

    const [ input1Val, setInput1Value ] = useState('')
    const [ input2Val, setInput2Value ] = useState('')
    const [ diffText, setDiffText ] = useState('')
    const [ isDiffAll, setIsDiffAll ] = useState(false)

    const onClick = useFullLoading(async () => {
        const bangumiId1 = input1Val.trim()
        const bangumiId2 = input2Val.trim()

        if (!bangumiId1 || !bangumiId2) {
            return
        }
        // 285666 331752
        // 274613 284428
        const getProducerList1 = api.getProducerList({}, { subject_id: bangumiId1 })
        const getProducerList2 = api.getProducerList({}, { subject_id: bangumiId2 })
        const getBangumiInfo1 = api.getBangumiInfo({}, { subject_id: bangumiId1 })
        const getBangumiInfo2 = api.getBangumiInfo({}, { subject_id: bangumiId2 })
        const [ authorList1, authorList2, bangumiInfo1, bangumiInfo2 ] = await Promise.all([getProducerList1, getProducerList2, getBangumiInfo1, getBangumiInfo2])
        
        isDiffAll ? addDiffAll(authorList1, authorList2, bangumiInfo1, bangumiInfo2) : addDiff(authorList1, authorList2)
        const staffList1 = groupAuthorList(authorList1, bangumiInfo1)
        const staffList2 = groupAuthorList(authorList2, bangumiInfo2)
        setBangumiContent1({
            ...bangumiInfo1,
            staffList: staffList1,
        })
        setBangumiContent2({
            ...bangumiInfo2,
            staffList: staffList2,
        })

        setDiffText(getDiffText(authorList1, authorList2))
    }, '正在查询')
    type searchCb = typeof setInput1Value
    const curSearchCbRef = useRef<searchCb>(() => {})
    const [searchPanelOpen, setSearchPanelOpen] = useState(false)

    const searchBtnClick = (cb: searchCb) => {
        setSearchPanelOpen(true)
        curSearchCbRef.current = cb
    }

    const onSelectBangumi = (item: BangumiBySearch) => {
        curSearchCbRef.current(String(item.id))
        setSearchPanelOpen(false)
    }
    const [ isTop, containerRef ] = useScrollToTop()

    return (
        <Card className='bangumi-diff' bodyStyle={{ padding: 0 }}>
            <div className={`bangumi-diff-header ${isTop && 'is-sticky' }`} ref={containerRef}>
                <div className="bangumi-diff-search">
                    <div className='bangumi-left'>
                        <Input placeholder='bangumi id' value={input1Val} onChange={e => setInput1Value(e.target.value)}></Input>
                        <SearchBtn onClick={() => searchBtnClick(setInput1Value)}></SearchBtn>
                    </div>
                    <div>
                        <Button className='diff-btn' shape="circle" size='large' type='primary' ghost={true} icon={<SearchOutlined />} onClick={onClick} />
                        <div>
                            <Checkbox className='diff-check' checked={isDiffAll} onChange={(e) => setIsDiffAll(e.target.checked)}>
                                <Tooltip title="冷门动画，尝试查询全部被记录的制作方(未被bangumi.tv的人物收录，存在误判)">全部信息比对</Tooltip>
                            </Checkbox>
                        </div>
                    </div>
                    <div className='bangumi-right'>
                        <Input placeholder='bangumi id' value={input2Val} onChange={e => setInput2Value(e.target.value)}></Input>
                        <SearchBtn onClick={() => searchBtnClick(setInput2Value)}></SearchBtn>
                    </div>
                </div>
                <Alert
                    message={diffText ? <span className="diff-text">对比结果：{<span className='diff-text-res'>{diffText}</span>}</span> : '输入动画id后查询，进行对比'}
                    style={{ textAlign: 'center' }}
                ></Alert>
            </div>
            {
                bangumiContent1 && bangumiContent2 &&
                <Row style={{ padding: 24 }}>
                    { <Col span={11}><BangumiDiffContent bangumiContent={bangumiContent1}></BangumiDiffContent></Col>}
                    <Col span={2} style={{ textAlign: 'center' }}><Divider type="vertical" style={{ height: '100%' }} /></Col>
                    { <Col span={11}><BangumiDiffContent bangumiContent={bangumiContent2}></BangumiDiffContent></Col>}
                </Row>
            }
            <BangumiSearchPanel
                open={searchPanelOpen}
                onCancel={() => setSearchPanelOpen(false)}
                onSelect={onSelectBangumi}
            ></BangumiSearchPanel>
        </Card>)
}

function groupAuthorList(authorList: Author[], bangumiInfo: Bangumi) {
    const groupList = new Set([...bangumiInfo.infobox.map(item => item.key), ...authorList.map(item => item.relation)])
    let staffMap = new Map<string, Author[]>()
    groupList.forEach(relation => {
        authorList.forEach(author => {
            if (author.relation === relation) {
                staffMap.set(relation, (staffMap.get(relation) || []).concat([author]))
            }
        })
    })

    let staffList: BangumiContent['staffList'] = []
    for(const [ relation, authorList ] of staffMap) {
        staffList.push({
            relation,
            authorList,
        })
    }

    return staffList
}

export default BangumiDIffView