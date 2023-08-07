// const { app, BrowserWindow } = require('electron');
import { app, BrowserWindow, type BrowserWindow as IBrowserWindow, Menu, type MenuItemConstructorOptions } from 'electron'
import { rewriteWindow } from './windowInterceptor'
import { setIpcMain, removeIpcMain } from './ipcMain'
import { isMac } from './env'
const url = require('url');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
let win: null | IBrowserWindow  = null;

function createWindow() {
  win = new BrowserWindow({
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

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    removeIpcMain()
    win = null;
  });
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
    await app.whenReady()
    setMenu()
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWin()
    })

    createWin()
}

function createWin() {
  createWindow()
  rewriteWindow(win)
  setIpcMain(win)
}

main()
