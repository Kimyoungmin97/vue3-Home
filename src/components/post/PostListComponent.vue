<template>
  <div class="post-container">
    <div v-if="!showAddPost">
      <!-- 상단 헤더 -->
      <div class="post-header">
        <div class="header-top">
          <button class="btn btn-outline-secondary rounded-pill location-btn">
            내 활동 <i class="bi bi-chevron-down"></i>
          </button>
          <button class="btn btn-link search-btn">
            <i class="bi bi-search"></i>
          </button>
        </div>

        <h2 class="post-title">동네글</h2>
      </div>

      <!-- 동네 선택기 -->
      <div class="neighborhood-selector">
        <div class="selected-neighborhood">
          <span class="neighborhood-label">관심동네</span>
          <span class="neighborhood-name">{{ currentNeighborhood }}</span>
          <i class="bi bi-chevron-down"></i>
        </div>
      </div>

      <!-- 동네 표시 -->
      <div class="neighborhood-display">
        {{ currentNeighborhood }}
      </div>

      <!-- 정렬 옵션 -->
      <div class="sort-options">
        <button class="sort-button">{{ currentSort }} <i class="bi bi-chevron-down"></i></button>
      </div>

      <!-- 게시글 목록 -->
      <div class="post-list" v-if="!showAddPost">
        <div v-for="(post, index) in posts" :key="index" class="post-item">
          <!-- 사용자 정보 -->
          <div class="user-info">
            <div class="user-profile">
              <div class="profile-image">
                <img :src="post.userImage" alt="프로필 이미지" />
              </div>
              <div class="user-details">
                <div class="username">{{ post.userName }}</div>
                <div class="user-location">{{ post.userLocation }}</div>
              </div>
            </div>
          </div>

          <!-- 게시글 내용 -->
          <div class="post-content">
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-text">{{ post.content }}</p>
            <div class="post-meta">
              <span class="post-category">{{ post.category }} · {{ post.location }}</span>
              <span class="post-time">{{ post.time }}</span>
            </div>
          </div>

          <!-- 게시글 액션 -->
          <div class="post-actions">
            <button class="action-button">
              <i class="bi bi-hand-thumbs-up"></i> 좋아요 {{ post.likeCount }}
            </button>
            <button class="action-button">
              <i class="bi bi-chat"></i> 댓글 {{ post.commentCount }}
            </button>
          </div>

          <!-- 구분선 -->
          <div class="post-divider" v-if="index < posts.length - 1"></div>
        </div>
      </div>
      <!-- 글쓰기 버튼 (FAB) -->
      <button class="write-button" @click="showAddPost = true" v-if="!showAddPost">
        <i class="bi bi-pencil"></i>
      </button>
    </div>
    <!-- 게시글 작성 화면 -->
    <PostAddComponent v-if="showAddPost" @close="showAddPost = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PostAddComponent from './PostAddComponent.vue'

// 현재 선택된 동네와 정렬 옵션
const currentNeighborhood = ref('영등포구 여의도동')
const currentSort = ref('최신순')

// 게시글 작성 화면 표시 여부
const showAddPost = ref(false)

// 게시글 데이터
const posts = ref([
  {
    userName: '임병배',
    userImage: 'https://via.placeholder.com/50/8395e6/FFFFFF/?text=임',
    userLocation: '영등포구 여의도동',
    title: '안심공도',
    content: '경기창조고 앞 금호어울림3차 아파트 살까요?',
    category: '부동산 살까? 팔까?',
    location: '영등포구 여의도동',
    time: '5시간전',
    likeCount: '1',
    commentCount: '1',
  },
  {
    userName: '임병배',
    userImage: 'https://via.placeholder.com/50/8395e6/FFFFFF/?text=임',
    userLocation: '영등포구 여의도동',
    title: '안심공도',
    content: '경기창조고 앞 금호어울림3차 아파트 살까요?',
    category: '부동산 살까? 팔까?',
    location: '영등포구 여의도동',
    time: '5시간전',
    likeCount: '1',
    commentCount: '1',
  },
  {
    userName: '임병배',
    userImage: 'https://via.placeholder.com/50/8395e6/FFFFFF/?text=임',
    userLocation: '영등포구 여의도동',
    title: '안심공도',
    content: '경기창조고 앞 금호어울림3차 아파트 살까요?',
    category: '부동산 살까? 팔까?',
    location: '영등포구 여의도동',
    time: '5시간전',
    likeCount: '1',
    commentCount: '1',
  },
])
</script>

<style scoped>
.post-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;
}

.post-header {
  padding: 16px 16px 0 16px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.location-btn {
  font-size: 14px;
  border-color: #ddd;
  color: #333;
  padding: 6px 16px;
  background-color: #fff;
}

.search-btn {
  color: #333;
  font-size: 20px;
}

.post-title {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
}

.neighborhood-selector {
  background-color: #f0f2f5;
  padding: 12px 16px;
  margin: 0 16px;
  border-radius: 8px;
}

.selected-neighborhood {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.neighborhood-label {
  background-color: #e0e0e0;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 12px;
}

.neighborhood-name {
  font-weight: 500;
  flex: 1;
}

.neighborhood-display {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin: 12px 0;
}

.sort-options {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  display: flex;
}

.sort-button {
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
}

.sort-button i {
  margin-left: 4px;
}

.post-list {
  flex: 1;
  overflow-y: auto;
}

.post-item {
  padding: 16px;
}

.user-info {
  margin-bottom: 12px;
}

.user-profile {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  background-color: #8395e6;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  font-size: 16px;
}

.user-location {
  font-size: 14px;
  color: #666;
}

.post-content {
  margin-bottom: 16px;
}

.post-content .post-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: left;
}

.post-text {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.post-meta {
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: space-between;
}

.post-actions {
  display: flex;
  gap: 24px;
  padding: 12px 0;
}

.action-button {
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.action-button i {
  margin-right: 6px;
}

.post-divider {
  height: 1px;
  background-color: #eee;
  margin: 8px 0;
}

.write-button {
  position: sticky;
  bottom: 24px;
  /* right: 24px; */
  left: 275px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #5271ff;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.write-button i {
  font-size: 24px;
}
</style>
