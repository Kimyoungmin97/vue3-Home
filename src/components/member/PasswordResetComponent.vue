<template>
  <div class="password-reset-container">
    <!-- 헤더 -->
    <div class="reset-header">
      <button class="back-button" @click="goBack">
        <i class="bi bi-chevron-left"></i>
      </button>
      <h2 class="reset-title">비밀번호 찾기</h2>
    </div>

    <!-- 비밀번호 찾기 폼 -->
    <div class="reset-form" v-if="!isCompleted">
      <div class="form-description">
        <h3>비밀번호를 찾기 위해 정보를 입력해주세요</h3>
        <p>
          가입 시 등록한 아이디와 이메일을 입력하시면<br />등록된 비밀번호를 확인하실 수 있습니다.
        </p>
      </div>

      <div class="form-group">
        <label>아이디</label>
        <input
          type="text"
          class="form-control"
          placeholder="아이디를 입력해주세요"
          v-model="username"
        />
      </div>

      <div class="form-group">
        <label>이메일</label>
        <input
          type="email"
          class="form-control"
          placeholder="가입 시 등록한 이메일을 입력해주세요"
          v-model="email"
        />
      </div>

      <button class="submit-button" :disabled="!isFormValid || isLoading" @click="findPassword">
        {{ isLoading ? '조회중...' : '비밀번호 찾기' }}
      </button>

      <div class="help-text">
        <p>• 입력하신 정보가 가입 정보와 일치하지 않으면 비밀번호가 조회되지 않습니다.</p>
        <p>• 보안을 위해 비밀번호 확인 후 즉시 변경하시기를 권장합니다.</p>
      </div>
    </div>

    <!-- 완료 화면 -->
    <div v-if="isCompleted" class="completion-screen">
      <div class="completion-icon">
        <i class="bi bi-check-circle-fill"></i>
      </div>
      <h3>비밀번호를 찾았습니다</h3>
      <p>{{ username }}님의 비밀번호입니다.</p>

      <div class="password-display">
        <div class="password-label">임시 비밀번호</div>
        <div class="password-value">
          <span v-if="showPassword">{{ foundPassword }}</span>
          <span v-else>{{ maskedPassword }}</span>
          <button class="toggle-password" @click="togglePasswordVisibility">
            <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
          </button>
        </div>
        <button class="copy-button" @click="copyPassword">
          <i class="bi bi-clipboard"></i> 복사
        </button>
      </div>

      <div class="completion-info">
        <div class="info-item security-warning">
          <i class="bi bi-shield-exclamation"></i>
          <span>보안을 위해 로그인 후 비밀번호를 변경해주세요</span>
        </div>
        <div class="info-item">
          <i class="bi bi-eye-slash"></i>
          <span>다른 사람이 보지 않도록 주의하세요</span>
        </div>
      </div>

      <button class="submit-button" @click="goToLogin">로그인하러 가기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { userApiNoAuth } from '@/axios/user'

const emit = defineEmits(['close', 'go-to-login'])

// 폼 데이터
const username = ref('')
const email = ref('')
const isLoading = ref(false)
const isCompleted = ref(false)
const foundPassword = ref('')
const showPassword = ref(false)

// 폼 유효성 검사
const isFormValid = computed(() => {
  return username.value.trim() !== '' && email.value.trim() !== '' && isValidEmail(email.value)
})

// 비밀번호 마스킹
const maskedPassword = computed(() => {
  if (!foundPassword.value) return ''
  return '*'.repeat(foundPassword.value.length)
})

// 이메일 유효성 검사
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 뒤로가기
const goBack = () => {
  if (isCompleted.value) {
    isCompleted.value = false
    foundPassword.value = ''
    showPassword.value = false
  } else {
    emit('close')
  }
}

// 비밀번호 찾기
const findPassword = async () => {
  if (!isFormValid.value || isLoading.value) return

  isLoading.value = true

  try {
    // API 호출 - 실제 비밀번호 조회
    const response = await userApiNoAuth({
      url: '/api/user/findPassword',
      method: 'post',
      params: {
        username: username.value,
        email: email.value,
      },
    })
    console.log(response.data.data)
    foundPassword.value = response.data.password || response.data.data || '조회된 비밀번호'
    isCompleted.value = true
  } catch (error) {
    console.error('비밀번호 찾기 실패:', error)

    // 에러 메시지 처리
    if (error.response?.status === 404) {
      alert('입력하신 아이디 또는 이메일이 일치하지 않습니다.')
    } else if (error.response?.status === 400) {
      alert('잘못된 요청입니다. 입력 정보를 확인해주세요.')
    } else {
      alert('비밀번호 조회에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  } finally {
    isLoading.value = false
  }
}

// 비밀번호 표시/숨김 토글
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 비밀번호 복사
const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(foundPassword.value)
    alert('비밀번호가 클립보드에 복사되었습니다.')
  } catch (error) {
    console.error('복사 실패:', error)
    alert('복사에 실패했습니다.')
  }
}

// 로그인 페이지로 이동
const goToLogin = () => {
  emit('go-to-login')
}
</script>

<style scoped>
.password-reset-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 0 16px;
}

.reset-header {
  display: flex;
  align-items: center;
  padding: 16px 0;
  position: relative;
}

.back-button {
  background: none;
  border: none;
  font-size: 20px;
  padding: 0;
  position: absolute;
  left: 0;
}

.reset-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.reset-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

.form-description {
  margin-bottom: 32px;
  text-align: center;
}

.form-description h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.form-description p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  color: #666;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
}

.submit-button {
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  margin-top: auto;
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-button:not(:disabled) {
  background-color: #0d6efd;
  color: white;
}

.submit-button:not(:disabled):hover {
  background-color: #0b5ed7;
}

.help-text {
  margin-top: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #0d6efd;
}

.help-text p {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.help-text p:last-child {
  margin-bottom: 0;
}

.completion-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 0;
}

.completion-icon {
  font-size: 64px;
  color: #198754;
  margin-bottom: 24px;
}

.completion-screen h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.completion-screen p {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.5;
}

.password-display {
  width: 100%;
  max-width: 300px;
  margin-bottom: 32px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e9ecef;
}

.password-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.password-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.toggle-password {
  background: none;
  border: none;
  color: #666;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
}

.toggle-password:hover {
  color: #0d6efd;
}

.copy-button {
  width: 100%;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.copy-button:hover {
  background-color: #5a6268;
}

.copy-button i {
  margin-right: 6px;
}

.completion-info {
  width: 100%;
  margin-bottom: 32px;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  margin-bottom: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
}

.info-item.security-warning {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}

.info-item i {
  font-size: 18px;
  margin-right: 12px;
  color: #0d6efd;
}

.info-item.security-warning i {
  color: #f39c12;
}

.info-item:last-child {
  margin-bottom: 0;
}
</style>
