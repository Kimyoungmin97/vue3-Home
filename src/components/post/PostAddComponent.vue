<template>
  <div class="post-add-container">
    <!-- 상단 헤더 -->
    <div class="post-header">
      <div class="header-left">
        <button class="back-button" @click="goBack">
          <i class="bi bi-chevron-left"></i>
        </button>
        <div class="location-dropdown">
          {{ userStore.loginUser.residence }} <i class="bi bi-chevron-down"></i>
        </div>
      </div>
      <button class="submit-button" :disabled="!isValid" @click="submitPost">
        {{ isEditMode ? '수정' : '등록' }}
      </button>
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
import { userApi } from '@/axios/user'
import { useUserStore } from '@/components/store/user'
// 현재 선택된 동네와 정렬 옵션
const userStore = useUserStore()
const emit = defineEmits(['close'])

const props = defineProps({
  addSearch: {
    type: Function,
    default: null,
  },
  editPost: {
    type: Object,
    default: null,
  },
})

// 게시글 제목과 내용
const postTitle = ref(props.editPost?.title || '')
const postContent = ref(props.editPost?.content || '')
const isSecret = ref(0)

const isEditMode = computed(() => !!props.editPost)

// 유효성 검사
const isValid = computed(() => {
  return postTitle.value.trim() !== ''
})

// 뒤로가기
const goBack = () => {
  emit('close')
}

// 게시글 등록
const submitPost = async () => {
  if (!isValid.value) return
  console.log({
    title: postTitle.value,
    content: postContent.value,
    isSecret: isSecret.value,
    aptSeq: userStore.loginUser.aptSeq,
  })
  if (isEditMode.value) {
    await userApi({
      url: `/api/boards/${props.editPost.postId}`,
      method: 'put',
      data: {
        title: postTitle.value,
        content: postContent.value,
        isSecret: isSecret.value,
        aptSeq: userStore.loginUser.aptSeq,
      },
    })
  } else {
    await userApi({
      url: '/api/boards',
      method: 'post',
      data: {
        title: postTitle.value,
        content: postContent.value,
        isSecret: isSecret.value,
        aptSeq: userStore.loginUser.aptSeq,
      },
    })
  }

  props.addSearch()
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
