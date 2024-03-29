import { useAppDispatch, useAppSelector } from 'src/store'
import { useCallback, useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { getAuthorResult, authorResultProcess, type AuthorListCbInfo, type FailList } from '../../electron/ipcMain/const'
import type { AuthorData } from 'src/component/Author/type'
import Author from 'src/component/Author'
import AuthorForm, { initialValues } from 'src/component/Author/select-form'
import ResultInfo from 'src/component/Author/result-info'
import InfiniteScroll from 'react-infinite-scroll-component'
import { setAuthorList, getRelationList, sortByForm } from 'src/store/author'
import { setFailList } from 'src/store/collection'
import { setLoading } from 'src/store/loading'
import './AuthorView.styl'

declare global {
    interface Window {
        electron: any
    }
}

interface AuthorRes {
    authorData: AuthorData[][] | undefined,
    failList: FailList,
}

const pageSize = 20
function AuthorView() {
    const collectionList = useAppSelector(state => state.collection.collectionList)
    const allAuthorList = useAppSelector(state => state.author.authorList)
    const [ curAuthorList, setCurAuthorList ] = useState(allAuthorList.slice(0, pageSize))
    const dispatch = useAppDispatch()
    useEffect(() => {
        setCurAuthorList(allAuthorList.slice(0, pageSize))
    }, [allAuthorList])

    const handle = useCallback((event: Electron.IpcRendererEvent, info: AuthorListCbInfo) => {
        dispatch(setLoading({
            loading: true,
            text: `正在获取信息 ${info.finish_old + info.finish_new}/${info.total}`,
        }))
    }, [ dispatch ])
    useEffect(() => {
        dispatch(setLoading({
            loading: true,
            text: '正在查询',
        }))
        ipcRenderer.invoke(getAuthorResult, collectionList).then((res: AuthorRes) => {
            if (res && res.authorData) {
                dispatch(setLoading({
                    loading: true,
                    text: '正在努力分析',
                }))
                dispatch(setAuthorList(res.authorData))
                dispatch(sortByForm(initialValues))
                dispatch(setFailList(res.failList))
                dispatch(getRelationList())
                setTimeout(() => {
                    dispatch(setLoading({
                        loading: false,
                    }))
                })
            }
        })

        ipcRenderer.on(authorResultProcess, handle)
        return () => {
            ipcRenderer.removeListener(authorResultProcess, handle)
        }
    }, [ collectionList, dispatch, handle ])
    
    return (<>
        <AuthorForm></AuthorForm>
        <Author.List>
            <ResultInfo></ResultInfo>
            {
                curAuthorList.length === 0
                    ? <div className='list-bottom'>—— 此处什么都没有 ——</div>
                    : <InfiniteScroll
                        dataLength={curAuthorList.length}
                        next={() => setCurAuthorList(allAuthorList.slice(0, curAuthorList.length + pageSize))}
                        hasMore={curAuthorList.length < allAuthorList.length}
                        loader={null}
                        endMessage={<div className='list-bottom'>—— 已经到底了 ——</div>}
                    >
                        { curAuthorList.map((item, index) => <Author.Item index={index} authorData={item} key={item[0].author_id}></Author.Item>) }
                    </InfiniteScroll>
            }
        </Author.List>
    </>)
}

export default AuthorView