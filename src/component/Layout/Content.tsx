import { Layout } from 'antd'
import { Routes, Route } from 'react-router-dom'
import router from './router'

const { Content } = Layout

function AppContent() {
    return (
        <Content style={{ padding: '10px', background: '#fff' }} className='main-content'>
            <Routes>
                { router.map(item => <Route key={item.path} path={item.path} element={item.element}></Route>) }
            </Routes>
        </Content>
    )
}

export default AppContent