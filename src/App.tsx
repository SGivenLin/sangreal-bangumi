import React, { useCallback, useEffect, useState } from 'react';
import api from './service'
import { getAllCollection } from './service/action';
import { Input } from 'antd';
import Collection from './component/collection'
import type { CollectionRes } from './component/collection/type'
import './App.styl';

const { Search } = Input

function App() {
  const [ collectionList, setCollectionList ] = useState<CollectionRes['data']>([])
  const onSearch =  async (val: string) => {
    const username = val.trim()
    // const res: CollectionRes = await api.getCollectionList({
    //   subject_type:2,
    //   type:2,
    //   limit:30,
    //   offset:0
    // })
  
    // setCollectionList(res.data)
    const list = await getAllCollection({
      subject_type:2,
      type:2,
      limit:50,
      offset:0
    })
    setCollectionList(list)
  }
  useEffect(() => {
    onSearch('linwenkanh') // todo
  }, [])
 

  return (
    <div className="App">
      <Search
        className='search-input'
        placeholder="名称"
        allowClear
        enterButton="搜索"
        size="large"
        onSearch={onSearch}
      />
      <Collection collectionList={collectionList}></Collection>
    </div>
  );
}

export default App;
