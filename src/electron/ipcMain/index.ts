import { type BrowserWindow } from 'electron'
import setGetAuthorResultIpc from './getAuthorList'

function setIpcMain(win: BrowserWindow | null): void {
    setGetAuthorResultIpc(win)
}

export default setIpcMain