<template>
  <div class="post-add-container">
    <!-- 상단 헤더 -->
    <div class="post-header">
      <div class="header-left">
        <button class="back-button" @click="goBack">
          <i class="bi bi-chevron-left"></i>
        </button>
        <div class="location-dropdown">영등포구 여의도동 <i class="bi bi-chevron-down"></i></div>
      </div>
      <button class="submit-button" :disabled="!isValid" @click="submitPost">등록</button>
    </div>

    <!-- 게시글 작성 폼 -->
    <div class="post-form">
      <input
        type="text"
        class="post-title-input"
        placeholder="제목을 입력해주세요"
        v-model="postTitle"
      />

      <textarea
        class="post-content-input"
        placeholder="영등포구 여의도동 사람들과 자유롭게 이야기 해보세요."
        v-model="postContent"
      ></textarea>

      <!-- 이미지 업로드 버튼 -->
      <!-- <div class="image-upload-section">
        <button class="image-upload-button">
          <i class="bi bi-image"></i>
        </button>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['close'])

// 게시글 제목과 내용
const postTitle = ref('')
const postContent = ref('')

// 유효성 검사
const isValid = computed(() => {
  return postTitle.value.trim() !== ''
})

// 뒤로가기
const goBack = () => {
  emit('close')
}

// 게시글 등록
const submitPost = () => {
  if (!isValid.value) return

  // 게시글 데이터 생성
  const newPost = {
    title: postTitle.value,
    content: postContent.value,
    date: new Date().toISOString(),
  }

  // 여기서 게시글 등록 로직 구현 (API 호출 등)
  console.log('게시글 등록:', newPost)

  // 등록 후 목록으로 돌아가기
  emit('close')
}
</script>

<style scoped>
.post-add-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.header-left {
  display: flex;
  align-items: center;
}

.back-button {
  background: none;
  border: none;
  font-size: 20px;
  padding: 0;
  margin-right: 12px;
  color: #333;
}

.location-dropdown {
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.location-dropdown i {
  margin-left: 4px;
  font-size: 14px;
}

.submit-button {
  background: none;
  border: none;
  color: #4285f4;
  font-size: 16px;
  font-weight: 500;
}

.submit-button:disabled {
  color: #ccc;
}

.post-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  position: relative;
}

.post-title-input {
  border: none;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  padding: 12px 0;
  margin-bottom: 16px;
  outline: none;
}

.post-content-input {
  border: none;
  flex: 1;
  font-size: 16px;
  line-height: 1.6;
  resize: none;
  outline: none;
  margin-bottom: 50px; /* Space for the image upload button */
}

.post-content-input::placeholder {
  color: #999;
}

.image-upload-section {
  position: absolute;
  bottom: 16px;
  left: 16px;
}

.image-upload-button {
  background: none;
  border: none;
  color: #666;
  font-size: 24px;
  padding: 8px;
}
</style>
