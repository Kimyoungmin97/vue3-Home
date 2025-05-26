import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/axios/user'
import { jwtDecode } from 'jwt-decode'
export const useUserStore = defineStore(
  'user',
  () => {
    const _isLoggedIn = ref(false)
    const _loginUser = ref({})

    const isLoggedIn = computed(() => _isLoggedIn.value)
    const loginUser = computed(() => _loginUser.value)

    const login = async ({ username, password }) => {
      try {
        const response = await userApi({
          url: '/api/auth/login',
          method: 'post',
          data: { username, password },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        _tokens.value = response.data
        _isLoggedIn.value = true
        const decoded = jwtDecode(_tokens.value.accessToken)
        _loginUser.value = {
          name: decoded.name,
          username: decoded.username,
          role: decoded.role,
          aptSeq: decoded.aptSeq,
          residence: decoded.residence,
        }
      } catch (e) {
        throw 'id/pass 확인' + e.name
      }
    }

    const logout = async () => {
      try {
        _tokens.value.accessToken = null
        await userApi({
          url: '/api/auth/logout',
          method: 'post',
          headers: {
            'Refresh-Token': _tokens.value.refreshToken,
          },
        })
      } finally {
        _loginUser.value = {}
        _isLoggedIn.value = false
        _tokens.value = {}
      }
    }
    const _tokens = ref({})
    const tokens = computed(() => _tokens.value)

    const refresh = async () => {
      try {
        const response = (_tokens.value.accessToken = null)
        await userApi({
          url: '/api/auth/refresh',
          method: 'post',
          headers: {
            'Refresh-Token': _tokens.value.refreshToken,
          },
        })
        _tokens.value = response.data
        _isLoggedIn.value = true
        const decoded = jwtDecode(_tokens.value.accessToken)
        _loginUser.value = {
          name: decoded.name,
          username: decoded.username,
          role: decoded.role,
          aptSeq: decoded.aptSeq,
          residence: decoded.residence,
        }
      } catch (e) {
        console.log(e)
      }
    }

    // token의 만료 상태를 확인하기 위한 부분----------
    const tokenTime = ref(0)
    let intervalId
    const resetTokenTime = () => {
      window.clearInterval(intervalId)
      tokenTime.value = 0
      intervalId = setInterval(() => {
        tokenTime.value++
      }, 1000)
    }

    const tokenStatus = computed(() => {
      if (!_tokens.value.refreshToken) {
        window.clearInterval(intervalId)
        tokenTime.value = 0
        return '로그아웃 상태'
      }
      if (tokenTime.value > 120) {
        return 'refresh token 만료'
      } else if (tokenTime.value > 60) {
        return 'access token 만료'
      } else {
        return 'token 유효'
      }
    })
    // token의 만료 상태를 확인하기 위한 부분----------

    // TODO: 공개할 기능들을 등록해주자.
    return {
      isLoggedIn,
      loginUser,
      login,
      logout,
      refresh,
      _loginUser,
      _isLoggedIn,
      tokenTime,
      tokenStatus,
      tokens,
    }

    // END
  },
  {
    persist: { storage: sessionStorage },
  },
)
