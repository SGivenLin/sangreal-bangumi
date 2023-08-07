import { type BrowserWindow, ipcMain  } from 'electron'
import setGetAuthorResultIpc from './getAuthorList'
import { getAuthorResult } from './const'
import { initRenderer  } from 'electron-store'

function setIpcMain(win: BrowserWindow | null): void {
    initRenderer()
    setGetAuthorResultIpc(win)
}

function removeIpcMain() {
    ipcMain.removeHandler(getAuthorResult)
}

export { setIpcMain, removeIpcMain }