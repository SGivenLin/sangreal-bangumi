import React from 'react';
import { Input } from 'antd';
import './App.styl';

const { Search } = Input

function App() {
  const onSearch = (val: string) => {
    val = val.trim()
  }

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
    </div>
  );
}

export default App;
