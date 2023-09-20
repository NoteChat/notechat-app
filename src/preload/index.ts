import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  fetch: function <T>(data: T) {
    // const microseconds = new Date().getTime();
    const url = data[0];
    const reqId = url;// + Date.now();
    ipcRenderer.send('fetch', { id: reqId, reqParams: data })
    return new Promise((resolve, reject) => {
      ipcRenderer.once(reqId, (event, res) => {
        console.log('fetch-response', data, event, res)
        if (res.error) {
          reject(res.error)
        } else {
          if (res.statusCode === 401) {
            window.location.hash = '#/login'
          }
          resolve({
            ok: true,
            data: res
          })
        }
      })
    })
  },
  invoke: function (fnName: string, ...args: any[]) {
    return ipcRenderer.invoke(fnName, ...args)
  },
  send: function (channel: string, ...args: any[]) {
    ipcRenderer.send(channel, ...args)
  },
  on: function (channel: string, listener: (...args: any[]) => void) {
    ipcRenderer.on(channel, listener)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
