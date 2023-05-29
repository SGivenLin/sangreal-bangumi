import { useAppSelector } from 'src/store'
// import { re } from 'electron'
import { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { getAuthorResult } from '../../../electron/ipcMain/const'

declare global {
    interface Window {
        electron: any
    }
}

function AuthorView() {
    const collectionList = useAppSelector(state => state.collection.collectionList)
    // const { ipcRenderer } = window.require('electron')
    useEffect(() => {
        ipcRenderer.invoke(getAuthorResult, collectionList).then(res => {
            console.log(res)
        })
    }, [])
    
    return (<div>
       {collectionList.map(item => <div key={item.subject_id }>{ item.subject_id }</div>) }
    </div>)
}

export default AuthorView