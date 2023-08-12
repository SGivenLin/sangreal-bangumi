import CollectionView from 'src/views/CollectionView/CollectionView'
import AuthorView from 'src/views/AuthorView/AuthorView'
import BangumiDIffView from 'src/views/BangumiDiffView/BangumiDIffView'
import Home from 'src/views/Home/Home';
import {
    AppstoreOutlined,
    TeamOutlined,
    DiffOutlined,
    HomeOutlined,
} from '@ant-design/icons';

interface DisabledInfo {
    depCollection: boolean,
    message: string,
}
interface RouterItem {
    element: React.ReactNode,
    path: string,
    homeImg?: string,
    desc?: string,
    sider?: {
        label: string,
        icon?: React.ReactNode,
        disabledInfo?: DisabledInfo
    }
}

const router: RouterItem[] = [{
    element: <Home></Home>,
    path: '/',
    sider: {
        label: '主 页',
        icon: <HomeOutlined />
    }
},
{
    element: <CollectionView></CollectionView>,
    path: '/collection',
    homeImg: require('src/static/collection.avif'),
    desc: '查询 bangumi.tv 账号收藏的【看过】动画',
    sider: {
        label: '收 藏',
        icon: <AppstoreOutlined />,
    }
}, {
    element: <AuthorView></AuthorView>,
    path: '/author',
    homeImg: require('src/static/author.png'),
    desc: '对已查询到的收藏动画的制作人员进行查询分类',
    sider: {
        label: '收藏-创作者',
        icon: <TeamOutlined />,
        disabledInfo: {
            depCollection: true,
            message: '请先执行【收藏】查询',
        }
    }
}, {
    element: <BangumiDIffView></BangumiDIffView>,
    path: '/bangumi-diff',
    homeImg: require('src/static/diff.jpg'),
    desc: '对 bangumi.tv 上的两部动画的制作人员进行对比',
    sider: {
        label: '动画制作组对比',
        icon: <DiffOutlined />,
    }
}]

export default router
export type { RouterItem, DisabledInfo }