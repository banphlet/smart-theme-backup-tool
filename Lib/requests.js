import axios from 'axios'

const isServer = !process.browser

if (process.env.NODE_ENV !== 'production') {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
}

const instance = axios.create({
  baseURL: (isServer ? process.env.NEXT_PUBLIC_APP_URL : '') + '/api',
  withCredentials: true
})

instance.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    if (error.response) {
      if (error.response.status === 401) {
        if (process.browser) {
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    } else if (error.request) {
      return Promise.reject(error.request)
    } else {
      return Promise.reject(error)
    }
  }
)

export default instance
