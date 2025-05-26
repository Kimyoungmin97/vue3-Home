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
            <div class="author-name">{{ postInfo.name || '내집가' }}</div>
            <div class="author-location">{{ postInfo.aptNm || '영등포구 여의도동' }}</div>
          </div>
        </div>
      </div>

      <!-- 게시글 제목 및 메타 정보 -->
      <div class="post-title-section">
        <h2 class="post-title">{{ postInfo.title || '살기 좋아요' }}</h2>
        <div class="post-meta">
          <span>{{ post.time || '52분전' }}</span>
          <!-- <span class="meta-divider">·</span> -->
          <!-- <span>조회수 {{ post.views || '11' }}</span> -->
        </div>
      </div>

      <!-- 게시글 본문 -->
      <div class="post-body">
        <p>
          {{ postInfo.content || '공덕 평지에 초등학교 인접 3bay 지하 주차장 연결로 끝났습니다.' }}
        </p>
      </div>

      <!-- 게시글 액션 -->
      <div class="post-actions">
        <button class="action-button">
          <i class="bi bi-chat"></i> 댓글 {{ postInfo.comments.length || '0' }}
        </button>

        <!-- 작성자에게만 보이는 수정/삭제 -->
        <template v-if="isAuthor">
          <button class="action-button text-primary" @click="editPost">
            <i class="bi bi-pencil-square"></i> 수정
          </button>
          <button class="action-button text-danger" @click="deletePost">
            <i class="bi bi-trash"></i> 삭제
          </button>
        </template>
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

      <div class="comments-list" v-if="postInfo.comments && postInfo.comments.length > 0">
        <template v-for="(comment, index) in rootComments" :key="comment.commentId">
          <div class="comment-item" v-if="comment.commentId != 0">
            <div class="comment-author">
              <div class="comment-author-details">
                <div class="comment-author-name">{{ comment.name }}</div>
                <div class="comment-time">{{ comment.createdAt }}</div>
              </div>
            </div>
            <div class="comment-content">{{ comment.commentContent }}</div>

            <!-- 답글 버튼 -->
            <button class="reply-button" @click="toggleReplyForm(comment.commentId)">답글</button>

            <!-- 대댓글 입력창 -->
            <div v-if="replyFormVisible[comment.commentId]" class="reply-input-area">
              <input
                v-model="replyContent[comment.commentId]"
                class="form-control form-control-sm"
                placeholder="답글을 입력하세요"
              />
              <button class="btn btn-sm btn-primary mt-1" @click="submitReply(comment.commentId)">
                등록
              </button>
            </div>
          </div>

          <!-- 대댓글 렌더링 -->
          <div
            v-for="reply in getReplies(comment.commentId)"
            :key="reply.commentId"
            class="comment-item reply"
          >
            <div class="comment-author">
              <div class="comment-author-details">
                <div class="comment-author-name">{{ reply.name }}</div>
                <div class="comment-time">{{ reply.createdAt }}</div>
              </div>
            </div>
            <div class="comment-content">{{ reply.commentContent }}</div>
          </div>
        </template>
      </div>

      <!-- 댓글이 없을 때 -->
      <div class="no-comments" v-else>
        <div class="no-comments-icon">
          <i class="bi bi-hand-thumbs-up"></i>
        </div>
        <p class="no-comments-text">등록된 댓글이 없어요</p>
        <p class="no-comments-subtext">주민들과 이야기를 나눠보세요</p>
      </div>

      <!-- 새 댓글 작성 -->
      <div class="comment-input-container d-flex align-items-center gap-2">
        <input v-model="newComment" class="form-control" placeholder="댓글을 입력하세요" />
        <button class="btn btn-primary" style="width: 25%" @click="submitComment">등록</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { userApi } from '@/axios/user'
const props = defineProps({
  post: {
    type: Object,
    default: () => ({}),
  },
})

import { useUserStore } from '@/components/store/user'
const userStore = useUserStore()

// 작성자 여부 확인
const isAuthor = computed(() => {
  return userStore.loginUser.username === postInfo.value.username
})

// 수정 요청 (부모 컴포넌트가 처리)
const editPost = () => {
  emit('edit', postInfo.value)
}

// 삭제 요청
const deletePost = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    await userApi({
      url: `/api/boards/${props.post.postId}`,
      method: 'delete',
    })
    alert('삭제되었습니다.')
    emit('deleted')
    goBack()
  } catch (e) {
    console.error(e)
    alert('삭제에 실패했습니다.')
  }
}

const emit = defineEmits(['close'])

// 뒤로가기
const goBack = () => {
  emit('close')
}
const postInfo = ref({})
const postDetail = async () => {
  try {
    const response = await userApi({
      url: `/api/boards/${props.post.postId}/detail`,
      method: 'get',
    })
    postInfo.value = response.data.data
  } catch (e) {
    console.log(e)
  }
}

postDetail()

// 부모 댓글만 추출
const rootComments = computed(() => postInfo.value.comments?.filter((c) => c.depth === 0) || [])

// 특정 댓글의 대댓글 추출
const getReplies = (parentId) => {
  return postInfo.value.comments?.filter((c) => c.parentId === parentId && c.depth > 0) || []
}

// 댓글 입력 상태
const newComment = ref('')
const replyContent = ref({}) // 각 댓글 ID에 대응되는 대댓글
const replyFormVisible = ref({}) // 어떤 댓글에 입력창 보일지 여부

const toggleReplyForm = (commentId) => {
  replyFormVisible.value[commentId] = !replyFormVisible.value[commentId]
}

const submitComment = async () => {
  if (!newComment.value.trim()) return
  try {
    await userApi({
      url: `/api/boards/${props.post.postId}`,
      method: 'post',
      params: { parentId: null, content: newComment.value },
    })
    postDetail()
  } catch (e) {
    console.log(e)
  }
}

const submitReply = async (parentId) => {
  const content = replyContent.value[parentId]
  if (!content?.trim()) return

  try {
    await userApi({
      url: `/api/boards/${props.post.postId}`,
      method: 'post',
      params: { parentId: parentId, content: content },
    })
    postDetail()
  } catch (e) {
    console.log(e)
  }

  replyContent.value[parentId] = ''
  replyFormVisible.value[parentId] = false
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
.comment-item {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.comment-item.reply {
  padding-left: 24px;
  background-color: #f8f9fa;
  border-left: 3px solid #5ebaa5;
  margin-top: 4px;
  margin-bottom: 4px;
  border-radius: 4px;
}

.comment-author-name {
  font-weight: 600;
  font-size: 15px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-content {
  font-size: 14px;
  margin-top: 4px;
}

.reply-button {
  margin-top: 8px;
  font-size: 13px;
  color: #007bff;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.reply-input-area {
  margin-top: 8px;
}

.comment-input-container {
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #eee;
}
</style>
