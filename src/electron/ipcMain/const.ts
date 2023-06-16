export const getAuthorResult = 'getAuthorResult'

export const authorResultProcess = 'authorResultProcess'

interface GetAuthorListCbInfo {
    total: number,
    finish_new: number,
    finish_old: number
}

export type { GetAuthorListCbInfo }