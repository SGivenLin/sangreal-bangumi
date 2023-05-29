import { ipcMain } from 'electron'
import { getAuthorResult } from './const'

function setIpcMain(): void {
    ipcMain.handle(getAuthorResult, once(async (e, data) => {
        return 2
    }))
}

function once<T extends any[]>(fn: (...args: T) => Promise<any>) {
    let running = false
    return async function(...args: T) {
        if (running) {
            return
        }
        running = true
        // @ts-ignore
        const res = await fn.apply(this, args) 
        running = false
        return res
    }
}

export default setIpcMain