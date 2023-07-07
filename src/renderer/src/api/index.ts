export * from './api'
import { Api } from './api'

export function getDefaultHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
}

const MyApi = new Api({
  baseUrl: import.meta.env.RENDERER_VITE_REMOTE_API,
  customFetch: (...fetchParams) => {
    return window.api.fetch(fetchParams);
  }
})

export default MyApi
