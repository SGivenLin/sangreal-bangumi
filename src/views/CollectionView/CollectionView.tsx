// import React, { useEffect, useRef, useState } from 'react';
import { getAllCollection } from 'src/service/action';
import { Input, Space, message, Popover } from 'antd';
import Collection from 'src/component/Collection'
import { useAppSelector, useAppDispatch } from 'src/store'
import { setCollectionList } from 'src/store/collection'
import { setLoading } from 'src/store/loading';
import { useFullLoading } from 'src/lib/hooks';
import SearchHistory from 'src/lib/SearchHistory';
import './CollectionView.styl'
import { useState } from 'react';
import { ipcRenderer } from 'electron';
import { getCollectionListCache, setCollectionListCache } from 'src/electron/ipcMain/const';
import type { GetCollectionListCache } from 'src/electron/ipcMain/getCollection'

const { Search } = Input

function CollectionView() {
  const collectionList = useAppSelector(state => state.collection.collectionList)
  const dispatch = useAppDispatch()

  const [ inputValue, setInputValue ] = useState('')
  const searchHistory = new SearchHistory("user_collection_search_history");
  const history = searchHistory.getHistory();

  const onSearch =  useFullLoading(async (val: string) => {
    const username = val.trim()
    searchHistory.addEntry(username)
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
    } catch(e: any) {
      console.error(e)
      message.error(e?.response?.status === 404 ? 'bangumi账号id错误' : e?.message || '未知错误')
    }
  }, '正在获取收藏内容')

  const fillSearch = (suggestion: string) => {
    setInputValue(suggestion)
    setPopoverOpen(false)
    setTimeout(() => {
      setPopoverOpen(undefined)
    })
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }

  const [ popoverOpen, setPopoverOpen ] = useState<boolean | undefined>(history.length === 0 ? false : undefined)

  return (
    <Space className="collection-view" direction='vertical' size="middle">
      <Popover
        placement="bottomLeft"
        open={popoverOpen}
        overlayInnerStyle={{padding: '12px 0'}}
        trigger={['contextMenu']}
        content={
          <div>
            { history.map(item => (<div key={item} className='search-suggestion' onClick={() => fillSearch(item)}>{item}</div>)) }
          </div>
        }
        >
          <div className='search-input'>
            {/* { 避免 严格模式报错 } */}
            <Search
              placeholder="Bangumi账号id"
              allowClear
              enterButton="查询"
              value={inputValue}
              size="large"
              onChange={onChange}
              onSearch={onSearch}
              onFocus={() => setPopoverOpen(true)}
              onBlur={() => setPopoverOpen(false)}
            />
          </div>
  
      </Popover>
      <Collection collectionList={collectionList}></Collection>
    </Space>
  );
}
export default CollectionView;
