import { setBangumiAuthor, getBangumiAuthor, setBangumi, getIllegalBangumi, type BangumiAuthor } from '../sqlite/bangumi'
import { executePromisesWithLimit, type Promises } from 'src/lib/utils'
import api from 'src/service/index'
import type { Images, CollectionRes, Collection } from 'src/component/Collection/type'
import type { AuthorData } from 'src/component/Author/type'
import type { GetAuthorListCbInfo } from './const'
import { ipcMain, type BrowserWindow } from 'electron'
import { getAuthorResult, authorResultProcess } from './const'
import { once } from './utils'
import { throttle } from 'lodash-es'

async function getAuthorList(data: Array<number>, cb?: (info: GetAuthorListCbInfo) => void) {
    const [ res, illegalRes ] = await Promise.all([ getBangumiAuthor(data), getIllegalBangumi() ])
    const illegalBangumiSet = new Set(illegalRes.map(item => item.bangumi_id))
    const bangumiSet = new Set(res.map(item => item.bangumi_id))
    let list: Array<BangumiAuthor> = []
    let promiseList: Promises<Array<BangumiAuthor>>[] = []
    for(const bangumiId of data.filter(item => !illegalBangumiSet.has(item))) {
        if (bangumiSet.has(bangumiId)) {
            list = list.concat(res.filter(item => item.bangumi_id === bangumiId))
        } else {
            promiseList.push({
                key: bangumiId,
                promise: api.getProducerList({}, {
                    subject_id: bangumiId
                }).then(res => {
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

    // 存入里番数据，下次不再请求
    const illegalList = resBangumiAuthorList.failResults.filter(({ error }) => {
        // 里番 不会返回，记录到数据库下次不再查询
        return error.response.status === 404 && error.response.data.title === 'Not Found'
    }).map(({ key }) => ({
        bangumi_id: key as number,
        name: '',
        bangumi_legal_type: 1,
    }))
    setBangumi(illegalList)
    return {
        list: list.concat(listNoStore),
        failList: resBangumiAuthorList.failResults.concat(illegalRes.map(item => ({ key: item.bangumi_id, error: 'illegal' })))
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

function setGetAuthorResultIpc(win: BrowserWindow | null) {
    ipcMain.handle(getAuthorResult, once(async (e: any, data: CollectionRes['data']) => {
        const webContents = win?.webContents
        const { list, failList } = await getAuthorList(data.map(item => item.subject_id), throttle(info => {
            webContents?.send(authorResultProcess, info)
        }, 100))
        const res = formatAuthorList(list, data)
        return { authorData: res, failList: failList.map(item => ({ error: String(item.error), key: item.key })) }
    }))
}

export default setGetAuthorResultIpc
export interface Author {
    name: string,
    relation: string,
    type: number,
    id: number,
    images: Images,
}