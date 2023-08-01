import { useEffect, useState } from 'react'
import router,{ type DisabledInfo } from './router'
import { Layout, Menu, type MenuProps, Popover } from 'antd'
import { Link } from 'react-router-dom'
import { useAppSelector } from 'src/store';
type MenuItem = Required<MenuProps>['items'][number];
const { Sider } = Layout

const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: 'white'
};
interface MenuItemProps {
  label: string;
  key: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  type?: MenuProps['itemType'];
  path: string;
  disabledInfo?: DisabledInfo;
}

function AppSider() {
  const collectionList = useAppSelector(state => state.collection.collectionList);

  function getMenuItem(props: MenuItemProps): MenuItem {
    const { label, key, icon, children, type, path, disabledInfo } = props;
    let disabled = false;
    if (disabledInfo?.depCollection) {
      disabled = !collectionList.length;
    }
    const labelCp = !disabled
      ? <Link to={path}>{label}</Link>
      : <Popover placement="rightTop" content={<span style={{color: '#666'}}>{ disabledInfo?.message }</span>}>
          <span style={{ cursor: 'not-allowed' }}><Link style={{ pointerEvents: 'none' }} to={path}>{label}</Link></span>
        </Popover>

    return {
      key,
      icon,
      children,
      label: labelCp,
      type,
      disabled,
    } as MenuItem;
  }
  
  function getMenuItems(): MenuItem[] {
    return router.filter((item) => item.sider).map((item) =>
      getMenuItem({
        label: item.sider!.label,
        path: item.path,
        key: item.path,
        icon: item.sider!.icon,
        disabledInfo: item.sider!.disabledInfo,
      })
    );
  }
  // const items = useMenuItems()
  const [ items, setItems ] = useState(getMenuItems())
  useEffect(() => {
    setItems(getMenuItems())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ collectionList ])

  
    return (
        <Sider style={siderStyle}>
            <Menu
                defaultSelectedKeys={['/']}
                mode="inline"
                theme="light"
                items={items}
            />
        </Sider>
    )
}

export default AppSider;