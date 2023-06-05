import type { AxiosStatic, AxiosInstance, InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios'

export function setInterceptor(axios: AxiosStatic | AxiosInstance) {
    axios.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
        replaceUrl(config)
        resetUserAgent(config)
        return config
    })

    axios.interceptors.response.use((res) => {
        if (res.status === 200 || res.status === 304) {
            return res.data
        } else {
            return Promise.reject(res)
        }
    })
}

function replaceUrl(config: InternalAxiosRequestConfig<any>) {
    if (config.url?.includes(':')) {
        config.url = config.url.replace(/\/:(.*?)\//g, (match, $1) => {
            const replaceUrl = config[$1 as keyof InternalAxiosRequestConfig<any>]
            if (replaceUrl) {
                return `/${replaceUrl}/`
            } else {
                return match
            }
        })
    }
    return config
}

function resetUserAgent(config: InternalAxiosRequestConfig<any>) {
    // if (!window) {
    if (typeof window !== 'object') {
        config.headers = {
            ...config.headers,
            'User-Agent': 'lin.hayashi@foxmail.com/sangreal-bangumi 0.0.1'
        } as AxiosRequestHeaders
    }
    return config
}