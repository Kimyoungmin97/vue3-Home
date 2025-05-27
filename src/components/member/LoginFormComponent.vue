<template>
  <div class="login-container">
    <!-- 헤더 -->
    <div class="login-header" v-if="!showRegister && !showPasswordReset">
      <button class="back-button" @click="goBack">
        <i class="bi bi-chevron-left"></i>
      </button>
      <h2 class="login-title">로그인</h2>
    </div>

    <!-- 로그인 폼 -->
    <div class="login-form" v-if="!showRegister && !showPasswordReset">
      <!-- 휴대폰번호/이메일 입력 -->
      <div class="form-group">
        <label>휴대폰번호 · 이메일</label>
        <input
          type="text"
          class="form-control"
          placeholder="휴대폰 번호 또는 이메일 입력"
          v-model="username"
        />
      </div>

      <!-- 비밀번호 입력 -->
      <div class="form-group">
        <label>비밀번호</label>
        <input
          type="password"
          class="form-control"
          placeholder="비밀번호 입력"
          v-model="password"
        />
      </div>

      <!-- 비밀번호 찾기 -->
      <div class="forgot-password">
        <a href="#" @click.prevent="showPasswordReset = true">비밀번호를 잊으셨나요?</a>
      </div>

      <!-- 로그인 버튼 -->
      <button class="login-button" :disabled="!isFormValid" @click="login">로그인</button>

      <!-- 회원가입 링크 -->
      <div class="signup-link">
        <a href="#" @click.prevent="showRegister = true">신규 가입하기</a>
      </div>
    </div>

    <!-- 회원가입 폼 -->
    <RegisterFormComponent v-if="showRegister" @close="showRegister = false" />

    <!-- 비밀번호 찾기 폼 -->

    <PasswordResetComponent
      v-if="showPasswordReset"
      @close="showPasswordReset = false"
      @go-to-login="showPasswordReset = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, inject, provide } from 'vue'
import RegisterFormComponent from './RegisterFormComponent.vue'
import PasswordResetComponent from './PasswordResetComponent.vue'
import { useUserStore } from '@/components/store/user'
const userStore = useUserStore()
const emit = defineEmits(['close'])

// 폼 데이터
const username = ref('')
const password = ref('')
const showRegister = ref(false)
const showPasswordReset = ref(false)

// 폼 유효성 검사
const isFormValid = computed(() => {
  return username.value.trim() !== '' && password.value.trim() !== ''
})

const mainActive = inject('mainActive')
// 뒤로가기
const goBack = () => {
  mainActive.value = !mainActive.value
}

provide('showRegister', showRegister)

// 로그인 처리
const login = async () => {
  if (!isFormValid.value) return

  // 로그인 로직 구현 (API 호출 등)
  console.log('로그인 시도:', { username: username.value, password: password.value })
  try {
    await userStore.login({ username: username.value, password: password.value })
  } catch (e) {
    console.log(e)
    alert(e?.response?.data?.message)
  }
}
</script>

<style scoped>
.login-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 0 16px;
}

.login-header {
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

.login-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  color: #666;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.forgot-password {
  text-align: left;
  margin-bottom: 24px;
}

.forgot-password a {
  color: #666;
  font-size: 14px;
  text-decoration: none;
}

.login-button {
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  cursor: pointer;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 16px;
}

.signup-link a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
}
</style>
