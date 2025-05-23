import axios from 'axios'
import { useUserStore } from '@/components/store/user'

const userApi = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  timeout: 1000,
})

userApi.interceptors.request.use(
  async (config) => {
    console.log('[요청 발신]: ', config.method, config.url, config.data)
    const userStroe = useUserStore()
    if (userStroe.tokens?.accessToken) {
      config.headers['Authorization'] = `Bearer ${userStroe.tokens.accessToken}`
    }
    return config
  },
  (error) => {
    console.log('[요청 실패]: ', error)
    return Promise.reject(error)
  },
)

userApi.interceptors.response.use(
  (response) => {
    console.log('[응답 수신 1]: ', response.status, response.data)
    return response
  },
  async (error) => {
    console.log('[오류 수신 1]: ', error)
    return Promise.reject(error)
  },
)
export { userApi }
