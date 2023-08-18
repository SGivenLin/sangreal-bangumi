import { ipcMain, app } from 'electron'
import getAuthorResultHandle from './getAuthorList'
import { getAuthorResult, getRelationList, getAppInfo } from './const'
import { initRenderer } from 'electron-store'
import getRelationListHandle from './getRelationList'

function setIpcMain(): void {
    initRenderer()
    ipcMain.handle(getAuthorResult, getAuthorResultHandle)
    ipcMain.handle(getRelationList, getRelationListHandle)
    ipcMain.handle(getAppInfo, () => {
        return {
            version: app.getVersion(),
            appName: app.getName(),
        }
    })
}

function removeIpcMain() {
    // ipcMain.removeHandler(getAuthorResult)
    // ipcMain.removeHandler(getRelationList)
}

export { setIpcMain, removeIpcMain }