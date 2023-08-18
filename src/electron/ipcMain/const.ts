import { ipcMain } from 'electron'

export const getAppInfo = 'getAppInfo'

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

// updater
export const updateAvailable = 'update-available'
export const updateNotAvailable = 'update-not-available'
export const updateError = 'update-error'
export const updateDownloaded = 'update-downloaded'
export const downloadProgress = 'download-progress'
export const updateDownload = 'updateDownload'
export const updateDownloadCancel = 'downloadCancel'
export const updateCancelled = 'update-cancelled'
export const openDownloadDir = 'openDownloadDir'
export const updateCheck = 'updateCheck'

export type { AuthorListCbInfo, FailList, Listener }