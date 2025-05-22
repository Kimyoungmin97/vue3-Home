<template>
  <header class="header">
    <div class="container-fluid">
      <div
        class="header-main d-flex justify-content-between align-items-center py-2 px-3 border rounded"
      >
        <div class="d-flex align-items-center">
          <span class="brand text-primary fw-bold">KIDSHOME</span>
          <div
            class="ms-3 bg-primary text-white px-3 py-1 rounded position-relative"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            {{ currentRanking.rank }}. {{ currentRanking.location }}

            <!-- Rankings dropdown -->
            <div class="rankings-dropdown" v-if="showAllRankings">
              <div class="rankings-list">
                <div
                  v-for="(item, index) in rankings"
                  :key="index"
                  class="ranking-item"
                  :class="{ active: currentRankingIndex === index }"
                >
                  <span class="ranking-number">{{ item.rank }}.</span>
                  <span class="ranking-location">{{ item.location }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-primary" @click="completeAction">알림</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

// Props
const props = defineProps({
  location: {
    type: String,
    default: '위치 정보 없음',
  },
})

// 완료 버튼 액션
const completeAction = () => {
  alert('작업이 완료되었습니다.')
}

// 검색어 순위 데이터
const rankings = ref([
  { rank: 1, location: '더샵센트럴파크2차' },
  { rank: 2, location: '판교역 푸르지오' },
  { rank: 3, location: '광교 SK뷰' },
  { rank: 4, location: '동탄 메타폴리스' },
  { rank: 5, location: '해운대 엘시티' },
  { rank: 6, location: '송도 트리플스트리트' },
  { rank: 7, location: '강남 래미안' },
  { rank: 8, location: '용산 파크타워' },
  { rank: 9, location: '분당 서현동' },
  { rank: 10, location: '일산 백석동' },
])

// 현재 표시 중인 순위 인덱스
const currentRankingIndex = ref(0)

// 모든 순위 표시 여부
const showAllRankings = ref(false)

// 자동 순환 타이머
let cycleTimer = null

// 현재 표시 중인 순위 정보
const currentRanking = computed(() => {
  return rankings.value[currentRankingIndex.value]
})

// 마우스 진입 시 처리
const handleMouseEnter = () => {
  showAllRankings.value = true
  stopCycling()
}

// 마우스 이탈 시 처리
const handleMouseLeave = () => {
  showAllRankings.value = false
  currentRankingIndex.value = 0 // 1위로 초기화
  startCycling() // 자동 순환 다시 시작
}

// 순위 자동 순환 시작
const startCycling = () => {
  stopCycling() // 기존 타이머 정리

  cycleTimer = setInterval(() => {
    currentRankingIndex.value = (currentRankingIndex.value + 1) % rankings.value.length
  }, 3000)
}

// 순위 자동 순환 정지
const stopCycling = () => {
  if (cycleTimer) {
    clearInterval(cycleTimer)
    cycleTimer = null
  }
}

// 컴포넌트 마운트 시 자동 순환 시작
onMounted(() => {
  startCycling()
})

// 컴포넌트 언마운트 시 타이머 정리
onBeforeUnmount(() => {
  stopCycling()
})
</script>

<style scoped>
.header {
  background-color: #f8f9fa;
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.breadcrumb-container {
  font-size: 14px;
}

.brand {
  font-size: 18px;
  letter-spacing: 0.5px;
}

/* Rankings dropdown styles */
.rankings-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 5px;
  z-index: 1000;
}

.rankings-list {
  padding: 8px 0;
}

.ranking-item {
  padding: 8px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: #333;
  transition: background-color 0.2s;
}

.ranking-item:hover {
  background-color: #f5f5f5;
}

.ranking-item.active {
  background-color: #e9f5ff;
  font-weight: 500;
}

.ranking-number {
  font-weight: 600;
  margin-right: 8px;
  min-width: 20px;
}

.ranking-location {
  flex: 1;
}
</style>
