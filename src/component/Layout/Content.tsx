import { Layout } from 'antd'
import { Routes, Route } from 'react-router-dom'
import router from './router'
import './Content.styl'
const { Content } = Layout

function AppContent() {
    return (
        <Content style={{ padding: '0 10px 10px' }} className='main-content'>
            <Routes>
                { router.map(item => <Route key={item.path} path={item.path} element={item.element}></Route>) }
            </Routes>
        </Content>
    )
}

export default AppContent