import { type AuthorList, DiffType, type Bangumi } from "src/component/Bangumi/type"
import { type Author } from 'src/component/Author/type'
import { jobMap } from 'src/lib/const'

const diffTextList = [{
    value: 60,
    text: '原班人马',
},{
    value: 40,
    text: '有亿点联系',
},{
    value: 20,
    text: '有一点联系',
},{
    value: 10,
    text: '基本无关',
},{
    value: 0,
    text: '毫不相干',
}]
function getDiffText(authorList1: AuthorList, authorList2: AuthorList) {
    const percent1 = getDiffPercent(authorList1)
    const percent2 = getDiffPercent(authorList2)
    const percent = Math.max(percent1, percent2) * 100

    let text = '卡巴斯基和巴基斯坦'
    for(const item of diffTextList) {
        if (percent > item.value) {
            text = item.text
            break
        }
    }
    return text
}

const powerMap: { [key: number]: string[] } = {
    3: [ ...jobMap['动画公司'], ...jobMap['监督'], '原作', '原案', '制片人', '企画' ],
    2: [ '作画监督', '总作画监督', '美术监督', '动作作画监督', '机械作画监督', '设定', '脚本', 'CG 导演', '演出', '制片人', '分镜构图', '分镜' ],
}
function getDiffPercent(authorList: AuthorList) {
    const totalPower = authorList.reduce(([ curPower, totalPower ], cur) => {
        let [ _curPower, _totalPower ] = [ 0, 1 ]
        for(const key in powerMap) {
            if ((powerMap[key]).includes(cur.relation)) {
                _totalPower = Number(key)
                break
            }
        }
        if (cur.diffType) {
            _curPower = _totalPower
        }
        return [ curPower + _curPower, totalPower + _totalPower ]
    }, [0, 0])
    return totalPower[0] / totalPower[1]
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

function addDiffAll(authorList1: AuthorList, authorList2: AuthorList, bangumiInfo1: Bangumi, bangumiInfo2: Bangumi) {
    mergeInfoBox(authorList1, bangumiInfo1)
    mergeInfoBox(authorList2, bangumiInfo2)
    addDiff(authorList1, authorList2)
}

function mergeInfoBox(authorList: AuthorList, bangumiInfo: Bangumi) {
    const _authorList = bangumiInfo.infobox.reduce((pre, { key, value }) => {
        if (typeof value !== 'string') {
            return pre
        }
        const _authorList: Author[] = value.split('、').map(item => ({
            name: item.replace(/\[.*?\]|\(.*?\)|（.*?）/, ''),
            relation: key,
            type: 0,
            id: NaN,
            images: {},
        }))
        return pre.concat(_authorList)
    }, [] as Author[])
    const nameSet = new Set(authorList.map(item => item.name))
    _authorList.forEach(item => {
        !nameSet.has(item.name) && authorList.push(item)
    })
}

export { getDiffText, addDiff, addDiffAll }