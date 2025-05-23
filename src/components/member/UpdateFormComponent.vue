<template>
  <div class="update-container">
    <!-- 헤더 -->
    <div class="update-header">
      <button class="back-button" @click="goBack">
        <i class="bi bi-chevron-left"></i>
      </button>
      <h2 class="update-title">회원정보 수정</h2>
    </div>

    <!-- 회원정보 수정 폼 -->
    <div class="update-form">
      <!-- 아이디 (수정 불가) -->
      <div class="form-group">
        <label>아이디</label>
        <input type="text" class="form-control" v-model="user.username" disabled />
        <p class="field-guide">아이디는 수정할 수 없습니다.</p>
      </div>

      <!-- 현재 비밀번호 -->
      <div class="form-group">
        <label>현재 비밀번호</label>
        <input
          type="password"
          class="form-control"
          placeholder="현재 비밀번호 입력"
          v-model="currentPassword"
        />
      </div>

      <!-- 새 비밀번호 -->
      <div class="form-group">
        <label>새 비밀번호</label>
        <input
          type="password"
          class="form-control"
          placeholder="새 비밀번호 입력 (변경 시에만 입력)"
          v-model="user.password"
        />
      </div>

      <!-- 새 비밀번호 확인 -->
      <div class="form-group">
        <label>새 비밀번호 확인</label>
        <input
          type="password"
          class="form-control"
          placeholder="새 비밀번호 확인 (변경 시에만 입력)"
          v-model="passwordConfirm"
        />
      </div>

      <!-- 이메일 입력 -->
      <div class="form-group">
        <label>이메일</label>
        <input type="email" class="form-control" placeholder="이메일 입력" v-model="user.email" />
      </div>

      <!-- 닉네임 입력 -->
      <div class="form-group">
        <label>닉네임</label>
        <div class="nickname-input-container">
          <input
            type="text"
            class="form-control"
            placeholder="닉네임 30자 이내 입력"
            v-model="user.nickname"
            maxlength="30"
          />
          <div class="nickname-counter">
            {{ nicknameLen }}/30
            <button class="clear-button" v-if="user.nickname" @click="user.nickname = ''">
              <i class="bi bi-x-circle-fill"></i>
            </button>
          </div>
        </div>
        <p class="nickname-guide">언제든지 변경 가능합니다. (한글/영문/숫자2~30자, 중복 불가)</p>
      </div>

      <!-- 거주지 입력 -->
      <div class="form-group">
        <label>거주지</label>
        <input
          type="text"
          class="form-control"
          placeholder="현재 거주하고 있는 지역을 입력해주세요"
          v-model="user.residence"
        />
        <p class="residence-guide">예: 서울시 강남구, 경기도 성남시 분당구 등</p>
      </div>

      <!-- 수정 버튼 -->
      <button class="update-button" :disabled="!isFormValid" @click="updateProfile">
        수정하기
      </button>

      <!-- 회원 탈퇴 링크 -->
      <div class="withdrawal-link">
        <a href="#" @click.prevent="confirmWithdrawal">회원 탈퇴하기</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['close'])

// 폼 데이터
const currentPassword = ref('')
const passwordConfirm = ref('')
const user = ref({
  username: 'user123', // 실제로는 로그인된 사용자 정보를 가져와야 함
  email: 'user@example.com',
  nickname: '홍길동',
  residence: '경기도 성남시 분당구',
  password: '',
})

const nicknameLen = computed(() =>
  user.value.nickname?.length > 0 ? user.value.nickname.length : 0,
)

// 폼 유효성 검사
const isFormValid = computed(() => {
  // 비밀번호 변경 시에만 새 비밀번호와 확인이 일치해야 함
  const passwordValid =
    !user.value.password || (user.value.password && user.value.password === passwordConfirm.value)

  return (
    currentPassword.value.trim() !== '' &&
    passwordValid &&
    user.value.email?.trim() !== '' &&
    user.value.nickname?.length >= 2 &&
    user.value.residence?.trim() !== ''
  )
})

// 뒤로가기
const goBack = () => {
  emit('close')
}

// 사용자 정보 로드
const loadUserData = () => {
  // 실제로는 API 호출 등을 통해 사용자 정보를 가져와야 함
  console.log('사용자 정보 로드')
}

// 회원정보 수정 처리
const updateProfile = () => {
  if (!isFormValid.value) return

  // 회원정보 수정 로직 구현 (API 호출 등)
  console.log('회원정보 수정:', {
    currentPassword: currentPassword.value,
    ...user.value,
  })

  alert('회원정보가 성공적으로 수정되었습니다.')
  emit('close')
}

// 회원 탈퇴 확인
const confirmWithdrawal = () => {
  if (confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    // 회원 탈퇴 로직 구현 (API 호출 등)
    console.log('회원 탈퇴 처리')
    alert('회원 탈퇴가 완료되었습니다.')
    emit('close')
  }
}

// 컴포넌트 마운트 시 사용자 정보 로드
onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.update-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 0 16px;
}

.update-header {
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

.update-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.update-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  overflow-y: auto;
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

.form-control:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.field-guide {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  margin-bottom: 0;
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

.nickname-guide,
.residence-guide {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  margin-bottom: 0;
}

.update-button {
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 16px;
  cursor: pointer;
}

.update-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #f0f0f0;
  color: #333;
}

.withdrawal-link {
  text-align: center;
  margin-top: 24px;
  margin-bottom: 24px;
}

.withdrawal-link a {
  color: #dc3545;
  font-size: 14px;
  text-decoration: none;
}
</style>
