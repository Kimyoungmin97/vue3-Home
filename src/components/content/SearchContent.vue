<template>
  <div class="search-content">
    <div class="search-box mb-3">
      <div class="input-group">
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="상가명 검색"
          v-model="searchQuery"
        />
        <button class="btn btn-sm btn-primary" @click="search">검색</button>
      </div>
    </div>

    <div class="search-filters mb-3">
      <div class="btn-group w-100">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="[
            'btn btn-sm',
            activeCategory === category.id ? 'btn-primary' : 'btn-outline-primary',
          ]"
          @click="activeCategory = category.id"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <div class="search-results">
      <div v-if="filteredResults.length > 0">
        <div
          v-for="(result, index) in filteredResults"
          :key="index"
          class="search-result-item"
          @click="selectStore(result)"
        >
          <div class="store-name">{{ result.name }}</div>
          <div class="store-info">{{ result.category }} | {{ result.distance }}</div>
        </div>
      </div>
      <div v-else class="no-results">검색 결과가 없습니다.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  content: {
    type: Object,
    default: () => ({}),
  },
})

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = ref([
  { id: 'all', name: '전체' },
  { id: 'food', name: '음식점' },
  { id: 'cafe', name: '카페' },
  { id: 'retail', name: '소매점' },
])

const searchResults = ref([
  {
    name: '스타벅스 판교점',
    category: '카페',
    distance: '100m',
    type: 'cafe',
    position: { lat: 37.4025, lng: 127.11 },
  },
  {
    name: '맥도날드 판교DT',
    category: '음식점',
    distance: '150m',
    type: 'food',
    position: { lat: 37.403, lng: 127.109 },
  },
  {
    name: 'GS25 판교테크노점',
    category: '소매점',
    distance: '200m',
    type: 'retail',
    position: { lat: 37.4018, lng: 127.1085 },
  },
  {
    name: '투썸플레이스 판교역점',
    category: '카페',
    distance: '250m',
    type: 'cafe',
    position: { lat: 37.4022, lng: 127.1105 },
  },
  {
    name: '올리브영 판교점',
    category: '소매점',
    distance: '300m',
    type: 'retail',
    position: { lat: 37.4015, lng: 127.1075 },
  },
])

const filteredResults = computed(() => {
  return searchResults.value.filter((result) => {
    const matchesQuery =
      searchQuery.value === '' ||
      result.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = activeCategory.value === 'all' || result.type === activeCategory.value

    return matchesQuery && matchesCategory
  })
})

const search = () => {
  // 실제로는 카카오맵 API를 사용한 검색 로직이 들어갈 수 있음
  console.log('검색어:', searchQuery.value)
}

const selectStore = (store) => {
  if (window.kakao && window.kakao.maps) {
    // 지도 객체 가져오기
    const mapContainer = document.getElementById('kakao-map')
    if (!mapContainer) return

    const map = mapContainer.__kakao_map
    if (!map) return

    // 선택한 상가의 위치로 지도 이동
    const position = new window.kakao.maps.LatLng(store.position.lat, store.position.lng)
    map.setCenter(position)

    // 줌 레벨 조정
    map.setLevel(2)

    // 상가 정보 알림
    alert(`${store.name}을(를) 선택했습니다.`)
  }
}
</script>

<style scoped>
.search-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-results {
  flex: 1;
  overflow-y: auto;
}

.search-result-item {
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.search-result-item:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.store-name {
  font-weight: 500;
  font-size: 14px;
}

.store-info {
  font-size: 12px;
  color: #6c757d;
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #6c757d;
}
</style>
