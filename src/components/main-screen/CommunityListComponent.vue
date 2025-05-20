<template>
  <div class="community-container">
    <!-- 상단 헤더 -->
    <div class="community-header">
      <div class="location-filter">
        <button class="btn btn-outline-secondary rounded-pill">
          내 활동 <i class="bi bi-chevron-down"></i>
        </button>
        <button class="btn btn-link search-btn">
          <i class="bi bi-search"></i>
        </button>
      </div>

      <h2 class="community-title">동네글</h2>

      <div class="neighborhood-selector">
        <div class="selected-neighborhood">
          <span class="neighborhood-label">관심동네</span>
          <span class="neighborhood-name">{{ currentNeighborhood }}</span>
          <i class="bi bi-chevron-down"></i>
        </div>
      </div>

      <div class="neighborhood-display">
        {{ currentNeighborhood }}
      </div>
    </div>

    <!-- 정렬 옵션 -->
    <div class="sort-options">
      <button class="sort-button">{{ currentSort }} <i class="bi bi-chevron-down"></i></button>
    </div>

    <!-- 게시글 목록 -->
    <div class="post-list">
      <div v-for="(post, index) in posts" :key="index" class="post-item">
        <!-- 사용자 정보 -->
        <div class="user-info">
          <div class="user-profile">
            <div class="profile-image">
              <img :src="post.userImage" alt="프로필 이미지" />
            </div>
            <div class="user-details">
              <div class="username">{{ post.userName }}</div>
              <div class="user-location">
                <span class="location-tag">{{ post.userLocation }}</span>
                <span class="location-tag neighborhood-tag">관심동네</span>
                <span class="user-level">팔로워 {{ post.followerCount }}</span>
              </div>
            </div>
          </div>
          <button class="follow-button"><i class="bi bi-plus"></i> 팔로우</button>
        </div>

        <!-- 게시글 내용 -->
        <div class="post-content">
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-text">{{ post.content }}</p>
          <div class="post-meta">
            <span class="post-location">{{ post.postLocation }}</span>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 현재 선택된 동네와 정렬 옵션
const currentNeighborhood = ref('영등포구 여의도동')
const currentSort = ref('최신순')

// 게시글 데이터
const posts = ref([
  {
    userName: '임병배',
    userImage: 'https://via.placeholder.com/50/8395e6/FFFFFF/?text=임',
    userLocation: '여의도동',
    followerCount: '0',
    title: '안심공도',
    content: '경기창조고 앞 금호어울림3차 아파트 살까요?',
    postLocation: '부동산 살까? 팔까? · 영등포구 여의도동',
    time: '5시간전',
    likeCount: '1',
    commentCount: '1',
  },
  {
    userName: '임병배',
    userImage: 'https://via.placeholder.com/50/8395e6/FFFFFF/?text=임',
    userLocation: '여의도동',
    followerCount: '0',
    title: '안심공도',
    content: '경기창조고 앞 금호어울림3차 아파트 살까요?',
    postLocation: '부동산 살까? 팔까? · 영등포구 여의도동',
    time: '5시간전',
    likeCount: '1',
    commentCount: '1',
  },
  {
    userName: '김영민',
    userImage: 'https://via.placeholder.com/50/8395e6/FFFFFF/?text=임',
    userLocation: '여의도동',
    followerCount: '0',
    title: '안심공도',
    content: '경기창조고 앞 금호어울림3차 아파트 살까요?',
    postLocation: '부동산 살까? 팔까? · 영등포구 여의도동',
    time: '5시간전',
    likeCount: '1',
    commentCount: '1',
  },
  {
    userName: '김영민',
    userImage: 'https://via.placeholder.com/50/8395e6/FFFFFF/?text=임',
    userLocation: '여의도동',
    followerCount: '0',
    title: '안심공도',
    content: '경기창조고 앞 금호어울림3차 아파트 살까요?',
    postLocation: '부동산 살까? 팔까? · 영등포구 여의도동',
    time: '5시간전',
    likeCount: '1',
    commentCount: '1',
  },
])
</script>

<style scoped>
.community-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.community-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.location-filter {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.location-filter .btn-outline-secondary {
  font-size: 14px;
  border-color: #ddd;
  color: #333;
  padding: 6px 16px;
}

.search-btn {
  color: #333;
  font-size: 20px;
}

.community-title {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
}

.neighborhood-selector {
  background-color: #f0f2f5;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
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
  margin-bottom: 8px;
}

.sort-options {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.user-profile {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
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
  margin-bottom: 4px;
}

.user-location {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.location-tag {
  margin-right: 8px;
}

.neighborhood-tag {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 8px;
}

.user-level {
  color: #888;
}

.follow-button {
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.follow-button i {
  margin-right: 4px;
}

.post-content {
  margin-bottom: 16px;
}

.post-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
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
  justify-content: space-around;
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
  height: 8px;
  background-color: #f5f5f5;
  margin: 0 -16px;
}
</style>
