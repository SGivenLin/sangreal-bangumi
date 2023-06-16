import { useAppDispatch, useAppSelector } from 'src/store'
// import { re } from 'electron'
import { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { getAuthorResult, authorResultProcess, type GetAuthorListCbInfo } from '../../electron/ipcMain/const'
import type { AuthorData } from 'src/component/Author/type'
import Author from 'src/component/Author'
import AuthorForm from 'src/component/Author/select-form'
import { setAuthorList } from 'src/store/author'
import { setLoading } from 'src/store/loading'

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
        dispatch(setLoading({
            loading: true,
            text: ''
        }))
        ipcRenderer.invoke(getAuthorResult, collectionList).then((res: AuthorData[][] | undefined) => {
            if (res) {
                dispatch(setLoading({
                    loading: true,
                    text: '正在努力分析',
                }))
                dispatch(setAuthorList(res))
                setTimeout(() => {
                    dispatch(setLoading({
                        loading: false,
                    }))
                })
            }
        })
        const handle = (event: Electron.IpcRendererEvent, info: GetAuthorListCbInfo) => {
            dispatch(setLoading({
                loading: true,
                text: `正在获取信息 ${info.finish_old + info.finish_new}/${info.total}`
            }))
        }
        ipcRenderer.on(authorResultProcess, handle)
        return () => {
            ipcRenderer.removeListener(authorResultProcess, handle)
        }
    }, [ collectionList, dispatch ])
    
    return (<div>
        <AuthorForm></AuthorForm>
        <Author.List>
            { authorList.map(item => <Author.Item authorData={item} key={item[0].author_id}></Author.Item>) }
        </Author.List>
    </div>)
}

export default AuthorView