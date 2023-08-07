import CollectionView from 'src/views/CollectionView/CollectionView'
import AuthorView from 'src/views/AuthorView/AuthorView'
import BangumiDIffView from 'src/views/BangumiDiffView/BangumiDIffView'
import {
    AppstoreOutlined,
    TeamOutlined,
    DiffOutlined,
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
        icon: <TeamOutlined />,
        disabledInfo: {
            depCollection: true,
            message: '请先执行【收藏】查询'
        }
    }
}, {
    element: <BangumiDIffView></BangumiDIffView>,
    path: '/bangumi-diff',
    sider: {
        label: '动画制作团队对比',
        icon: <DiffOutlined />,
    }
}]

export default router
export type { RouterItem, DisabledInfo }