import { BrowserWindow, globalShortcut } from "electron";

export function registerGlobalShortCuts(mainWin: BrowserWindow, commandWin: BrowserWindow) {
    globalShortcut.register('CommandOrControl+Shift+O', () => {
      console.log('Electron loves global shortcuts!')
      if (!commandWin.isDestroyed()) {
        commandWin.show();
      }
    })
  }