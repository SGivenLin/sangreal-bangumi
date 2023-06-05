import { Layout } from 'antd'
import { Routes, Route } from 'react-router-dom'
import CollectionView from 'src/views/CollectionView/CollectionView'
import AuthorView from 'src/views/AuthorView/AuthorView'
const { Content } = Layout

function AppContent() {
    return (
        <Content>
            <Routes>
                <Route path='/' element={<CollectionView></CollectionView>}></Route>
                <Route path='/author' element={<AuthorView></AuthorView>}></Route>
            </Routes>
        </Content>
    )
}

export default AppContent