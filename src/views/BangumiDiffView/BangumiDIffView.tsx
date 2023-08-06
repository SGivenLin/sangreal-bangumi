import './BangumiDIffView.styl'
import { Card, Input,  Divider, Button, InputRef, Col, Row } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import api from 'src/service';
import BangumiDiffContent from 'src/component/Bangumi/BangumiDiffContent'
import { DiffType, type BangumiContent, type AuthorList, type Bangumi } from 'src/component/Bangumi/type'
import { Author } from 'src/component/Author/type';
import { useFullLoading } from 'src/lib/hooks';

const BangumiDIffView = () => {

    const input1Ref = useRef<InputRef>(null)
    const input2Ref = useRef<InputRef>(null)
    const [bangumiContent1, setBangumiContent1] = useState<BangumiContent>()
    const [bangumiContent2, setBangumiContent2] = useState<BangumiContent>()

    const onClick = useFullLoading(async () => {
        const bangumiId1 = input1Ref.current?.input?.value?.trim()
        const bangumiId2 = input2Ref.current?.input?.value?.trim()

        if (!bangumiId1 || !bangumiId2) {
            return
        }
        // 285666 331752
        const getProducerList1 = api.getProducerList({}, { subject_id: bangumiId1 })
        const getProducerList2 = api.getProducerList({}, { subject_id: bangumiId2 })
        const getBangumiInfo1 = api.getBangumiInfo({}, { subject_id: bangumiId1 })
        const getBangumiInfo2 = api.getBangumiInfo({}, { subject_id: bangumiId2 })
        const [ authorList1, authorList2, bangumiInfo1, bangumiInfo2 ] = await Promise.all([getProducerList1, getProducerList2, getBangumiInfo1, getBangumiInfo2])
       
        addDiff(authorList1, authorList2)
        const staffList1 = groupAuthorList(authorList1, bangumiInfo1)
        const staffList2 = groupAuthorList(authorList2, bangumiInfo2)

        console.log(authorList1, bangumiInfo1, staffList1)

        setBangumiContent1({
            ...bangumiInfo1,
            staffList: staffList1,
        })
        setBangumiContent2({
            ...bangumiInfo2,
            staffList: staffList2,
        })
    }, '正在查询')

    return (
    <Card>
        <div className="bangumi-diff-header">
            <div className='bangumi-left'>
                <Input ref={input1Ref} placeholder='bangumi id'></Input>
            </div>
            <div><Button shape="circle" size='large' icon={<SearchOutlined />} onClick={onClick} /></div>
            {/* <Divider></Divider> */}
            <div className='bangumi-right'>
                <Input ref={input2Ref} placeholder='bangumi id'></Input>
            </div>
        </div>
        <Row>
            { bangumiContent1 && <Col span={11}><BangumiDiffContent bangumiContent={bangumiContent1}></BangumiDiffContent></Col>}
            <Col span={2}><Divider type="vertical" style={{ height: '100%', textAlign: 'center' }} /></Col>
            { bangumiContent2 && <Col span={11} style={{ paddingLeft: 12 }}><BangumiDiffContent bangumiContent={bangumiContent2}></BangumiDiffContent></Col>}
        </Row>
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

function addDiff(authorList1: AuthorList, authorList2: AuthorList): void {
    authorList1.forEach(author1 => {
        authorList2.forEach(author2 => {
            if (author1.id === author2.id) {
                let diffType = DiffType.person_same
                if (author1.relation === author2.relation) {
                    diffType = DiffType.all_same
                }
                if(diffType > (author1.diffType || 0)) {
                    author1.diffType = diffType
                }

                if(diffType > (author2.diffType || 0)) {
                    author2.diffType = diffType
                }
            }
        })
    })

}

export default BangumiDIffView