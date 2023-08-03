import { useCallback, useState, useEffect } from 'react'
import { useAppDispatch } from 'src/store'
import { setLoading } from 'src/store/loading'
import { throttle } from 'lodash-es'

type LoadingCb<T extends any[]> = (...args: T) => void

function useLoading<T extends any[]>(fn: (...args: T) => any): [boolean, LoadingCb<T>] {
  const [loading, setLoading] = useState(false)

  const loadingCb = useCallback<LoadingCb<T>>((...args: T) => {
    setLoading(true)
    setTimeout(() => {
        fn(...args)
        setLoading(false)
    }, 100)
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

function useScrollToBottom(callback: () => void, option: { throttleTime: number, offset: number } = { throttleTime: 100, offset: 100 }) {
    useEffect(() => {
        const handleScroll = throttle(() => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
            const clientHeight = document.documentElement.clientHeight || window.innerHeight
            if (scrollTop + clientHeight + option.offset >= scrollHeight) {
                callback()
            }
        }, option.throttleTime)
        window.document.addEventListener('scroll', handleScroll)
        return () => {
            window.document.removeEventListener('scroll', handleScroll)
        }
    }, [callback, option.offset, option.throttleTime])
}

export {
    useLoading,
    useFullLoading,
    useScrollToBottom,
}