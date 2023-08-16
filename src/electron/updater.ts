import { autoUpdater, type UpdateCheckResult, CancellationToken } from "electron-updater"
import { ipcMain, type BrowserWindow, app, shell } from 'electron'
import log from 'electron-log'
import {
    updateAvailable,
    updateNotAvailable,
    updateError,
    updateDownloaded,
    updateDownload,
    downloadProgress,
    updateDownloadCancel,
    updateCancelled,
    openDownloadDir,
    updateCheck,
} from './ipcMain/const'
import { isMac } from "./env"
import fs from 'fs'

// 更新文件下载地址
const downloadDir = isMac ? `${app.getPath('home')}/Library/Caches/${app.getName()}-updater` : `${app.getPath('appData')}-updater`

// 检查之后不自动下载
autoUpdater.autoDownload = false

export default class AppUpdater {
    win: BrowserWindow
    updater: UpdateCheckResult
    cancellationToken: CancellationToken
    isDownloading: boolean = false

    constructor(win: BrowserWindow) {
        log.transports.file.level = "debug"
        autoUpdater.logger = log
        this.win = win
        this.setUpdaterEvent()
    }

    checkForUpdatesAndNotify() {
        return autoUpdater.checkForUpdates().then(res => {
            if (res) {
                this.updater = res
            }
            return res
        })
    }

    initRenderer() {
        ipcMain.handle(updateCheck, () => {
            const res = this.checkForUpdatesAndNotify()
            return res
        })
    }

    setUpdaterEvent() {
        autoUpdater.on(updateAvailable, (info) => {
            log.info(updateAvailable, info)
            this.win.webContents.send(updateAvailable, info)
        })
          
        autoUpdater.on(updateNotAvailable, (info) => {
            log.info(updateNotAvailable, info)
            this.win.webContents.send(updateNotAvailable, info)
        })
          
        autoUpdater.on('error', (err) => {
            log.error(updateError, err)
            this.win.webContents.send(updateError, err.toString(), fs.existsSync(downloadDir))
        })
          
        autoUpdater.on(updateDownloaded, (info) => {
            log.info(updateDownloaded, info)
            this.win.webContents.send(updateDownloaded)
            setTimeout(() => {
                autoUpdater.quitAndInstall(false, true)
            })
        })

        autoUpdater.on(downloadProgress, (progressObj) => {
            this.win.webContents.send(downloadProgress, progressObj)
        })

        autoUpdater.on(updateCancelled, () => {
            this.win.webContents.send(updateCancelled)
        })

        ipcMain.on(updateDownload, () => {
            log.debug('isDownloading', this.isDownloading)
            if (this.isDownloading) {
                return
            }
            this.cancellationToken = new CancellationToken()
            autoUpdater.downloadUpdate(this.cancellationToken).catch(e => {
                log.error(e)
            }).finally(() => {
                this.isDownloading = false
            })
        })

        ipcMain.on(updateDownloadCancel, () => {
            this.cancellationToken.cancel()
        })

        ipcMain.on(openDownloadDir, () => {
            shell.openPath(downloadDir).catch(log.error)
        })
    }
}