import { BrowserWindow, ipcMain } from "electron";

export function handleEvents(mainWin: BrowserWindow) {
    ipcMain.on('open-login', (event, arg) => {
        mainWin.webContents.executeJavaScript(`
            window.location.hash = "#/login"
        `);
        mainWin.show();
    });
}