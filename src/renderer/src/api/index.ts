export * from './api'
import { Socket, io } from 'socket.io-client'
import { Api } from './api'

export function getDefaultHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
}

const remoteUrl = import.meta.env.RENDERER_VITE_REMOTE_API as string
const httpProtocol = window.location.protocol.replace(':', '')
let defaultOptions: any = undefined

if (httpProtocol === 'http' || httpProtocol === 'https') {
  defaultOptions = {
    baseApiParams: {
      format: 'json'
    },
    customFetch: (...fetchParams: Parameters<typeof fetch>) => {
      const params = fetchParams[1] as any
      params.headers = getDefaultHeader()
      return fetch(...fetchParams)
    }
  }
} else {
  defaultOptions = {
    baseUrl: remoteUrl,
    customFetch: (...fetchParams) => {
      fetchParams[1].headers = getDefaultHeader()
      return window.api.fetch(fetchParams)
    }
  }
}

const MyApi = new Api(defaultOptions)

export class MySocket {
  private static socket: Socket | undefined
  constructor() {}

  public static initSocket(token: string) {
    if (!this.socket && token) {
      this.socket = io(remoteUrl, {
        auth: (cb) => {
          cb({ token: token })
        },
        transports: ['websocket']
      })
    }
    return this.socket
  }

  public static getSocket() {
    if (this.socket) return this.socket

    const tk = localStorage.getItem('token')
    if (tk) {
      return this.initSocket(tk)
    }
    return this.socket
  }
}

export default MyApi
