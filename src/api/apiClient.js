const BASE_URL = import.meta.env.VITE_API_BASE_URL

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    }

    if (mergedOptions.body && mergedOptions.body instanceof FormData) {
      delete mergedOptions.headers['Content-Type']
    } else if (mergedOptions.body && typeof mergedOptions.body === 'object') {
      mergedOptions.body = JSON.stringify(mergedOptions.body)
    }

    return await fetch(url, mergedOptions)
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body })
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

export default new ApiClient()
