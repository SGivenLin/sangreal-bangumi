import { shell, type BrowserWindow as IBrowserWindow } from 'electron'
const exclude: Array<string> = []

export function rewriteWindow(win: IBrowserWindow | null) {
    win && win.webContents.setWindowOpenHandler(details => {
        if (exclude.some(item => details.url.includes(item))) {
            return {
                action: 'allow'
            }
        }
        shell.openExternal(details.url)
        return {
            action: 'deny'
        }
    })
}