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
          @keyup.enter="searchKeyword"
        />
      </div>

      <!-- 탭 메뉴 -->
      <div class="search-tabs">
        <div class="tab" :class="{ active: activeTab === 'recent' }" @click="activeTab = 'recent'">
          최근방문
        </div>
        <div
          class="tab"
          :class="{ active: activeTab === 'address' }"
          @click="activeTab = 'address'"
        >
          주소로 찾기
        </div>
      </div>

      <div class="search-divider" />

      <!-- 콘텐츠 영역 -->
      <div class="search-body">
        <template v-if="activeTab === 'recent'">
          <h6 class="section-title">최근검색</h6>
          <p class="text-muted">최근 검색 기록이 없어요.</p>
        </template>

        <template v-else>
          <h6 class="section-title">주소로 검색 UI 여기에</h6>
          <!-- 향후: 시/군/구 드롭다운, 검색결과 리스트 등 -->
        </template>
      </div>
    </div>

    <!-- 검색 결과 표시 (전체 화면 차지) -->
    <div v-else class="property-list-container">
      <HouesListComponent
        :locationName="keyword"
        @back="showSearchResults = false"
        @select-property="selectProperty"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, inject, defineAsyncComponent } from 'vue'

const HouesListComponent = defineAsyncComponent(() => import('./HouesListComponent.vue'))

const keyword = ref('')
const activeTab = ref('recent')
const showSearchResults = ref(false)

const emit = defineEmits(['select-property'])

const mainActive = inject('mainActive')
function closePanel() {
  mainActive.value = !mainActive.value
}

// 키워드 검색 함수
function searchKeyword() {
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
