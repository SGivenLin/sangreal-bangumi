import { Layout, Spin } from 'antd';
import { Sider, Content } from 'src/component/Layout'
import { useAppSelector } from 'src/store'

function App() {
  const loading = useAppSelector(state => state.loading)

  return (
    <Spin tip={<span style={{ fontWeight: 'bold' }}>{loading.text}</span>} spinning={loading.loading} size="large">
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
