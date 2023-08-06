// import React, { useEffect, useRef, useState } from 'react';
import { getAllCollection } from 'src/service/action';
import { Input, Space, message, AutoComplete, Button, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons'
import Collection from 'src/component/Collection'
import { useAppSelector, useAppDispatch } from 'src/store'
import { setCollectionList } from 'src/store/collection'
import { setSearchUserInfo } from 'src/store/userInfo';
import { setLoading } from 'src/store/loading';
import { useFullLoading } from 'src/lib/hooks';
import SearchHistory from 'src/lib/SearchHistory';
import './CollectionView.styl'
import { ipcRenderer } from 'electron';
import { getCollectionListCache, setCollectionListCache } from 'src/electron/ipcMain/const';
import type { GetCollectionListCache } from 'src/electron/ipcMain/getCollection'
import { useState } from 'react';

function CollectionView() {
  const collectionList = useAppSelector(state => state.collection.collectionList)
  const dispatch = useAppDispatch()

  const searchHistory = new SearchHistory("user_collection_search_history");
  const history = searchHistory.getHistory();

  
  type SearchEvent = React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement> | undefined
  const onSearch =  useFullLoading(async (val: string, e?: SearchEvent, useCache = true) => {
    const username = val.trim()
    if (!username) return

    const dispatchCollectionList = (list: GetCollectionListCache['collection']) => {
      dispatch(setCollectionList(list))
      dispatch(setSearchUserInfo({ username }))
      searchHistory.addEntry(username)
    }

    try {
      if (useCache) {
        dispatch(setLoading({ text: '正在查询缓存' }))
        const cacheCollection = await ipcRenderer.invoke(getCollectionListCache, { username }) as GetCollectionListCache
        if (cacheCollection.useCache) {
          dispatchCollectionList(cacheCollection.collection)
          return
        }
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
      dispatchCollectionList(list)
      ipcRenderer.invoke(setCollectionListCache, { username, collection: list })
    } catch(e: any) {
      console.error(e)
      message.error(e?.response?.status === 404 ? 'bangumi账号id错误' : e?.message || '未知错误')
    }
  }, '正在获取收藏内容')

  const [ curValue, setCurValue ] = useState('')
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setCurValue(e.target.value)
  }
  return (
    <Space className="collection-view" direction='vertical' size="middle">
      <div className='search'>
        <AutoComplete
          className='search-input'
          options={history.map(item => ({ value: item }))}
          // autoFocus={true}
          // getPopupContainer={() => document.querySelector('#app') || document.body}
        >
          <Input.Search
            placeholder="Bangumi账号id"
            allowClear
            enterButton="查询"
            size="large"
            onSearch={onSearch}
            onChange={onChange}
          />
        </AutoComplete>
        <Tooltip title="不使用缓存查询最新收藏">
          <Button
            type="text"
            icon={<ReloadOutlined style={{ fontSize: '1.2em' }} />}
            onClick={() => onSearch(curValue, undefined, false)}
          />
        </Tooltip>
      </div>
      <Collection collectionList={collectionList}></Collection>
    </Space>
  );
}
export default CollectionView;
