<template>
  <div class="property-list-container">
    <!-- 상단 헤더 -->
    <div class="result-header">
      <div class="d-flex align-items-center">
        <i class="bi bi-arrow-left me-3" @click="goBack"></i>
        <h5 class="mb-0">{{ locationName }}</h5>
      </div>
    </div>

    <!-- 검색 결과 요약 -->
    <div class="result-summary">
      <div class="d-flex justify-content-between align-items-center">
        <div class="result-count">총 {{ properties.length }}개의 매물이 있어요</div>
        <div class="result-sort" @click="toggleSortOptions">
          {{ currentSort }} <i class="bi bi-chevron-down"></i>
        </div>
      </div>
    </div>

    <!-- 정렬 옵션 (토글) -->
    <div class="sort-options" v-if="showSortOptions">
      <div
        v-for="option in sortOptions"
        :key="option.value"
        class="sort-option"
        :class="{ active: currentSort === option.label }"
        @click="selectSortOption(option)"
      >
        {{ option.label }}
      </div>
    </div>

    <!-- 매물 목록 -->
    <div class="property-list" ref="listContainer">
      <div
        v-for="(property, index) in properties"
        :key="index"
        class="property-card"
        @click="selectProperty(property)"
      >
        <div class="property-info">
          <div class="property-name">{{ property.aptNm }}</div>
          <div class="property-price">
            거래가 <span>{{ property.price }}</span> 만원
          </div>
          <!-- <div class="property-details">{{ property.floor }}층 전용면적 {{ property.area }} m²</div> -->
          <div class="property-address">
            <i class="bi bi-geo-alt-fill text-danger"></i> {{ property.address }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'

const props = defineProps({
  locationName: {
    type: String,
    default: '영등포구 여의도동',
  },
  houseList: {
    type: Array,
    default: () => [],
  },
  onScrollEnd: {
    type: Function,
    default: null,
  },
})

const emit = defineEmits(['back', 'select-property'])

// 정렬 옵션
const sortOptions = [
  { label: '기본순', value: 'latest' },
  { label: '가격 낮은순', value: 'price_asc' },
  { label: '가격 높은순', value: 'price_desc' },
]

const currentSort = ref('기본순')
const currentSortVal = ref('latest')
const showSortOptions = ref(false)

// 뒤로가기
const goBack = () => {
  emit('back')
}

// 정렬 옵션 토글
const toggleSortOptions = () => {
  showSortOptions.value = !showSortOptions.value
}

// 정렬 옵션 선택
const selectSortOption = (option) => {
  currentSort.value = option.label
  currentSortVal.value = option.value
  showSortOptions.value = false
}
// 더미 매물 데이터 리스트
const properties = computed(() => {
  const copied = [...props.houseList] // 원본은 건드리지 않음
  if (currentSortVal.value == 'price_asc') {
    return copied.sort(
      (a, b) => Number(a.price.replace(/,/g, '')) - Number(b.price.replace(/,/g, '')),
    )
  } else if (currentSortVal.value == 'price_desc') {
    return copied.sort(
      (a, b) => Number(b.price.replace(/,/g, '')) - Number(a.price.replace(/,/g, '')),
    )
  } else {
    return copied
  }
})

// 매물 선택
const selectProperty = (property) => {
  // 부모 컴포넌트로 선택된 매물 정보 전달
  emit('select-property', property)
}

const listContainer = useTemplateRef('listContainer')

function handleScroll() {
  const el = listContainer.value
  if (!el || typeof props.onScrollEnd !== 'function') return

  const scrollBottom = el.scrollTop + el.clientHeight
  const scrollHeight = el.scrollHeight

  if (scrollBottom >= scrollHeight - 10) {
    props.onScrollEnd()
  }
}

onMounted(() => {
  listContainer.value?.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  listContainer.value?.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.property-list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.result-header {
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #eee;
}

.result-header h5 {
  font-size: 18px;
  font-weight: 500;
}

.result-header i {
  font-size: 20px;
  cursor: pointer;
}

.result-summary {
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.result-count {
  font-size: 14px;
  font-weight: 500;
}

.result-sort {
  font-size: 14px;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.sort-options {
  background-color: white;
  border-bottom: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 120px;
  right: 16px;
  z-index: 100;
  border-radius: 4px;
  overflow: hidden;
}

.sort-option {
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
}

.sort-option:hover {
  background-color: #f5f5f5;
}

.sort-option.active {
  color: #007bff;
  font-weight: 500;
}

.property-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.property-card {
  display: flex;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.property-info {
  flex: 1;
  padding-right: 12px;
}

.property-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.property-price {
  font-size: 16px;
  margin-bottom: 6px;
}

.property-price span {
  font-weight: 600;
}

.property-details {
  font-size: 14px;
  color: #555;
  margin-bottom: 6px;
}

.property-address {
  font-size: 13px;
  color: #777;
  display: flex;
  align-items: center;
}

.property-address i {
  margin-right: 4px;
  font-size: 14px;
}

.property-image {
  width: 120px;
  height: 100px;
  overflow: hidden;
  border-radius: 4px;
}

.property-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
