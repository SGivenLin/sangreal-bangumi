import axios, { type AxiosInstance, Method } from 'axios'
import { setInterceptor } from './interceptor'

interface Iapi {
    [key: string]: string | [string, Method]
}

const bangumiAxios = axios.create({
    baseURL: 'https://api.bgm.tv'
})
const api: Iapi = {
    // getCollectionList: '/v0/users/:username/collections'
    getCollectionList: '/v0/users/linwenkanh/collections'
}

class Service {
    api: Iapi
    axios: AxiosInstance
    [props: string]: any
    constructor(bangumiAxios: AxiosInstance, api: Iapi) {
        this.api = api
        this.axios = bangumiAxios
        this._genRequestMethod()
    }

    private _genRequestMethod(): void {
        for(const key in this.api) {
            const val = this.api[key]
            let url = ''
            let method = ''
            if (Array.isArray(val)) {
                [ url, method ] = val
            } else {
                url = val
                method = 'get'
            }

            // @ts-ignore
            this[key] = (params, option) => this[method](url, params, option)
        }
    }

    get(url: string, params: object, option: object) {
        return this.axios.get(url, { params, ...option })
    }

    post(url: string, option: object) {
        return this.axios.post(url, option)
    }
}

const service = new Service(bangumiAxios, api)
setInterceptor(service.axios)

export default service