import type { AxiosStatic, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

export function setInterceptor(axios: AxiosStatic | AxiosInstance) {
    axios.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
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
    })

    axios.interceptors.response.use((res) => {
        if (res.status === 200 || res.status === 304) {
            return res.data
        } else {
            return Promise.reject(res)
        }
    })
}