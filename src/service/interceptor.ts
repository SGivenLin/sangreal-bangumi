import type { AxiosStatic, AxiosInstance } from 'axios'

export function setInterceptor(axios: AxiosStatic | AxiosInstance) {
    axios.interceptors.response.use((res) => {
        if (res.status === 200 || res.status === 304) {
            return res.data
        } else {
            return Promise.reject(res)
        }
    })
}