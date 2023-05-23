import React, { useEffect, useState } from 'react';
import { getAllCollection } from 'src/service/action';
import { Input, Space } from 'antd';
import Collection from 'src/component/collection'
import type { CollectionRes } from 'src/component/collection/type'
import type { RootState } from 'src/store'
import { useDispatch, useSelector } from 'react-redux'
import { setCollectionList } from 'src/store/collection'

const { Search } = Input

function CollectionView() {
  const collectionList = useSelector((state: RootState) => state.collection.collectionList)
  const dispatch = useDispatch()
  const onSearch =  async (val: string) => {
    const username = val.trim()
    const list = await getAllCollection({
      subject_type:2,
      type:2,
      limit:50,
      offset:0
    }, {
      username
    })

    dispatch(setCollectionList(list))
  }
  useEffect(() => {
    onSearch('linwenkanh') // todo
  }, [])
 

  return (
    <Space className="collection-view" direction='vertical' size="middle">
      <Search
        className='search-input'
        placeholder="名称"
        allowClear
        enterButton="搜索"
        size="large"
        onSearch={onSearch}
      />
      <Collection collectionList={collectionList}></Collection>
    </Space>
  );
}

export default CollectionView;
