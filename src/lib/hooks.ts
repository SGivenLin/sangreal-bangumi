import { useCallback, useState, useEffect, useRef, type RefObject } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setLoading } from 'src/store/loading'
import { throttle } from 'lodash-es'
import { ipcRenderer } from 'electron'
import { getAppInfo } from 'src/electron/ipcMain/const'
import { useDispatch } from 'react-redux'
import { setAppInfo } from 'src/store/appInfo'


type LoadingCb<T extends any[]> = (...args: T) => void

function useLoading<T extends any[]>(fn: (...args: T) => any): [boolean, LoadingCb<T>] {
    const [loading, setLoading] = useState(false)

    const loadingCb = useCallback<LoadingCb<T>>((...args: T) => {
        setLoading(true)
        const minTime = 100
        const startTime = performance.now() // 获取当前时间戳
        // 如果setTimeout时间过短，setLoading可能被延迟
        setTimeout(() => {
            Promise.resolve(fn(...args)).finally(() => {
                const endTime = performance.now() // 获取执行后的时间戳
                const executionTime = endTime - startTime // 计算执行时间
                if (executionTime < minTime) {
                    setTimeout(() => {
                        setLoading(false)
                    }, minTime - executionTime)
                } else {
                    setTimeout(() => {
                        setLoading(false)
                    })
                }
            }) // 执行函数fn
        }, 50)
    }, [fn])

    return [loading, loadingCb]
}

type LoadingFn<T extends any[], R> = (...args: T) => Promise<R>
function useFullLoading<T extends any[], R>(fn: (...args: T) => R, loadingMessage: string): LoadingFn<T, R> {
    const dispatch = useAppDispatch()

    const setLoadingState = useCallback((message: string) => {
        dispatch(setLoading({ loading: true, text: message }))
    }, [dispatch])

    const loadingFn = useCallback<LoadingFn<T, R>>(async (...args: T) => {
        setLoadingState(loadingMessage)
        const res = await fn(...args)
        dispatch(setLoading({ loading: false }))
        return res
    }, [fn, setLoadingState, loadingMessage, dispatch])

    return loadingFn
}

// function useScrollToBottom(callback: () => void, option: { throttleTime: number, offset: number } = { throttleTime: 100, offset: 100 }) {
//     useEffect(() => {
//         const handleScroll = throttle(() => {
//             const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
//             const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
//             const clientHeight = document.documentElement.clientHeight || window.innerHeight
//             if (scrollTop + clientHeight + option.offset >= scrollHeight) {
//                 callback()
//             }
//         }, option.throttleTime)
//         window.document.addEventListener('scroll', handleScroll)
//         return () => {
//             window.document.removeEventListener('scroll', handleScroll)
//         }
//     }, [callback, option.offset, option.throttleTime])
// }

function useScrollToTop(offset: number = 0): [ boolean, RefObject<HTMLDivElement> ] {
    const containerRef = useRef<HTMLDivElement>(null)
    const [ reachTop, setReachTop ] = useState(false)
  
    useEffect(() => {
        const handleScroll = throttle(() => {
            if (containerRef.current) {
                const top = containerRef.current.getBoundingClientRect().top
                setReachTop(top - offset <= 0)
            }
        }, 100)
  
        window.document.addEventListener('scroll', handleScroll)
  
        return () => {
            window.document.removeEventListener('scroll', handleScroll)
        }
    }, [offset])
  
    return [ reachTop, containerRef ]
}

function useRouterDisabled() {
    const collectionList = useAppSelector(state => state.collection.collectionList)
    return !collectionList.length
}

function useAppInfo() {
    const dispatch = useDispatch()
    useEffect(() => {
        ipcRenderer.invoke(getAppInfo).then((res) => {
            dispatch(setAppInfo(res))
        })
    })
}

export {
    useLoading,
    useFullLoading,
    useScrollToTop,
    useRouterDisabled,
    useAppInfo,
}