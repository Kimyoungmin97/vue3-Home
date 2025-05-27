<template>
  <div class="notice-container">
    <!-- 상단 헤더 -->
    <div class="notice-header">
      <div class="header-top">
        <button class="back-button" @click="goBack">
          <i class="bi bi-chevron-left"></i>
        </button>
        <h2 class="notice-title">공지사항</h2>
        <div class="header-right"></div>
      </div>
    </div>

    <!-- 공지사항 목록 -->
    <div class="notice-list">
      <div v-if="notices.length > 0">
        <div
          v-for="(notice, index) in notices"
          :key="index"
          class="notice-item"
          @click="selectNotice(notice)"
        >
          <div class="notice-content">
            <div class="notice-badge" v-if="notice.important">중요</div>
            <h3 class="notice-item-title">{{ notice.title }}</h3>
            <div class="notice-meta">
              <span class="notice-date">{{ notice.createdAt }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-notices">
        <div class="no-notices-icon">
          <i class="bi bi-exclamation-circle"></i>
        </div>
        <p class="no-notices-text">등록된 공지사항이 없습니다.</p>
      </div>
    </div>

    <!-- 공지사항 상세 모달 -->
    <div class="notice-detail-modal" v-if="showNoticeDetail">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedNotice.title }}</h3>
          <button class="close-button" @click="closeNoticeDetail">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="notice-info">
            <span class="notice-date">{{ selectedNotice.createdAt }}</span>
          </div>
          <div class="notice-detail-content" v-html="selectedNotice.content"></div>

          <div
            class="notice-attachments"
            v-if="selectedNotice.attachments && selectedNotice.attachments.length > 0"
          >
            <h4>첨부파일</h4>
            <div
              v-for="(attachment, index) in selectedNotice.attachments"
              :key="index"
              class="attachment-item"
            >
              <i class="bi bi-file-earmark"></i>
              <span>{{ attachment.name }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeNoticeDetail">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { userApiNoAuth } from '@/axios/user'

const emit = defineEmits(['close'])

const notices = ref([]) // 빈 공지사항 배열

// 공지사항 목록 API 호출 함수
const getNotices = async () => {
  try {
    const response = await userApiNoAuth({
      url: `/api/notices`,
      method: 'get',
    })
    notices.value = response.data.data
  } catch (e) {
    console.log('공지사항 불러오기 실패: ', e)
  }
}

// onMounted 에서 공지사항 불러오기
onMounted(() => getNotices())

// 공지사항 상세 표시 여부
const showNoticeDetail = ref(false)
const selectedNotice = ref(null)

// 뒤로가기
const mainActive = inject('mainActive')
// 뒤로가기
const goBack = () => {
  mainActive.value = !mainActive.value
}

// 공지사항 선택
const selectNotice = (notice) => {
  selectedNotice.value = notice
  showNoticeDetail.value = true
}

// 공지사항 상세 닫기
const closeNoticeDetail = () => {
  showNoticeDetail.value = false
}
</script>

<style scoped>
.notice-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;
}

.notice-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  background: none;
  border: none;
  font-size: 20px;
  padding: 0;
  color: #333;
}

.notice-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
}

.header-right {
  width: 20px; /* 균형을 맞추기 위한 빈 공간 */
}

.notice-list {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.notice-item {
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.notice-item:hover {
  background-color: #f8f9fa;
}

.notice-content {
  position: relative;
}

.notice-badge {
  display: inline-block;
  background-color: #dc3545;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.notice-item-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.notice-meta {
  font-size: 14px;
  color: #666;
}

.notice-date {
  color: #666;
}

.no-notices {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

.no-notices-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ddd;
}

.no-notices-text {
  font-size: 16px;
}

/* 모달 스타일 */
.notice-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.notice-info {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.notice-detail-content {
  font-size: 15px;
  line-height: 1.6;
}

.notice-attachments {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.notice-attachments h4 {
  font-size: 16px;
  margin-bottom: 12px;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  color: #0d6efd;
  cursor: pointer;
}

.attachment-item i {
  margin-right: 8px;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}
</style>
