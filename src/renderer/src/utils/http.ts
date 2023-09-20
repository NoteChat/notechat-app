class Http {
  get(url: any, params: any) {
    // GET请求
    const newUrl = params ? this.build(url, params) : url
    return this.request(newUrl, {
      method: 'GET'
    })
  }

  post(url: any, body?: any) {
    // POST请求
    const options: any = { method: 'POST' }
    try {
      if (body) options.body = JSON.stringify(body)
    } catch (error) {
      options.body = undefined
    }
    return this.request(url, options)
  }

  postAsFormData(url: any, params: any) {
    const options: any = { method: 'POST' }
    if (params) options.body = this.buildFormData(params)
    return this.request(url, options)
  }

  postForm(url: any, form: any) {
    const options: any = { method: 'POST' }
    if (form) options.body = new FormData(form)
    return this.request(url, options)
  }

  request(url: any, options: RequestInit) {
    const accessToken = localStorage.getItem('token')
    options.credentials = 'same-origin'
    options.headers = this.defaultHeader()
    if (accessToken) {
      options.headers.Authorization = 'Bearer ' + accessToken
    }
    return fetch(url, options)
      .then((response: any) => {
        return response.json()
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  defaultHeader() {
    const header = {
      Accept: '*/*',
      'Content-Type': 'application/json'
    }
    return header
  }

  build(url: any, params: any) {
    // URL构建方法
    const uri = new URL(url)
    if (params) {
      for (const param in params) {
        if (param) {
          uri.searchParams.set(param, params[param])
        }
      }
    }
    return uri
  }

  buildFormData(params: any) {
    if (params) {
      const data = new FormData()
      for (const p in params) {
        if (p) {
          data.append(p, params[p])
        }
      }
      return data
    }
    return null
  }
}

const httpInstance = new Http()

export default httpInstance
