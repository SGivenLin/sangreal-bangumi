import { setBangumiAuthor, getBangumiAuthor, type BangumiAuthor } from '../sqlite/bangumi'
import api from 'src/service/index'

interface Author {
    name: string,
    relation: string,
    type: number,
    id: number,
}

async function getAuthorList(data: Array<number>) {
    data = [ data[0] ] // todo
    const res = await getBangumiAuthor(data)
    const bangumiSet = new Set(res.map(item => item.bangumi_id))
    let list: Array<BangumiAuthor> = []
    for(const bangumiId of data) {
        let bangumiAuthorList = []
        if (bangumiSet.has(bangumiId)) {
            bangumiAuthorList = res.filter(item => item.bangumi_id === bangumiId)
        } else {
            const res: Array<Author> = await api.getProducerList({}, {
                subject_id: bangumiId
            })
            bangumiAuthorList = res.map(item => ({
                bangumi_id: bangumiId,
                author_id: item.id,
                author_name: item.name,
                relation: item.relation
            }))
        }

        list = list.concat(bangumiAuthorList)
    }
    setBangumiAuthor(list)
    return list
}



export default getAuthorList