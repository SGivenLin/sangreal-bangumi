// const { app, BrowserWindow } = require('electron');
import { app, BrowserWindow, type BrowserWindow as IBrowserWindow, Menu, ipcMain } from 'electron'

const url = require('url');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
let win: null | IBrowserWindow  = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    title: 'sangreal',
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
    pathname: path.join(__dirname, 'index.html'),
  }));

  // 打开开发者工具
  isDev && win.webContents.openDevTools();

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    win = null;
  });
}

function setMenu(): void {
  const menu = Menu.buildFromTemplate([{
    label: '关于',
    role: 'about'
  }])
  Menu.setApplicationMenu(menu)
}

async function main() {
    await app.whenReady()
    setMenu()
    app.on('window-all-closed', () => {
        console.log('关闭')
        if (process.platform !== 'darwin') app.quit()
    })
    createWindow()
    app.on('activate', () => {
        console.log('activate')
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
}

main()
