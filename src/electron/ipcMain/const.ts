import { ipcMain } from 'electron'

export const getAuthorResult = 'getAuthorResult'

export const authorResultProcess = 'authorResultProcess'

export const getCollectionListCache = 'getCollectionListCache'
export const setCollectionListCache = 'setCollectionListCache'
export const getRelationList = 'getRelationList'

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

type Listener = Parameters<typeof ipcMain.handle>[1]

export type { AuthorListCbInfo, FailList, Listener }