<template>
  <div class="search-panel-container">
    <!-- 검색 결과가 없을 때만 표시 -->
    <div v-if="!showSearchResults">
      <!-- 상단: 뒤로가기 + 검색창 -->
      <div class="search-header">
        <i class="bi bi-arrow-left" @click="closePanel" />
        <input
          v-model="keyword"
          type="text"
          placeholder="단지, 지역, 지하철, 학교 검색"
          class="form-control"
          @keyup.enter="firstSearch"
        />
      </div>

      <!-- 탭 메뉴 -->
      <div class="search-tabs">
        <div class="tab" :class="{ active: activeTab === 'recent' }" @click="activeTab = 'recent'">
          최근방문
        </div>
      </div>

      <div class="search-divider" />

      <!-- 콘텐츠 영역 -->
      <div class="search-body">
        <template v-if="activeTab === 'recent'">
          <h6 class="section-title">최근검색</h6>
          <p class="text-muted">최근 검색 기록이 없어요.</p>
        </template>
      </div>
    </div>

    <!-- 검색 결과 표시 (전체 화면 차지) -->
    <div v-else class="property-list-container">
      <HouesListComponent
        :locationName="keyword"
        @back="handleBack"
        @select-property="selectProperty"
        :houseList="houseList"
        :onScrollEnd="searchKeyword"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, inject, defineAsyncComponent, watch } from 'vue'
import { houseApi } from '@/axios/house'
import { useCommonStore } from '../store/common'
const commonStore = useCommonStore()
const HouesListComponent = defineAsyncComponent(() => import('./HouesListComponent.vue'))

const keyword = ref('')
const lastAptSeq = ref('')
const activeTab = ref('recent')
const showSearchResults = ref(false)

const emit = defineEmits(['select-property'])

const mainActive = inject('mainActive')
function closePanel() {
  mainActive.value = !mainActive.value
}

// Handle back button from property list
function handleBack() {
  showSearchResults.value = false
  // Reset the selected property to close the detail component
  emit('select-property', null)
}

const houseList = ref([])

const isLoading = ref(false)

const firstSearch = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const response = await houseApi({
      url: '/search',
      method: 'get',
      params: { keyword: keyword.value, lastAptSeq: lastAptSeq.value, size: 10 },
    })
    houseList.value = response.data.data
    lastAptSeq.value = houseList.value.at(-1)?.aptSeq ?? null
    commonStore.rankingRefresh()
  } finally {
    isLoading.value = false
  }
  if (keyword.value.trim()) {
    showSearchResults.value = true
  }
}

const searchKeyword = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const response = await houseApi({
      url: '/search',
      method: 'get',
      params: { keyword: keyword.value, lastAptSeq: lastAptSeq.value, size: 10 },
    })
    houseList.value.push(...response.data.data)
    lastAptSeq.value = houseList.value.at(-1)?.aptSeq ?? null
    commonStore.rankingRefresh()
  } finally {
    isLoading.value = false
  }
  if (keyword.value.trim()) {
    showSearchResults.value = true
  }
}

// 매물 선택 함수
function selectProperty(property) {
  emit('select-property', property)
}
</script>

<style scoped>
.search-panel-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 16px 16px 0 16px;
}

.search-header i {
  font-size: 20px;
  cursor: pointer;
}

.search-header input {
  flex: 1;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
}

.search-tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 12px;
  padding: 0 16px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  font-weight: 500;
  color: #555;
}

.tab.active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
}

.search-divider {
  border-bottom: 1px solid #eee;
}

.search-body {
  flex: 1;
  overflow-y: auto;
  font-size: 14px;
  color: #333;
  padding: 16px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.property-list-container {
  height: 100%;
  width: 100%;
}
</style>
