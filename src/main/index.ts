import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icons/512.png?asset'
import { fetchProxy } from './fetch'
import { createTrayMenu } from './trayMenu'
import { registerGlobalShortCuts } from './shortcuts'
import { handleEvents } from './event'


function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    show: false,
    frame: true,
    center: true,
    icon: icon,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/index.html`)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

function createCommandPaletteWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    alwaysOnTop: true,
    width: 800,
    height: 400,
    show: false,
    frame: false,
    y: 200,
    resizable: true,
    movable: true,
    icon: icon,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/commandPalette.html`)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/commandPalette.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  let win = createWindow()
  let commandPaletteWin = createCommandPaletteWindow()

  createTrayMenu(win, commandPaletteWin)
  registerGlobalShortCuts(win, commandPaletteWin)
  handleEvents(win, commandPaletteWin)

  win.on('show', () => {
    if (commandPaletteWin) {
      commandPaletteWin.hide();
    }
  });

  commandPaletteWin.on('show', () => {
    if (win) {
      win.hide();
    }
  })

  // Set a variable when the app is quitting.
  let isAppQuitting = false;
  app.on('before-quit', function (evt) {
      console.log('evt: ', evt);
      isAppQuitting = true;
  });

  const handleCloseWin = (obj) => {
    return (event) => {
      if (!isAppQuitting) {
        event.preventDefault();
      }
      obj.hide();
    }
  }
  
  win.on('close', handleCloseWin(win));
  commandPaletteWin.on('close', handleCloseWin(commandPaletteWin));

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      win = createWindow()
      commandPaletteWin = createCommandPaletteWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit() // disable quit app when all windows are closed.
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// fetch Data
ipcMain.on('fetch', fetchProxy)
