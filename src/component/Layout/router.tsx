import CollectionView from 'src/views/CollectionView/CollectionView'
import AuthorView from 'src/views/AuthorView/AuthorView'
import {
    AppstoreOutlined,
    ContainerOutlined,
} from '@ant-design/icons';
import React from 'react';

interface DisabledInfo {
    depCollection: boolean,
    message: string
}
interface RouterItem {
    element: React.ReactNode,
    path: string,
    sider?: {
        label: string,
        icon?: React.ReactNode,
        disabledInfo?: DisabledInfo
    }
}

const router: RouterItem[] = [{
    element: <CollectionView></CollectionView>,
    path: '/',
    sider: {
        label: '收藏',
        icon: <AppstoreOutlined />,
    }
}, {
    element: <AuthorView></AuthorView>,
    path: '/author',
    sider: {
        label: '收藏/创作者',
        icon: <ContainerOutlined />,
        disabledInfo: {
            depCollection: true,
            message: '请先执行【收藏】查询'
        }
    }
}]

export default router
export type { RouterItem, DisabledInfo }