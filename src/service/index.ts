import axios, { type AxiosInstance, Method } from 'axios'
import { setInterceptor } from './interceptor'
import type { CollectionRes } from 'src/component/Collection/type'
import { type Author } from 'src/component/Author/type'
import type { Bangumi, BangumiSearchResult } from 'src/component/Bangumi/type'

interface IApi {
    [key: string]: string | [string, Method]
}

const bangumiAxios = axios.create({
    timeout: 10000,
    baseURL: 'https://api.bgm.tv',
})
const api: IApi = {
    getCollectionList: '/v0/users/{username}/collections',
    getProducerList: '/v0/subjects/{subject_id}/persons',
    getBangumiInfo: '/v0/subjects/{subject_id}',
    getSubjectListBySearch: '/search/subject/{keywords}',
}

type apiFunction<T> = (params: object, option: object) => Promise<T>
class Service {
    api: IApi
    axios: AxiosInstance
    getCollectionList: apiFunction<CollectionRes>
    getProducerList: apiFunction<Author[]>
    getBangumiInfo: apiFunction<Bangumi>
    getSubjectListBySearch: apiFunction<BangumiSearchResult>
    constructor(bangumiAxios: AxiosInstance, api: IApi) {
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