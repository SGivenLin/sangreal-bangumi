import { setBangumiAuthor, getBangumiAuthor, type BangumiAuthor } from '../sqlite/bangumi'
import { executePromisesWithLimit, type Promises } from 'src/lib/utils'
import api from 'src/service/index'
import type { Images, CollectionRes, Collection } from 'src/component/collection/type'
import type { AuthorData } from 'src/component/Author/type'
import type { GetAuthorListCbInfo } from './const'

interface Author {
    name: string,
    relation: string,
    type: number,
    id: number,
    images: Images,
}

async function getAuthorList(data: Array<number>, cb?: (info: GetAuthorListCbInfo) => void) {
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
                    if (!res.length) {
                        return [{
                            bangumi_id: bangumiId,
                            author_id: 0,
                            author_name: '',
                            relation: '',
                            author_images: '',
                        }]
                    }
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
    const resBangumiAuthorList = await executePromisesWithLimit(promiseList, 6, () => {
        i ++
        cb && cb({
            total: data.length,
            finish_new: i,
            finish_old: bangumiSet.size
        })
    })
    let listNoStore: Array<BangumiAuthor> = []
    resBangumiAuthorList.successResults.forEach(item => {
        listNoStore = listNoStore.concat(item.result)
    })
    setBangumiAuthor(listNoStore)
    return {
        list: list.concat(listNoStore),
        failList: resBangumiAuthorList.failResults
    }
}

function formatAuthorList(authorList: Array<BangumiAuthor>, collectionList: CollectionRes['data']) {
    // let authorData: AuthorData = {}
    const authorMap: Map<BangumiAuthor['author_id'], Array<Partial<AuthorData>>> = new Map()
    const collectionMap: Map<Collection['subject_id'], Collection> = new Map()
    collectionList.forEach(item => collectionMap.set(item.subject_id, item))
    authorList.forEach(item => {
        let data: Array<Partial<AuthorData>> = [{
            ...item,
            ...collectionMap.get(item.bangumi_id)
        }]
        if (authorMap.has(item.author_id)) {
            const _data = authorMap.get(item.author_id)
            if (_data) {
                data = data.concat(_data)
            }
        }

        authorMap.set(item.author_id, data)
    })
    // 过滤不超过一个
    let authorResList: Array<Array<Partial<AuthorData>>> = []
    authorMap.forEach(item => {
        if (item.length > 1) {
            authorResList.push(item)
        }
    })
    authorResList.sort((a, b) => {
        return b.length - a.length
    })
    return authorResList
}



export default getAuthorList
export {
    formatAuthorList,
}