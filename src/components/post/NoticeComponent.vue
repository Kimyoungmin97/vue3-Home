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
            <div class="notice-badge" v-if="notice.isImportant">중요</div>
            <h3 class="notice-item-title">{{ notice.title }}</h3>
            <div class="notice-meta">
              <span class="notice-date">{{ notice.date }}</span>
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
            <span class="notice-date">{{ selectedNotice.date }}</span>
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
import { ref } from 'vue'

const emit = defineEmits(['close'])

// 공지사항 목록 데이터
const notices = ref([
  {
    id: 1,
    title: '[공지] 키즈홈 서비스 업데이트 안내',
    date: '2024.05.20',
    isImportant: true,
    content: `
        <p>안녕하세요, 키즈홈 서비스를 이용해 주시는 고객님들께 감사드립니다.</p>
        <p>더 나은 서비스 제공을 위해 다음과 같이 시스템 업데이트를 진행할 예정입니다.</p>
        <br>
        <p><strong>■ 업데이트 일시</strong></p>
        <p>2024년 5월 25일(토) 02:00 ~ 06:00 (4시간)</p>
        <br>
        <p><strong>■ 업데이트 내용</strong></p>
        <p>1. 실거래가 조회 기능 개선</p>
        <p>2. 지도 서비스 성능 향상</p>
        <p>3. 커뮤니티 기능 추가</p>
        <br>
        <p>업데이트 시간 동안에는 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.</p>
        <p>더 좋은 서비스로 보답하겠습니다.</p>
        <p>감사합니다.</p>
      `,
    attachments: [{ name: '업데이트_안내문.pdf', url: '#' }],
  },
  {
    id: 2,
    title: '개인정보 처리방침 개정 안내',
    date: '2024.05.15',
    isImportant: true,
    content: `
        <p>안녕하세요, 키즈홈입니다.</p>
        <p>당사의 개인정보 처리방침이 2024년 6월 1일부로 개정될 예정임을 안내드립니다.</p>
        <br>
        <p><strong>■ 주요 변경사항</strong></p>
        <p>1. 개인정보 보유기간 변경</p>
        <p>2. 제3자 정보제공 항목 추가</p>
        <p>3. 이용자 권리 행사 방법 구체화</p>
        <br>
        <p>자세한 내용은 첨부된 문서를 참고해 주시기 바랍니다.</p>
        <p>문의사항이 있으시면 고객센터(1588-0000)로 연락주시기 바랍니다.</p>
        <p>감사합니다.</p>
      `,
    attachments: [
      { name: '개인정보처리방침_개정안.pdf', url: '#' },
      { name: '신구대조표.xlsx', url: '#' },
    ],
  },
  {
    id: 3,
    title: '키즈홈 모바일 앱 출시 안내',
    date: '2024.05.10',
    isImportant: false,
    content: `
        <p>안녕하세요, 키즈홈입니다.</p>
        <p>더욱 편리한 서비스 이용을 위해 키즈홈 모바일 앱이 출시되었습니다.</p>
        <br>
        <p><strong>■ 주요 기능</strong></p>
        <p>1. 실시간 알림 서비스</p>
        <p>2. 위치 기반 맞춤 정보 제공</p>
        <p>3. 간편 로그인 지원</p>
        <br>
        <p>앱스토어와 구글 플레이에서 '키즈홈'을 검색하여 다운로드 받으실 수 있습니다.</p>
        <p>많은 이용 부탁드립니다.</p>
      `,
    attachments: [],
  },
  {
    id: 4,
    title: '2024년 상반기 서비스 점검 일정 안내',
    date: '2024.04.28',
    isImportant: false,
    content: `
        <p>안녕하세요, 키즈홈입니다.</p>
        <p>2024년 상반기 정기 서비스 점검 일정을 안내드립니다.</p>
        <br>
        <p><strong>■ 점검 일정</strong></p>
        <p>- 5월 25일(토) 02:00 ~ 06:00</p>
        <p>- 6월 29일(토) 02:00 ~ 06:00</p>
        <br>
        <p>점검 시간 동안에는 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.</p>
        <p>더 안정적인 서비스 제공을 위해 노력하겠습니다.</p>
        <p>감사합니다.</p>
      `,
    attachments: [],
  },
  {
    id: 5,
    title: '키즈홈 서비스 이용약관 개정 안내',
    date: '2024.04.15',
    isImportant: false,
    content: `
        <p>안녕하세요, 키즈홈입니다.</p>
        <p>당사의 서비스 이용약관이 2024년 5월 1일부로 개정될 예정임을 안내드립니다.</p>
        <br>
        <p><strong>■ 주요 변경사항</strong></p>
        <p>1. 서비스 이용 조건 변경</p>
        <p>2. 회원 의무사항 추가</p>
        <p>3. 게시물 관리 정책 구체화</p>
        <br>
        <p>자세한 내용은 첨부된 문서를 참고해 주시기 바랍니다.</p>
        <p>문의사항이 있으시면 고객센터(1588-0000)로 연락주시기 바랍니다.</p>
        <p>감사합니다.</p>
      `,
    attachments: [{ name: '이용약관_개정안.pdf', url: '#' }],
  },
])

// 공지사항 상세 표시 여부
const showNoticeDetail = ref(false)
const selectedNotice = ref(null)

// 뒤로가기
const goBack = () => {
  emit('close')
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
