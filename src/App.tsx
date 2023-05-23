import React from 'react';
import { Layout } from 'antd';
import { Sider, Content } from 'src/component/Layout'

function App() {
  return (
      <div className='app'>
        <Layout>
          <Sider></Sider>
          <Layout>
            <Content></Content>
          </Layout>
        </Layout>
      </div>
  );
}

export default App;
