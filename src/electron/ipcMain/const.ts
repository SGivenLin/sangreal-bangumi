export const getAuthorResult = 'getAuthorResult'

export const authorResultProcess = 'authorResultProcess'

export const getCollectionListCache = 'getCollectionListCache'
export const setCollectionListCache = 'setCollectionListCache'
interface AuthorListCbInfo {
    total: number,
    finish_new: number,
    finish_old: number
}

type FailList = Array<{
    key: number | string,
    errno: string | number,
    errmsg: string
}>

export type { AuthorListCbInfo, FailList }