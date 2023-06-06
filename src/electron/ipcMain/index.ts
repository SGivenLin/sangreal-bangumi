import { ipcMain } from 'electron'
import { getAuthorResult } from './const'
import getAuthorList, { formatAuthorList } from './getAuthorList'
import type { CollectionRes } from '../../component/collection/type'

function setIpcMain(): void {
    ipcMain.handle(getAuthorResult, once(async (e, data: CollectionRes['data']) => {
        const { list } = await getAuthorList(data.map(item => item.subject_id))
        const res = formatAuthorList(list, data)
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
        const res = await fn.apply(this, args).finally(() => {
            running = false
        })
        return res
    }
}

export default setIpcMain