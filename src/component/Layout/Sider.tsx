import { useCallback, useEffect, useState } from 'react'
import router,{ type DisabledInfo } from './router'
import { Button, Layout, Menu, type MenuProps, notification } from 'antd'
import { NavLink, useLocation } from 'react-router-dom'
import { useLoading, useRouterDisabled } from 'src/lib/hooks'
import { CommonRouterLink } from 'src/component/common/link'
import useUpdaterAndNotify from 'src/component/common/update'
import { useAppSelector } from 'src/store'
import log from 'electron-log'
import './Sider.styl'
type MenuItem = Required<MenuProps>['items'][number];
const { Sider } = Layout

const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    height: '94vh',
    color: '#fff',
    backgroundColor: '#ffffffaa',
    borderRadius: '0 8px 8px 0',
    overflow: 'hidden',
    position: 'sticky',
    top: 0,
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
  const routerDisabled = useRouterDisabled()
  const selectedKeys = [ useLocation().pathname ]

  const getMenuItem = useCallback((props: MenuItemProps) => {
    const { label, key, icon, children, type, path, disabledInfo } = props;
    let disabled = false;
    if (disabledInfo?.depCollection) {
      disabled = routerDisabled
    }
    const labelCp = !disabled
      ? <NavLink style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })} to={path}>{label}</NavLink>
      : <CommonRouterLink route={{ path, sider: { disabledInfo, label, icon } }}>{ label }</CommonRouterLink>
    return {
      key,
      icon,
      children,
      label: labelCp,
      type,
      disabled,
    } as MenuItem;
  }, [routerDisabled])
  
  const getMenuItems = useCallback(
    () => router.filter((item) => item.sider).map((item) =>
      getMenuItem({
        label: item.sider!.label,
        path: item.path,
        key: item.path,
        icon: item.sider!.icon,
        disabledInfo: item.sider!.disabledInfo,
      })
  ), [ getMenuItem ])

  const [ items, setItems ] = useState(getMenuItems())
  useEffect(() => {
    setItems(getMenuItems())
  }, [ getMenuItems ])

  const appInfo = useAppSelector(state => state.app)

  const version = useAppSelector(state => state.app.app.version)

  const { checkUpdate: _checkUpdate } = useUpdaterAndNotify()
  const [ loading, checkUpdate ] = useLoading(async () => {
    return _checkUpdate && _checkUpdate(true).then(res => {
      if (!res) {
        notification.success({
          message: '更新提示',
          description: `当前版本 ${version} 已是最新，无需更新`,
          key: 'version:latest',
          duration: 2
        })
      }
    }).catch(log.error)
  })
  
  return (
    <Sider style={siderStyle} className="app-sider">
        <Menu
            defaultSelectedKeys={[router[0].path]}
            selectedKeys={selectedKeys}
            mode="inline"
            theme="light"
            items={items}
        />
        <div className='app-info'>
          <div>{ appInfo.app.appName }</div>
          <Button type='text' size='small' style={{color: '#666'}} loading={loading} onClick={checkUpdate}>
            { appInfo.app.version }
          </Button>
        </div>
    </Sider>
  )
}

export default AppSider;