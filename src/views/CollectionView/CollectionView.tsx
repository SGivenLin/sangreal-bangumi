// import React, { useEffect, useRef, useState } from 'react';
import { getAllCollection } from 'src/service/action'
import { Space, message, Button, Tooltip } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import Collection from 'src/component/Collection'
import { useAppSelector, useAppDispatch } from 'src/store'
import { setCollectionList } from 'src/store/collection'
import { setSearchUserInfo } from 'src/store/userInfo'
import { setLoading } from 'src/store/loading'
import { useFullLoading } from 'src/lib/hooks'
import SearchHistory from 'src/lib/SearchHistory'
import './CollectionView.styl'
import { SubjectType } from 'src/component/Bangumi/type'
import { useState } from 'react'
import { setCollectionListCache, diffCollectionCache, type CollectionListCacheResult } from './getCollection'
import SearchButton from './searchButton'

function CollectionView() {
    const collectionList = useAppSelector(state => state.collection.collectionList)
    const dispatch = useAppDispatch()

    const searchHistory = new SearchHistory("user_collection_search_history")
    const history = searchHistory.getHistory()

    const [ cacheUpdateDate, setCacheUpdateDate ] = useState('')
  
    const onSearch =  useFullLoading(async (val: string, useCache = true) => {
        const username = val.trim()
        if (!username) return

        const dispatchCollectionList = (list: CollectionListCacheResult['result']['collection']) => {
            dispatch(setCollectionList(list))
            dispatch(setSearchUserInfo({ username }))
            searchHistory.addEntry(username)
        }

        try {
            if (useCache) {
                dispatch(setLoading({ text: '正在查询缓存' }))
                const res = await diffCollectionCache(username)
                if (res.useCache) {
                    setCacheUpdateDate(new Date(res.result.updateDate).toLocaleString())
                    dispatchCollectionList(res.result.collection)
                    return
                }
            }

            const list = await getAllCollection({
                subject_type: SubjectType.anime,
                type:2,
                limit:50,
                offset:0,
            }, {
                username,
            }, list => {
                dispatch(setLoading({ text: `正在获取收藏内容 ${list.length}条` }))
            })
            dispatchCollectionList(list)
            setCollectionListCache(username, list)
            setCacheUpdateDate(new Date().toLocaleString())
        } catch(e: any) {
            console.error(e)
            message.error(e?.response?.status === 404 ? 'bangumi账号id错误' : e?.message || '未知错误')
        }
    }, '正在获取收藏内容')

    const [ curValue, setCurValue ] = useState('')
    return (
        <Space className="collection-view" direction='vertical' size="middle">
            <div className='search'>
                <SearchButton
                    options={history.map(item => ({ value: item }))}
                    onChange={setCurValue}
                    onSearch={value => onSearch(value)}
                />
                <Tooltip title={`不使用缓存查询最新收藏（上次更新时间 ${cacheUpdateDate}）`}>
                    <Button
                        type="text"
                        style={{ marginLeft: 12 }}
                        icon={<ReloadOutlined style={{ fontSize: '1.2em', color: '#fff' }} />}
                        onClick={() => onSearch(curValue, false)}
                    />
                </Tooltip>
            </div>

            <Collection collectionList={collectionList}></Collection>
        </Space>
    )
}
export default CollectionView
