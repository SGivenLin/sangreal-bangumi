import { useAppDispatch, useAppSelector } from 'src/store'
// import { re } from 'electron'
import { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { getAuthorResult } from '../../electron/ipcMain/const'
import type { AuthorData } from 'src/component/Author/type'
import Author from 'src/component/Author'
import AuthorForm from 'src/component/Author/select-form'
import { setAuthorList, sortByForm } from 'src/store/author'
import { initialValues } from 'src/component/Author/select-form'

declare global {
    interface Window {
        electron: any
    }
}

function AuthorView() {
    const collectionList = useAppSelector(state => state.collection.collectionList)
    const authorList = useAppSelector(state => state.author.authorList).slice(0, 100)
    const dispatch = useAppDispatch()
    useEffect(() => {
        ipcRenderer.invoke(getAuthorResult, collectionList).then((res: AuthorData[][] | undefined) => {
            if (res) {
                dispatch(setAuthorList(res))
                dispatch(sortByForm(initialValues))
            }
        })
    }, [ collectionList, dispatch ])
    
    return (<div>
        <AuthorForm></AuthorForm>
        <Author.List>
            { authorList.map(item => <Author.Item authorData={item} key={item[0].author_id}></Author.Item>) }
        </Author.List>
    </div>)
}

export default AuthorView