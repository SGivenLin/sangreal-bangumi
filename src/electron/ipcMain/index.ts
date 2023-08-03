import { type BrowserWindow } from 'electron'
import setGetAuthorResultIpc from './getAuthorList'
import setGetCollectionIpc from './getCollection'

function setIpcMain(win: BrowserWindow | null): void {
    setGetAuthorResultIpc(win)
    setGetCollectionIpc()
}

export default setIpcMain