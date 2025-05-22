<template>
  <div class="post-detail-container">
    <!-- 헤더 -->
    <div class="post-detail-header">
      <button class="back-button" @click="goBack">
        <i class="bi bi-chevron-left"></i>
      </button>
    </div>

    <!-- 게시글 내용 -->
    <div class="post-detail-content">
      <!-- 작성자 정보 -->
      <div class="author-info">
        <div class="author-profile">
          <div class="profile-image">
            <img
              :src="post.userImage || 'https://via.placeholder.com/50/5ebaa5/FFFFFF/?text=내'"
              alt="프로필 이미지"
            />
          </div>
          <div class="author-details">
            <div class="author-name">{{ post.userName || '내집가' }}</div>
            <div class="author-location">{{ post.userLocation || '영등포구 여의도동' }}</div>
          </div>
        </div>
      </div>

      <!-- 게시글 제목 및 메타 정보 -->
      <div class="post-title-section">
        <h2 class="post-title">{{ post.title || '살기 좋아요' }}</h2>
        <div class="post-meta">
          <span>{{ post.time || '52분전' }}</span>
          <span class="meta-divider">·</span>
          <span>조회수 {{ post.views || '11' }}</span>
        </div>
      </div>

      <!-- 게시글 본문 -->
      <div class="post-body">
        <p>{{ post.content || '공덕 평지에 초등학교 인접 3bay 지하 주차장 연결로 끝났습니다.' }}</p>
      </div>

      <!-- 게시글 액션 -->
      <div class="post-actions">
        <button class="action-button">
          <i class="bi bi-hand-thumbs-up"></i> 좋아요 {{ post.likeCount || '1' }}
        </button>
        <button class="action-button">
          <i class="bi bi-chat"></i> 댓글 {{ post.commentCount || '0' }}
        </button>
      </div>
    </div>

    <!-- 댓글 섹션 -->
    <div class="comments-section">
      <!-- 댓글 정렬 옵션 -->
      <div class="comment-sort-options">
        <button class="sort-option active">등록순</button>
        <span class="sort-divider">|</span>
        <button class="sort-option">최신순</button>
      </div>

      <!-- 댓글 목록 -->
      <div class="comments-list" v-if="post.comments && post.comments.length > 0">
        <div class="comment-item" v-for="(comment, index) in post.comments" :key="index">
          <div class="comment-author">
            <div class="comment-profile-image">
              <img :src="comment.userImage" alt="프로필 이미지" />
            </div>
            <div class="comment-author-details">
              <div class="comment-author-name">{{ comment.userName }}</div>
              <div class="comment-time">{{ comment.time }}</div>
            </div>
          </div>
          <div class="comment-content">
            {{ comment.content }}
          </div>
        </div>
      </div>

      <!-- 댓글이 없을 때 -->
      <div class="no-comments" v-else>
        <div class="no-comments-icon">
          <i class="bi bi-hand-thumbs-up"></i>
        </div>
        <p class="no-comments-text">등록된 댓글이 없어요</p>
        <p class="no-comments-subtext">주민들과 이야기를 나눠보세요</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close'])

// 뒤로가기
const goBack = () => {
  emit('close')
}
</script>

<style scoped>
.post-detail-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.post-detail-header {
  padding: 16px;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-button {
  background: none;
  border: none;
  font-size: 20px;
  padding: 0;
  color: #333;
}

.post-detail-content {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 8px;
}

.author-info {
  margin-bottom: 16px;
}

.author-profile {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  background-color: #5ebaa5;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  font-size: 16px;
}

.author-location {
  font-size: 14px;
  color: #666;
}

.post-title-section {
  margin-bottom: 16px;
}

.post-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.post-meta {
  font-size: 14px;
  color: #666;
}

.meta-divider {
  margin: 0 6px;
}

.post-body {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.post-actions {
  display: flex;
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.action-button {
  flex: 1;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  color: #666;
  font-size: 14px;
}

.action-button i {
  margin-right: 6px;
  font-size: 16px;
}

.comments-section {
  background-color: #fff;
  padding: 16px;
  flex: 1;
}

.comment-sort-options {
  display: flex;
  margin-bottom: 16px;
  font-size: 14px;
}

.sort-option {
  background: none;
  border: none;
  padding: 0;
  color: #666;
}

.sort-option.active {
  color: #333;
  font-weight: 500;
}

.sort-divider {
  margin: 0 8px;
  color: #ddd;
}

.no-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  color: #999;
}

.no-comments-icon {
  width: 60px;
  height: 60px;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.no-comments-icon i {
  font-size: 24px;
  color: #ccc;
}

.no-comments-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.no-comments-subtext {
  font-size: 14px;
}

.ad-banner {
  background-color: #fff;
  padding: 16px;
  margin-top: 8px;
  border-top: 1px solid #eee;
  font-size: 14px;
  font-weight: 500;
}
</style>
