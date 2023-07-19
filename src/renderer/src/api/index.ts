export * from './api'
import { io } from 'socket.io-client'
import { Api } from './api'

export function getDefaultHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
}

console.log('renderEnv', import.meta.env)

const remoteUrl = import.meta.env.RENDERER_VITE_REMOTE_API as string

const defaultOptions =
  import.meta.env.MODE === 'web'
    ? undefined
    : {
        baseUrl: remoteUrl,
        customFetch: (...fetchParams) => {
          return window.api.fetch(fetchParams)
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
