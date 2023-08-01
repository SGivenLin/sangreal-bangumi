// import React, { useEffect, useRef, useState } from 'react';
import { getAllCollection } from 'src/service/action';
import { Input, Space } from 'antd';
import Collection from 'src/component/Collection'
import { useAppSelector, useAppDispatch } from 'src/store'
import { setCollectionList } from 'src/store/collection'
import { setLoading } from 'src/store/loading';
import { useFullLoading } from 'src/lib/hooks';
import './CollectionView.styl'

const { Search } = Input

function CollectionView() {
  const collectionList = useAppSelector(state => state.collection.collectionList)
  const dispatch = useAppDispatch()
  const onSearch =  useFullLoading(async (val: string) => {
    const username = val.trim()
    try {
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
    } catch(e) {
      console.error(e)
    }
  }, '正在获取收藏内容')

  return (
    <Space className="collection-view" direction='vertical' size="middle">
      <Search
        className='search-input'
        placeholder="Bangumi账号id"
        allowClear
        enterButton="查询"
        size="large"
        onSearch={onSearch}
      />
      <Collection collectionList={collectionList}></Collection>
    </Space>
  );
}
export default CollectionView;
