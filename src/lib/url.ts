import { useSearchParams } from 'react-router-dom'

function build(url: string, params: Record<string, string | number | undefined>): string {
    const searchParams = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`)
        .join('&')
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}${searchParams}`
}

function useQuery<T>() {
    const [searchParams] = useSearchParams()
    const params = Object.fromEntries(searchParams.entries())
    return params as T
}

export {
    build,
    useQuery,
}
  