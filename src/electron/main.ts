import { app, BrowserWindow, type BrowserWindow as IBrowserWindow, Menu, type MenuItemConstructorOptions, globalShortcut } from 'electron'
import { rewriteWindow } from './windowInterceptor'
import { setIpcMain, removeIpcMain } from './ipcMain'
import { isMac } from './env'
import { initDB } from './sqlite'
import AppUpdater from './updater'
import url  from 'url'
import path from 'path'

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    title: 'Sangreal',
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 删除菜单
  // win.removeMenu();

  // 加载index.html文件
  win.loadURL(isDev ? 'http://localhost:3000' : url.format({
    protocol: 'file',
    slashes: true,
    // pathname: path.join(__dirname, '../html/index.html'),
    pathname: path.join(__dirname, '../../dist/html/index.html'),
  }));

  // 打开开发者工具
  isDev && win.webContents.openDevTools();
  globalShortcut.register('F12', () => {
    // 打开控制台的代码
    (win as BrowserWindow).webContents.openDevTools()
  });

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    removeIpcMain()
    globalShortcut.unregisterAll()
  });

  return win
}

function setMenu(): void {
  const baseMenu: MenuItemConstructorOptions[] = [
  {
    label: '关于',
    role: 'about',
  }, {
    label: '重启',
    role: 'reload'
  }]

  const menuTmp = isMac ? [{
    label: app.name,
    submenu: baseMenu,
  }, {
    label: "Edit",
    submenu: [
      { label: '复制', accelerator: 'CmdOrCtrl+C', selector: 'copy:'},
      { label: '粘贴', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: '剪切', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: '撤销', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: '重做', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { label: '全选', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
    ]
  }] : baseMenu
  
  const menu = Menu.buildFromTemplate(menuTmp)
  Menu.setApplicationMenu(menu)
}

async function main() {
    initDB()
    await app.whenReady()
    setMenu()
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWin()
    })

    createWin()
    setIpcMain()
}

function createWin() {
  const win = createWindow()
  new AppUpdater(win as IBrowserWindow).initRenderer()
  rewriteWindow(win)
}

main()
