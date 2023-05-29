import React, { useEffect } from 'react';
import { getAllCollection } from 'src/service/action';
import { Input, Space } from 'antd';
import Collection from 'src/component/collection'
import { useAppSelector, useAppDispatch } from 'src/store'
import { setCollectionList } from 'src/store/collection'

const { Search } = Input

function CollectionView() {
  const collectionList = useAppSelector(state => state.collection.collectionList)
  const dispatch = useAppDispatch()
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
    onSearch('linwenkanh')
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
