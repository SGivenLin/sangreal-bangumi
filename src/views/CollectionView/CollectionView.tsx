// import React, { useEffect, useRef, useState } from 'react';
import { getAllCollection } from 'src/service/action';
import { Input, Space, message, AutoComplete } from 'antd';
import Collection from 'src/component/Collection'
import { useAppSelector, useAppDispatch } from 'src/store'
import { setCollectionList } from 'src/store/collection'
import { setLoading } from 'src/store/loading';
import { useFullLoading } from 'src/lib/hooks';
import SearchHistory from 'src/lib/SearchHistory';
import './CollectionView.styl'
import { ipcRenderer } from 'electron';
import { getCollectionListCache, setCollectionListCache } from 'src/electron/ipcMain/const';
import type { GetCollectionListCache } from 'src/electron/ipcMain/getCollection'

const { Search } = Input

function CollectionView() {
  const collectionList = useAppSelector(state => state.collection.collectionList)
  const dispatch = useAppDispatch()

  const searchHistory = new SearchHistory("user_collection_search_history");
  const history = searchHistory.getHistory();

  const onSearch =  useFullLoading(async (val: string) => {
    const username = val.trim()
    if (!username) return
    try {
      dispatch(setLoading({ text: '正在查询缓存' }))
      const cacheCollection = await ipcRenderer.invoke(getCollectionListCache, { username }) as GetCollectionListCache
      if (cacheCollection.useCache) {
        dispatch(setCollectionList(cacheCollection.collection))
        return
      }

      const list = await getAllCollection({
        subject_type:2,
        type:2,
        limit:50,
        offset:0
      }, {
        username
      }, list => {
        dispatch(setLoading({ text: `正在获取收藏内容 ${list.length}条` }))
      })
      dispatch(setCollectionList(list))
      ipcRenderer.invoke(setCollectionListCache, { username, collection: list })
      searchHistory.addEntry(username)
    } catch(e: any) {
      console.error(e)
      message.error(e?.response?.status === 404 ? 'bangumi账号id错误' : e?.message || '未知错误')
    }
  }, '正在获取收藏内容')

  return (
    <Space className="collection-view" direction='vertical' size="middle">
      <AutoComplete
        className='search-input'
        popupClassName="search-input-pop"
        options={history.map(item => ({ value: item }))}
      >
        <Search
          placeholder="Bangumi账号id"
          allowClear
          enterButton="查询"
          size="large"
          onSearch={onSearch}
        />
      </AutoComplete>
      <Collection collectionList={collectionList}></Collection>
    </Space>
  );
}
export default CollectionView;
