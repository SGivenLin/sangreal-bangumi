import { ipcMain } from 'electron'
import getAuthorResultHandle from './getAuthorList'
import { getAuthorResult, getRelationList } from './const'
import { initRenderer  } from 'electron-store'
import getRelationListHandle from './getRelationList'

function setIpcMain(): void {
    initRenderer()
    ipcMain.handle(getAuthorResult, getAuthorResultHandle)
    ipcMain.handle(getRelationList, getRelationListHandle)
}

function removeIpcMain() {
    ipcMain.removeHandler(getAuthorResult)
    ipcMain.removeHandler(getRelationList)
}

export { setIpcMain, removeIpcMain }