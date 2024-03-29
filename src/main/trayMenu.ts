import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import { join } from 'path'

export function createTrayMenu(mainWin: BrowserWindow) {
  //  创建 Tray 对象，并指定托盘图标
  const tray = new Tray(join(__dirname, '../../resources/mac/16@2x.png'))
  //  创建用于托盘图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Chat',
      click: () => {
        if (!mainWin.isDestroyed()) {
          mainWin.show()
          mainWin.webContents.executeJavaScript(`
              window.location.hash = "#/chat"
          `)
        }
      },
      registerAccelerator: false,
      accelerator: 'CommandOrControl+Shift+O',
      type: 'normal'
    },
    {
      label: 'Document',
      click: () => {
        if (!mainWin.isDestroyed()) {
          mainWin.show()
          mainWin.webContents.executeJavaScript(`
              window.location.hash = "#/document"
          `)
        }
      },
      registerAccelerator: false,
      accelerator: 'CommandOrControl+Shift+E',
      type: 'normal'
    },
    {
      label: 'Plugin',
      type: 'normal',
      accelerator: 'CommandOrControl+Shift+B',
      click: () => {
        if (!mainWin.isDestroyed()) {
          mainWin.show()
          mainWin.webContents.executeJavaScript(`
              window.location.hash = "#/prompt"
          `)
        }
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Switch Account',
      type: 'normal',
      click: () => {
        ipcMain.emit('open-login')
      }
    },
    {
      label: 'Exit',
      role: 'quit',
      click: () => {
        app.quit()
      }
    }
  ])
  //  将托盘图标与上下文菜单关联
  tray.setContextMenu(contextMenu)
  //  设置托盘图标的提示文本
  tray.setToolTip('这是Electron的应用托盘图标')
}
