<template>
  <div class="register-container">
    <!-- 헤더 -->
    <div class="register-header">
      <button class="back-button" @click="goBack">
        <i class="bi bi-chevron-left"></i>
      </button>
      <h2 class="register-title">회원가입</h2>
    </div>

    <!-- 회원가입 폼 -->
    <div class="register-form">
      <!-- 이메일 입력 -->
      <div class="form-group">
        <label>이메일</label>
        <input type="email" class="form-control" placeholder="이메일 입력" v-model="email" />
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

      <!-- 비밀번호 확인 -->
      <div class="form-group">
        <label>비밀번호 확인</label>
        <input
          type="password"
          class="form-control"
          placeholder="비밀번호 입력"
          v-model="passwordConfirm"
        />
      </div>

      <!-- 닉네임 입력 -->
      <div class="form-group">
        <label>닉네임</label>
        <div class="nickname-input-container">
          <input
            type="text"
            class="form-control"
            placeholder="닉네임 30자 이내 입력"
            v-model="nickname"
            maxlength="30"
          />
          <div class="nickname-counter">
            {{ nickname.length }}/30
            <button class="clear-button" v-if="nickname" @click="nickname = ''">
              <i class="bi bi-x-circle-fill"></i>
            </button>
          </div>
        </div>
        <p class="nickname-guide">언제든지 변경 가능합니다. (한글/영문/숫자2~30자, 중복 불가)</p>
      </div>

      <!-- 회원가입 버튼 -->
      <button class="register-button" :disabled="!isFormValid" @click="register">회원가입</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const emit = defineEmits(['close'])

// 폼 데이터
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const nickname = ref('')

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    email.value.trim() !== '' &&
    password.value.trim() !== '' &&
    password.value === passwordConfirm.value &&
    nickname.value.length >= 2
  )
})

const showRegister = inject('showRegister')
// 뒤로가기
const goBack = () => {
  showRegister.value = !showRegister.value
}

// 회원가입 처리
const register = () => {
  if (!isFormValid.value) return

  // 회원가입 로직 구현 (API 호출 등)
  console.log('회원가입 시도:', {
    email: email.value,
    password: password.value,
    nickname: nickname.value,
  })

  // 회원가입 성공 후 처리
  // ...

  // 로그인 화면으로 돌아가기
  //   emit('close')
  showRegister.value = !showRegister.value
}
</script>

<style scoped>
.register-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 0 16px;
}

.register-header {
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

.register-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.register-form {
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
  background-color: #f5f5f5;
}

.nickname-input-container {
  position: relative;
}

.nickname-counter {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #999;
  display: flex;
  align-items: center;
}

.clear-button {
  background: none;
  border: none;
  padding: 0;
  margin-left: 8px;
  color: #999;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nickname-guide {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  margin-bottom: 0;
}

.register-button {
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
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
