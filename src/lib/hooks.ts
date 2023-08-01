import { useCallback, useState } from 'react'
import { useAppDispatch } from 'src/store'
import { setLoading } from 'src/store/loading'

type LoadingCb<T extends any[]> = (...args: T) => void

function useLoading<T extends any[]>(fn: (...args: T) => any): [boolean, LoadingCb<T>] {
  const [loading, setLoading] = useState(false)

  const loadingCb = useCallback<LoadingCb<T>>((...args: T) => {
    setLoading(true)
    setTimeout(() => {
      fn(...args)
      setLoading(false)
    }, 200)
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

export {
    useLoading,
    useFullLoading,
}