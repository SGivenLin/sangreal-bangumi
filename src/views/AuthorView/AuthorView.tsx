import { useAppSelector } from 'src/store'
// import { re } from 'electron'
import { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { getAuthorResult } from '../../electron/ipcMain/const'
import type { AuthorData } from 'src/component/Author/type'
import Author from 'src/component/Author'

declare global {
    interface Window {
        electron: any
    }
}

function AuthorView() {
    const collectionList = useAppSelector(state => state.collection.collectionList)
    const [authorList, setAuthorList] = useState<AuthorData[][]>([])
    useEffect(() => {
        ipcRenderer.invoke(getAuthorResult, collectionList).then((res: AuthorData[][]) => {
            setAuthorList(res.slice(0, 100))
        })
    }, [ collectionList ])
    
    return (<div>
        <Author.List>
            { authorList.map(item => <Author.Item authorData={item}></Author.Item>) }
        </Author.List>
    </div>)
}

export default AuthorView