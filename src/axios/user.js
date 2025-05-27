import axios from 'axios'
import { useUserStore } from '@/components/store/user'

const userApi = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 1000,
})

userApi.interceptors.request.use(
  async (config) => {
    console.log('[요청 발신]: ', config.method, config.url, config.data)
    const userStore = useUserStore()

    if (userStore.tokenStatus === 'access token 만료') {
      await userStore.refresh()
    }

    if (userStore.tokens?.accessToken) {
      config.headers['Authorization'] = `Bearer ${userStore.tokens.accessToken}`
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
    const userStore = useUserStore()
    console.log('[오류 수신 1]: ', error)

    if (error.response?.status === 401 && userStore.tokens?.refreshToken) {
      try {
        // 1. Refresh 요청
        await userStore.refresh()

        // 2. 원래 요청 복사 후 재시도
        const originalRequest = error.config
        originalRequest.headers['Authorization'] = `Bearer ${userStore.tokens.accessToken}`
        return userApi(originalRequest)
      } catch (refreshError) {
        console.warn('🔁 토큰 갱신 실패:', refreshError)
        userStore.logout() // refresh도 실패한 경우 로그아웃
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

const userApiNoAuth = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
})

userApiNoAuth.interceptors.request.use(
  async (config) => {
    console.log('[요청 발신]: ', config.method, config.url, config.data)
    return config
  },
  (error) => {
    console.log('[요청 실패]: ', error)
    return Promise.reject(error)
  },
)

userApiNoAuth.interceptors.response.use(
  (response) => {
    console.log('[응답 수신 2]: ', response.status, response.data)
    return response
  },
  async (error) => {
    console.log('[오류 수신 2]: ', error)
    return Promise.reject(error)
  },
)
export { userApi, userApiNoAuth }
