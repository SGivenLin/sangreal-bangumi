import { ipcMain } from 'electron'
import { getAuthorResult } from './const'
import getAuthorList from './getAuthorList'
import type { CollectionRes } from '../../component/collection/type'

function setIpcMain(): void {
    ipcMain.handle(getAuthorResult, once(async (e, data: CollectionRes['data']) => {
        const list = data.map(item => item.subject_id)
        const res = getAuthorList(list)
        return res
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