export const getAuthorResult = 'getAuthorResult'

export const authorResultProcess = 'authorResultProcess'

export const getCollectionListCache = 'getCollectionListCache'
export const setCollectionListCache = 'setCollectionListCache'
interface GetAuthorListCbInfo {
    total: number,
    finish_new: number,
    finish_old: number
}

export type { GetAuthorListCbInfo }