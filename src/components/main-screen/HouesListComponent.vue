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
    <div class="property-list">
      <div
        v-for="(property, index) in properties"
        :key="index"
        class="property-card"
        @click="selectProperty(property)"
      >
        <div class="property-info">
          <div class="property-name">{{ property.name }}</div>
          <div class="property-price">
            거래가 <span>{{ property.price }}</span> 만원
          </div>
          <div class="property-details">{{ property.floor }}층 전용면적 {{ property.area }} m²</div>
          <div class="property-address">
            <i class="bi bi-geo-alt-fill text-danger"></i> {{ property.address }}
          </div>
        </div>
        <div class="property-image">
          <img :src="property.image" alt="매물 이미지" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  locationName: {
    type: String,
    default: '영등포구 여의도동',
  },
})

const emit = defineEmits(['back', 'select-property'])

// 정렬 옵션
const sortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '가격 낮은순', value: 'price_asc' },
  { label: '가격 높은순', value: 'price_desc' },
  { label: '면적 넓은순', value: 'area_desc' },
  { label: '면적 좁은순', value: 'area_asc' },
]

const currentSort = ref('최신순')
const showSortOptions = ref(false)

// 더미 매물 데이터 (상세 정보 추가)
const properties = ref([
  {
    id: 1,
    name: '무악현대아파트',
    price: '35,980',
    floor: '17',
    area: '60.00',
    address: '서울특별시 종로구 무악동 82',
    image: 'https://via.placeholder.com/150x100?text=Apartment',
    // 상세 정보
    likes: 105,
    views: 105,
    priceHistory: {
      average: '24억 5,000',
      marketAverage: '26억 7,500',
      history: [
        { date: '24.05.31', area: '160A/16', price: '24억 5,000', floor: '13층' },
        { date: '24.01.02', area: '160A/16', price: '20억 4,000', floor: '2동/5층' },
        { date: '20.11.16', area: '160A/16', price: '15억 7,500', floor: '15층' },
      ],
    },
    transport: {
      subway: [
        { line: '경강', name: '판교역', distance: '155m', time: '2분', color: 'blue' },
        { line: '신분당', name: '판교역', distance: '221m', time: '3분', color: 'red' },
        { line: '경강', name: '성남역', distance: '532m', time: '8분', color: 'blue' },
        { line: 'GTX-A', name: '성남역', distance: '626m', time: '9분', color: 'black' },
      ],
      bus: {
        types: [{ name: '광역', color: 'orange' }],
        lines: ['9401-1', '9401'],
      },
      commute: {
        options: [
          { destination: '판교', time: '10분' },
          { destination: '강남', time: '25분' },
        ],
      },
    },
    facilities: {
      kindergartens: [
        { name: '푸르니판교어린이집', type: '직장', distance: '126m', status: '가장 가까움' },
        { name: '크래프톤 어린이집', type: '직장', distance: '181m' },
        { name: '화랑어린이집', type: '가정', distance: '218m' },
      ],
    },
  },
  {
    id: 2,
    name: '래미안 퍼스티지',
    price: '42,500',
    floor: '15',
    area: '84.00',
    address: '서울특별시 서초구 반포동 23',
    image: 'https://via.placeholder.com/150x100?text=Apartment2',
    // 상세 정보
    likes: 87,
    views: 203,
    priceHistory: {
      average: '42억 5,000',
      marketAverage: '45억 2,000',
      history: [
        { date: '24.04.15', area: '84A/16', price: '42억 5,000', floor: '15층' },
        { date: '23.11.20', area: '84A/16', price: '39억 8,000', floor: '1동/8층' },
        { date: '22.08.05', area: '84A/16', price: '35억 2,000', floor: '12층' },
      ],
    },
    transport: {
      subway: [
        { line: '9호선', name: '신반포역', distance: '210m', time: '3분', color: 'brown' },
        { line: '7호선', name: '반포역', distance: '450m', time: '7분', color: 'green' },
        { line: '3호선', name: '고속터미널역', distance: '820m', time: '12분', color: 'orange' },
      ],
      bus: {
        types: [
          { name: '간선', color: 'blue' },
          { name: '지선', color: 'green' },
        ],
        lines: ['142', '740', '3414'],
      },
      commute: {
        options: [
          { destination: '강남', time: '15분' },
          { destination: '여의도', time: '20분' },
        ],
      },
    },
    facilities: {
      kindergartens: [
        { name: '반포 어린이집', type: '국공립', distance: '150m', status: '가장 가까움' },
        { name: '서초 어린이집', type: '민간', distance: '320m' },
        { name: '래미안 어린이집', type: '직장', distance: '50m' },
      ],
    },
  },
  {
    id: 3,
    name: '자이 더 익스프레스',
    price: '28,500',
    floor: '10',
    area: '59.00',
    address: '경기도 성남시 분당구 정자동 45',
    image: 'https://via.placeholder.com/150x100?text=Apartment3',
    // 상세 정보
    likes: 65,
    views: 142,
    priceHistory: {
      average: '28억 5,000',
      marketAverage: '29억 2,000',
      history: [
        { date: '24.03.10', area: '59B/16', price: '28억 5,000', floor: '10층' },
        { date: '23.09.25', area: '59B/16', price: '26억 7,000', floor: '3동/7층' },
        { date: '22.05.18', area: '59B/16', price: '24억 3,000', floor: '9층' },
      ],
    },
    transport: {
      subway: [
        { line: '분당선', name: '정자역', distance: '320m', time: '5분', color: 'yellow' },
        { line: '신분당선', name: '정자역', distance: '350m', time: '6분', color: 'red' },
      ],
      bus: {
        types: [
          { name: '일반', color: 'green' },
          { name: '직행', color: 'red' },
        ],
        lines: ['33', '330', '1005'],
      },
      commute: {
        options: [
          { destination: '판교', time: '10분' },
          { destination: '강남', time: '25분' },
        ],
      },
    },
    facilities: {
      kindergartens: [
        { name: '정자 어린이집', type: '국공립', distance: '200m', status: '가장 가까움' },
        { name: '분당 어린이집', type: '민간', distance: '350m' },
        { name: '자이 어린이집', type: '직장', distance: '100m' },
      ],
    },
  },
  {
    id: 4,
    name: '무악현대아파트',
    price: '35,980',
    floor: '17',
    area: '60.00',
    address: '서울특별시 종로구 무악동 82',
    image: 'https://via.placeholder.com/150x100?text=Apartment',
    // 상세 정보 (기본 데이터와 동일)
    likes: 105,
    views: 105,
    priceHistory: {
      average: '24억 5,000',
      marketAverage: '26억 7,500',
      history: [
        { date: '24.05.31', area: '160A/16', price: '24억 5,000', floor: '13층' },
        { date: '24.01.02', area: '160A/16', price: '20억 4,000', floor: '2동/5층' },
        { date: '20.11.16', area: '160A/16', price: '15억 7,500', floor: '15층' },
      ],
    },
    transport: {
      subway: [
        { line: '경강', name: '판교역', distance: '155m', time: '2분', color: 'blue' },
        { line: '신분당', name: '판교역', distance: '221m', time: '3분', color: 'red' },
        { line: '경강', name: '성남역', distance: '532m', time: '8분', color: 'blue' },
        { line: 'GTX-A', name: '성남역', distance: '626m', time: '9분', color: 'black' },
      ],
      bus: {
        types: [{ name: '광역', color: 'orange' }],
        lines: ['9401-1', '9401'],
      },
      commute: {
        options: [
          { destination: '판교', time: '10분' },
          { destination: '강남', time: '25분' },
        ],
      },
    },
    facilities: {
      kindergartens: [
        { name: '푸르니판교어린이집', type: '직장', distance: '126m', status: '가장 가까움' },
        { name: '크래프톤 어린이집', type: '직장', distance: '181m' },
        { name: '화랑어린이집', type: '가정', distance: '218m' },
      ],
    },
  },
  {
    id: 5,
    name: '무악현대아파트',
    price: '35,980',
    floor: '17',
    area: '60.00',
    address: '서울특별시 종로구 무악동 82',
    image: 'https://via.placeholder.com/150x100?text=Apartment',
    // 상세 정보 (기본 데이터와 동일)
    likes: 105,
    views: 105,
    priceHistory: {
      average: '24억 5,000',
      marketAverage: '26억 7,500',
      history: [
        { date: '24.05.31', area: '160A/16', price: '24억 5,000', floor: '13층' },
        { date: '24.01.02', area: '160A/16', price: '20억 4,000', floor: '2동/5층' },
        { date: '20.11.16', area: '160A/16', price: '15억 7,500', floor: '15층' },
      ],
    },
    transport: {
      subway: [
        { line: '경강', name: '판교역', distance: '155m', time: '2분', color: 'blue' },
        { line: '신분당', name: '판교역', distance: '221m', time: '3분', color: 'red' },
        { line: '경강', name: '성남역', distance: '532m', time: '8분', color: 'blue' },
        { line: 'GTX-A', name: '성남역', distance: '626m', time: '9분', color: 'black' },
      ],
      bus: {
        types: [{ name: '광역', color: 'orange' }],
        lines: ['9401-1', '9401'],
      },
      commute: {
        options: [
          { destination: '판교', time: '10분' },
          { destination: '강남', time: '25분' },
        ],
      },
    },
    facilities: {
      kindergartens: [
        { name: '푸르니판교어린이집', type: '직장', distance: '126m', status: '가장 가까움' },
        { name: '크래프톤 어린이집', type: '직장', distance: '181m' },
        { name: '화랑어린이집', type: '가정', distance: '218m' },
      ],
    },
  },
  {
    id: 6,
    name: '무악현대아파트',
    price: '35,980',
    floor: '17',
    area: '60.00',
    address: '서울특별시 종로구 무악동 82',
    image: 'https://via.placeholder.com/150x100?text=Apartment',
    // 상세 정보 (기본 데이터와 동일)
    likes: 105,
    views: 105,
    priceHistory: {
      average: '24억 5,000',
      marketAverage: '26억 7,500',
      history: [
        { date: '24.05.31', area: '160A/16', price: '24억 5,000', floor: '13층' },
        { date: '24.01.02', area: '160A/16', price: '20억 4,000', floor: '2동/5층' },
        { date: '20.11.16', area: '160A/16', price: '15억 7,500', floor: '15층' },
      ],
    },
    transport: {
      subway: [
        { line: '경강', name: '판교역', distance: '155m', time: '2분', color: 'blue' },
        { line: '신분당', name: '판교역', distance: '221m', time: '3분', color: 'red' },
        { line: '경강', name: '성남역', distance: '532m', time: '8분', color: 'blue' },
        { line: 'GTX-A', name: '성남역', distance: '626m', time: '9분', color: 'black' },
      ],
      bus: {
        types: [{ name: '광역', color: 'orange' }],
        lines: ['9401-1', '9401'],
      },
      commute: {
        options: [
          { destination: '판교', time: '10분' },
          { destination: '강남', time: '25분' },
        ],
      },
    },
    facilities: {
      kindergartens: [
        { name: '푸르니판교어린이집', type: '직장', distance: '126m', status: '가장 가까움' },
        { name: '크래프톤 어린이집', type: '직장', distance: '181m' },
        { name: '화랑어린이집', type: '가정', distance: '218m' },
      ],
    },
  },
  {
    id: 7,
    name: '무악현대아파트',
    price: '35,980',
    floor: '17',
    area: '60.00',
    address: '서울특별시 종로구 무악동 82',
    image: 'https://via.placeholder.com/150x100?text=Apartment',
    // 상세 정보 (기본 데이터와 동일)
    likes: 105,
    views: 105,
    priceHistory: {
      average: '24억 5,000',
      marketAverage: '26억 7,500',
      history: [
        { date: '24.05.31', area: '160A/16', price: '24억 5,000', floor: '13층' },
        { date: '24.01.02', area: '160A/16', price: '20억 4,000', floor: '2동/5층' },
        { date: '20.11.16', area: '160A/16', price: '15억 7,500', floor: '15층' },
      ],
    },
    transport: {
      subway: [
        { line: '경강', name: '판교역', distance: '155m', time: '2분', color: 'blue' },
        { line: '신분당', name: '판교역', distance: '221m', time: '3분', color: 'red' },
        { line: '경강', name: '성남역', distance: '532m', time: '8분', color: 'blue' },
        { line: 'GTX-A', name: '성남역', distance: '626m', time: '9분', color: 'black' },
      ],
      bus: {
        types: [{ name: '광역', color: 'orange' }],
        lines: ['9401-1', '9401'],
      },
      commute: {
        options: [
          { destination: '판교', time: '10분' },
          { destination: '강남', time: '25분' },
        ],
      },
    },
    facilities: {
      kindergartens: [
        { name: '푸르니판교어린이집', type: '직장', distance: '126m', status: '가장 가까움' },
        { name: '크래프톤 어린이집', type: '직장', distance: '181m' },
        { name: '화랑어린이집', type: '가정', distance: '218m' },
      ],
    },
  },
])

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
  showSortOptions.value = false

  // 정렬 로직 구현
  // 실제로는 API 호출이나 데이터 정렬 로직이 들어갈 수 있음
  console.log('정렬 옵션 선택:', option.value)
}

// 매물 선택
const selectProperty = (property) => {
  // 부모 컴포넌트로 선택된 매물 정보 전달
  emit('select-property', property)
}
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
