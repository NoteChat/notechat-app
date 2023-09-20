import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      fetch: <T>(data: T) => Promise<any>
      send: (channel: string, ...args: any[]) => void
      on: (channel: string, listener: (...args: any[]) => void) => void
    }
  }
}
