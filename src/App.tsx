import { Layout, Spin } from 'antd';
import { Sider, Content } from 'src/component/Layout'
import { useAppSelector } from 'src/store'
import useUpdaterAndNotify from 'src/component/common/update'
import { useAppInfo } from 'src/lib/hooks';
import { useEffect } from 'react';
import log from 'electron-log'

function App() {
  const loading = useAppSelector(state => state.loading)
  useAppInfo()
  const { checkUpdate, contextHolder } = useUpdaterAndNotify()
  useEffect(() => {
    checkUpdate().catch(log.error)
  }, [ checkUpdate ])

  return (
    <Spin tip={<span style={{ fontWeight: 'bold' }}>{loading.text}</span>} spinning={loading.loading} size="large">
      { contextHolder }
      <div className='app'>
        <Layout>
          <Sider></Sider>
          <Layout>
            <Content></Content>
          </Layout>
        </Layout>
      </div>
    </Spin>
  );
}

export default App;
