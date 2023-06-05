import { setBangumiAuthor, getBangumiAuthor, type BangumiAuthor } from '../sqlite/bangumi'
import { executePromisesWithLimit, type Promises } from 'src/lib/utils'
import api from 'src/service/index'
import type { Images } from 'src/component/collection/type'

interface Author {
    name: string,
    relation: string,
    type: number,
    id: number,
    images: Images,
}

async function getAuthorList(data: Array<number>) {
    const res = await getBangumiAuthor(data)
    const bangumiSet = new Set(res.map(item => item.bangumi_id))
    let list: Array<BangumiAuthor> = []
    let promiseList: Array<Promises<Array<BangumiAuthor>>> = []
    for(const bangumiId of data) {
        if (bangumiSet.has(bangumiId)) {
            list = list.concat(res.filter(item => item.bangumi_id === bangumiId))
        } else {
            promiseList.push({
                key: bangumiId,
                promise: api.getProducerList({}, {
                    subject_id: bangumiId
                }).then((res: Array<Author>) => {
                    const bangumiAuthorList: Array<BangumiAuthor> = res.map(item => ({
                        bangumi_id: bangumiId,
                        author_id: item.id,
                        author_name: item.name,
                        relation: item.relation,
                        author_images: JSON.stringify(item.images),
                    }))
                    return bangumiAuthorList
                })
            })
        }
    }
    let i = 0
    const resBangumiAuthorList = await executePromisesWithLimit(promiseList, 3, res => {
        i ++
        console.log(i)
        // todo
    })
    console.log(resBangumiAuthorList.successResults.length, resBangumiAuthorList.failResults.length)
    resBangumiAuthorList.successResults.forEach(item => {
        list = list.concat(item.result)
    })
    setBangumiAuthor(list)
    return list
}



export default getAuthorList