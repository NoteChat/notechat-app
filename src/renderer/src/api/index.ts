export * from './api'
import { io } from 'socket.io-client'
import { Api } from './api'

export function getDefaultHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
}

const remoteUrl = import.meta.env.RENDERER_VITE_REMOTE_API as string
const httpProtocol = window.location.protocol.replace(':', '');
let defaultOptions: any = undefined;

if (httpProtocol === 'http' || httpProtocol === 'https') {
  defaultOptions = {
    baseApiParams: {
      format: 'json'
    },
    customFetch: (...fetchParams: Parameters<typeof fetch>) => {
      const params = fetchParams[1] as any;
      params.headers = getDefaultHeader();
      return fetch(...fetchParams);
    }
  }
} else {
  defaultOptions = {
    baseUrl: remoteUrl,
    customFetch: (...fetchParams) => {
      fetchParams[1].headers = getDefaultHeader();
      return window.api.fetch(fetchParams)
    }
  }
}

const MyApi = new Api(defaultOptions)

export const Socket = io(remoteUrl, {
  auth: (cb) => {
    cb({ token: `${localStorage.getItem('token')}` })
  },
  transports: ['websocket']
})


export default MyApi
