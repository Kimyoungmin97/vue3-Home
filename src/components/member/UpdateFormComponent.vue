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

      <!-- 이름 -->
      <div class="form-group">
        <label>이름</label>
        <input type="text" class="form-control" placeholder="이름 입력" v-model="user.name" />
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

      <!-- 거주지 입력 -->
      <div class="form-group">
        <label>거주지</label>
        <input
          type="text"
          class="form-control"
          placeholder="현재 거주하고 있는 지역을 입력해주세요"
          v-model="user.residence"
        />
        <p class="residence-guide">예: 서울특별시 강남구 **아파트 등</p>
      </div>

      <!-- 수정 버튼 -->
      <button class="update-button" :disabled="!isFormValid" @click="updateProfile">
        수정하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { userApi } from '@/axios/user'
import { useUserStore } from '@/components/store/user'

const userStore = useUserStore()
const mainActive = inject('mainActive')

// 폼 데이터
const currentPassword = ref('')
const passwordConfirm = ref('')
const user = ref({
  username: '',
  name: '',
  email: '',
  residence: '',
  password: '',
})

// 폼 유효성 검사
const isFormValid = computed(() => {
  // 비밀번호 변경 시에만 새 비밀번호와 확인이 일치해야 함
  const passwordValid =
    !user.value.password || (user.value.password && user.value.password === passwordConfirm.value)

  return (
    currentPassword.value.trim() !== '' &&
    passwordValid &&
    user.value.name?.trim() !== '' &&
    user.value.email?.trim() !== '' &&
    user.value.residence?.trim() !== ''
  )
})

// 뒤로가기
const goBack = () => {
  mainActive.value = !mainActive.value
}

// 사용자 정보 로드
const loadUserData = async () => {
  try {
    const response = await userApi({
      url: '/api/user',
      method: 'get',
    })

    const userData = response.data.data
    user.value = {
      username: userData.username,
      name: userData.name,
      email: userData.email,
      residence: userData.residence,
      password: '',
    }
  } catch (error) {
    console.error('사용자 정보 로드 실패:', error)
    alert('사용자 정보를 불러오는데 실패했습니다.')
  }
}

// 회원정보 수정 처리
const updateProfile = async () => {
  if (!isFormValid.value) return

  try {
    const updateData = {
      username: user.value.username,
      password: user.value.password,
      name: user.value.name,
      email: user.value.email,
      residence: user.value.residence,
    }

    // 새 비밀번호가 입력된 경우에만 포함
    if (user.value.password) {
      updateData.newPassword = user.value.password
    }

    await userApi({
      url: '/api/user',
      method: 'put',
      data: updateData,
    })

    alert('회원정보가 성공적으로 수정되었습니다.')

    // 사용자 정보 다시 로드
    await loadUserData()

    // 폼 초기화
    currentPassword.value = ''
    user.value.password = ''
    passwordConfirm.value = ''
  } catch (error) {
    console.error('회원정보 수정 실패:', error)
    alert(error?.response?.data?.message || '회원정보 수정에 실패했습니다.')
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
}

.form-control:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.field-guide,
.residence-guide {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  margin-bottom: 0;
}

.update-button {
  background-color: #f0f0f0;
  color: #333;
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
}

.update-button:not(:disabled) {
  background-color: #0d6efd;
  color: white;
}
</style>
