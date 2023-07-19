import { BrowserWindow, globalShortcut } from "electron";

export function registerGlobalShortCuts(mainWin: BrowserWindow) {
    globalShortcut.register('CommandOrControl+Shift+O', () => {
      console.log('Electron loves global shortcuts!')
      if (!mainWin.isDestroyed()) {
        mainWin.show();
      }
    })
  }