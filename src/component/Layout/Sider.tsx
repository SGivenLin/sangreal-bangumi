import { Layout, Menu, type MenuProps } from 'antd'
import { Link } from 'react-router-dom'
import {
    AppstoreOutlined,
    ContainerOutlined,
} from '@ant-design/icons';
type MenuItem = Required<MenuProps>['items'][number];
const { Sider } = Layout

const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: 'white'
};

function getItem(
    label: React.ReactNode,
    key: React.Key,
    href: string,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label: <Link to={href}>111</Link>,
      type,
    } as MenuItem;
  }
  
  const items: MenuItem[] = [
    getItem('Option 1', '1', '/', <AppstoreOutlined />),
    getItem('Option 2', '2', '/author', <ContainerOutlined />),
  ];

function AppSider() {
    return (
        <Sider style={siderStyle}>
            <Menu
                defaultSelectedKeys={['1']}
                mode="inline"
                theme="light"
                items={items}
            />
        </Sider>
    )
}

export default AppSider