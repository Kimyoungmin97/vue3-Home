import axios from 'axios'

const houseApi = axios.create({
  baseURL: 'http://localhost:8080/api/houses',
  timeout: 1000,
})

houseApi.interceptors.request.use(
  async (config) => {
    console.log('[요청 발신]: ', config.method, config.url, config.data)
    return config
  },
  (error) => {
    console.log('[요청 실패]: ', error)
    return Promise.reject(error)
  },
)

houseApi.interceptors.response.use(
  (response) => {
    console.log('[응답 수신 1]: ', response.status, response.data)
    return response
  },
  async (error) => {
    console.log('[오류 수신 1]: ', error)
    return Promise.reject(error)
  },
)
export { houseApi }
