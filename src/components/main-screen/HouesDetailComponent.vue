<template>
  <div class="property-detail-container">
    <!-- 상단 헤더 -->
    <div class="detail-header">
      <i class="bi bi-arrow-left" @click="goBack"></i>
    </div>

    <!-- 스크롤 가능한 컨텐츠 영역 -->
    <div class="detail-content" ref="detailContent">
      <!-- 첫 번째 화면: 매물 기본 정보 및 가격 -->
      <div class="detail-section">
        <h2 class="property-title">{{ property.aptNm }}</h2>
        <p class="property-address">{{ property.address }}</p>

        <div class="divider"></div>

        <div class="price-section">
          <h3>실거래가 내역</h3>
          <div class="price-comparison">
            <div class="price-item">
              <p class="price-label">최근 실거래 기준 1개월 평균</p>
              <p class="price-value primary">{{ property.avgPriceNearPeak }}</p>
            </div>
            <div class="price-item">
              <p class="price-label">매물 가격 평균</p>
              <p class="price-value">{{ property.avgPriceAll }}</p>
            </div>
          </div>

          <div class="price-tabs">
            <div class="tab" :class="{ active: activeTab === 'all' }" @click="switchTab('all')">
              전체 기간
            </div>
            <div
              class="tab"
              :class="{ active: activeTab === 'recent' }"
              @click="switchTab('recent')"
            >
              최근 3년
            </div>
          </div>

          <div class="price-chart">
            <div id="priceChart" ref="chartContainer" style="width: 100%; height: 200px"></div>
          </div>

          <div class="price-history" style="max-height: 300px; overflow-y: auto">
            <div class="history-header">
              <div>계약일</div>
              <div>면적(층)</div>
              <div>가격</div>
            </div>

            <div class="history-item" v-for="(item, index) in filteredHouseData" :key="index">
              <div>{{ item.date }}</div>
              <div>{{ item.excluUseAr }}({{ item.floor }}층)</div>
              <div class="price-column">
                <div>{{ item.price }}</div>
              </div>
            </div>
          </div>
          <!-- AI 분석 결과 텍스트 박스 -->
          <div class="ai-summary-box" v-if="aiResultText">
            <h4 class="summary-title">📈 AI 분석 요약</h4>
            <p class="summary-text" v-html="aiResultText.replaceAll('\n', '<br />')"></p>
          </div>
        </div>
      </div>

      <!-- 두 번째 화면: 주변 교통 정보 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>🚐 대중교통</h3>
          <p class="section-subtitle">반경 1km 이내</p>
        </div>
        <p class="section-description">이 단지에서 가까운 지하철역이에요.</p>
        <div class="transport-section">
          <div class="transport-type">🚊 지하철 {{ subwayList.length }}</div>

          <div class="transport-item" v-for="(subway, index) in subwayList" :key="index">
            <div class="line-badge" :class="subway.color">{{ subway.line }}</div>
            <div class="station-name">{{ subway.place_name }}</div>
            <div class="distance">{{ subway.distance }}m</div>
          </div>
          <p v-if="subwayList.length === 0" class="text-muted">조회된 지하철역이 없습니다.</p>
        </div>
      </div>

      <!-- 세 번째 화면: 학군 정보 (탭) -->
      <div class="detail-section">
        <!-- 1) section-header: 오직 제목과 탭만 -->
        <div class="section-header">
          <h3>🏫 학군</h3>
          <!-- <p class="section-description">이 단지에서 가까운 지하철역이에요.</p> -->
          <div class="tab-header">
            <div
              class="tab"
              :class="{ active: schoolTab === 'nursery' }"
              @click="schoolTab = 'nursery'"
            >
              어린이집
            </div>
            <div
              class="tab"
              :class="{ active: schoolTab === 'school' }"
              @click="schoolTab = 'school'"
            >
              학교
            </div>
            <div
              class="tab"
              :class="{ active: schoolTab === 'academy' }"
              @click="schoolTab = 'academy'"
            >
              학원
            </div>
          </div>
        </div>

        <!-- 2) 탭별 부제목(설명) -->
        <p class="section-subtitle text-end">반경 1km 이내</p>

        <!-- 탭별 렌더링 -->
        <div class="facility-list">
          <!-- 어린이집·유치원 -->
          <template v-if="schoolTab === 'nursery'">
            <div class="transport-type">✏️ 어린이집 ({{ nurseryList.length }})</div>
            <div class="transport-item" v-for="n in nurseryList" :key="n.id">
              <div class="station-name">{{ n.place_name }}</div>
              <div class="distance">{{ n.distance }}m</div>
            </div>
            <p v-if="nurseryList.length === 0" class="text-muted">
              조회된 어린이집 정보가 없습니다.
            </p>
          </template>

          <!-- 학교 -->
          <template v-else-if="schoolTab === 'school'">
            <!-- 초등학교 -->
            <div class="transport-type">✏️ 초등학교 ({{ elementarySchools.length }})</div>
            <div class="transport-item" v-for="s in elementarySchools" :key="s.id">
              <div class="station-name">{{ s.place_name }}</div>
              <div class="distance">{{ s.distance }}m</div>
            </div>
            <p v-if="elementarySchools.length === 0" class="text-muted">
              조회된 초등학교가 없습니다.
            </p>

            <!-- 중학교 -->
            <div class="transport-type">✏️ 중학교 ({{ middleSchools.length }})</div>
            <div class="transport-item" v-for="s in middleSchools" :key="s.id">
              <div class="station-name">{{ s.place_name }}</div>
              <div class="distance">{{ s.distance }}m</div>
            </div>
            <p v-if="middleSchools.length === 0" class="text-muted">
              조회된 중학교 정보가 없습니다.
            </p>

            <!-- 고등학교 -->
            <div class="transport-type">✏️ 고등학교 ({{ highSchools.length }})</div>
            <div class="transport-item" v-for="s in highSchools" :key="s.id">
              <div class="station-name">{{ s.place_name }}</div>
              <div class="distance">{{ s.distance }}m</div>
            </div>
            <p v-if="highSchools.length === 0" class="text-muted">
              조회된 고등학교 정보가 없습니다.
            </p>
          </template>

          <!-- 학원 -->
          <template v-else>
            <div class="transport-type">✏️ 학원 ({{ academyList.length }})</div>
            <div class="transport-item" v-for="a in academyList" :key="a.id">
              <div class="station-name">{{ a.place_name }}</div>
              <div class="distance">{{ a.distance }}m</div>
            </div>
            <p v-if="academyList.length === 0" class="text-muted">조회된 학원 정보가 없습니다.</p>
          </template>
        </div>
      </div>
      <!-- 4) 의료 정보 (탭) 🔧 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>🚑 의료</h3>
          <div class="tab-header">
            <div
              class="tab"
              :class="{ active: medicalTab === 'hospital' }"
              @click="medicalTab = 'hospital'"
            >
              병원
            </div>
            <div
              class="tab"
              :class="{ active: medicalTab === 'pharmacy' }"
              @click="medicalTab = 'pharmacy'"
            >
              약국
            </div>
          </div>
        </div>
        <p class="section-subtitle text-end">반경 1km 이내</p>
        <div class="facility-list">
          <div class="transport-item" v-for="m in currentMedicalList" :key="m.id">
            <div class="station-name">{{ m.place_name }}</div>
            <div class="distance">{{ m.distance }}m</div>
          </div>
          <p v-if="currentMedicalList.length === 0" class="text-muted">
            조회된 {{ medicalTab === 'hospital' ? '병원' : '약국' }}이 없습니다.
          </p>
        </div>
      </div>
      <!-- 여가 정보 섹션 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>🎉 여가</h3>
          <p class="section-subtitle">반경 1km 이내</p>
        </div>
        <p class="section-description">이 단지에서 가까운 여가시설이에요.</p>
        <div class="facility-list">
          <!-- 문화시설 그룹 -->
          <div class="transport-type">🛝 문화시설 ({{ cultureWithSubType.length }})</div>
          <div class="facility-item" v-for="c in cultureWithSubType" :key="c.id">
            <div class="facility-info">
              <div class="station-name">{{ c.place_name }}</div>
              <div class="facility-type">{{ c.subType }}</div>
            </div>
            <div class="facility-distance">
              <div class="distance">{{ c.distance }}m</div>
            </div>
          </div>
          <p v-if="cultureWithSubType.length === 0" class="text-muted">
            조회된 문화시설이 없습니다.
          </p>
        </div>
        <div class="facility-list">
          <!-- 관광명소 그룹 -->
          <div class="transport-type">🏖️ 관광명소 ({{ tourismWithSubType.length }})</div>

          <div class="facility-item" v-for="t in tourismWithSubType" :key="t.id">
            <div class="facility-info">
              <div class="station-name">{{ t.place_name }}</div>
              <div class="facility-type">{{ t.subType }}</div>
            </div>
            <div class="facility-distance">
              <div class="distance">{{ t.distance }}m</div>
            </div>
          </div>

          <p v-if="tourismWithSubType.length === 0" class="text-muted">
            조회된 관광명소가 없습니다.
          </p>
        </div>
      </div>
      <!-- footer -->
      <footer class="detail-footer">
        <p>© 2025 키즈홈. All rights reserved.</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { houseApi } from '@/axios/house'
import { userApiNoAuth } from '@/axios/user'
import * as echarts from 'echarts'

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
  categoryData: Object,
})

let aiData = {
  aptName: props.property.aptNm,
  location: props.property.address,
  dealHistory: [],
}

function formatToDate(dateStr) {
  const parts = dateStr.split('.')
  const year = parseInt(parts[0]) < 100 ? `20${parts[0].padStart(2, '0')}` : parts[0]
  const month = parts[1].padStart(2, '0')
  const day = parts[2].padStart(2, '0')
  return `${year}-${month}-${day}`
}

const house = ref([])

const selectDetail = async (aptSeq) => {
  try {
    const response = await houseApi({
      url: `/search/${aptSeq}/deals`,
      method: 'get',
    })

    house.value = response.data.data
    aiData.dealHistory = response.data.data
      // 날짜 기준 오름차순 정렬
      .sort((a, b) => new Date(formatToDate(a.date)) - new Date(formatToDate(b.date)))
      // 매핑
      .map((item) => ({
        dealDate: formatToDate(item.date),
        dealAmount: item.dealAmount.toString(),
      }))
    await aiAnalyze()
  } catch (e) {
    console.log(e)
  }
}
const aiResultText = ref('')

const aiAnalyze = async () => {
  try {
    const response = await userApiNoAuth({
      url: `/api/ai/analyze/price`,
      method: 'post',
      data: aiData,
    })
    aiResultText.value = response.data.data.content
    console.log(response)
  } catch (e) {
    console.log(e)
  }
}

watch(
  () => props.property.aptSeq,
  async (newAptSeq, oldAptSeq) => {
    if (newAptSeq !== oldAptSeq) {
      selectDetail(newAptSeq)
    }
  },
  { immediate: true }, // mount 시점에도 한 번 실행
)

const emit = defineEmits(['close'])

const detailContent = ref(null)

// 각 가테고리별
////// 교통 정보 //////
const subwayList = computed(() => props.categoryData.SW8 || []) // 지하철

////// 학군 정보 //////
const schoolTab = ref('nursery') // 탭 상태
const nurseryList = computed(() => props.categoryData.PS3 || []) // 어린이집, 유치원
const schoolList = computed(() => props.categoryData.SC4 || []) // 초중고
const academyList = computed(() => props.categoryData.AC5 || []) // 학원
const elementarySchools = computed(() =>
  schoolList.value.filter((s) => s.category_name.includes('초등학교')),
)
const middleSchools = computed(() =>
  schoolList.value.filter((s) => s.category_name.includes('중학교')),
)
const highSchools = computed(() =>
  schoolList.value.filter(
    (s) => s.category_name.includes('고등학교'), // “특성화고등학교”도 포함시키고 싶으면 그냥 '고등학교'로 체크
  ),
)

////// 의료 정보 //////
const medicalTab = ref('hospital')

const hospitalList = computed(() => props.categoryData.HP8 || []) // 병원
const pharmacyList = computed(() => props.categoryData.PM9 || []) // 약국

const currentMedicalList = computed(() =>
  medicalTab.value === 'hospital' ? hospitalList.value : pharmacyList.value,
)

////// 여가 정보 //////
const cultureList = computed(() => props.categoryData.CT1 || []) // 문화시설
const cultureWithSubType = computed(() =>
  cultureList.value.map((item) => {
    // '>'로 분리하고, 맨 마지막 요소만 가져와서 앞뒤 공백 제거
    const parts = item.category_name.split('>').map((s) => s.trim())
    return {
      ...item,
      subType: parts[parts.length - 1],
    }
  }),
)
const tourismList = computed(() => props.categoryData.AT4 || []) // 관광명소
const tourismWithSubType = computed(() =>
  tourismList.value.map((item) => {
    const parts = item.category_name.split('>').map((s) => s.trim())
    return {
      ...item,
      subType: parts[parts.length - 1], // e.g. '기념관', '전시관' 등
    }
  }),
)

// 뒤로가기
const goBack = () => {
  emit('close')
}

// Chart related
const chartContainer = ref(null)
let priceChart = null
const activeTab = ref('all') // 'all' for 전체 기간, 'recent' for 최근 3년

// Filter house data based on active tab
const filteredHouseData = computed(() => {
  if (activeTab.value === 'recent') {
    // Filter for last 3 years
    const threeYearsAgo = new Date()
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3)

    return house.value.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= threeYearsAgo
    })
  }
  // Return all data for 'all' tab
  return house.value
})

// Initialize chart
const initChart = () => {
  if (!chartContainer.value) return

  priceChart = echarts.init(chartContainer.value)
  updateChart()

  // Handle window resize
  window.addEventListener('resize', () => {
    priceChart && priceChart.resize()
  })
}

// Update chart with data
const updateChart = () => {
  if (!priceChart) return
  // Sort data by date
  const sortedData = [...filteredHouseData.value].sort((a, b) => {
    return new Date(a.date) - new Date(b.date)
  })

  // Prepare chart data
  const xAxisData = sortedData.map((item) => item.date)
  let seriesData = sortedData.map((item) => {
    const raw =
      typeof item.dealAmount === 'string'
        ? parseInt(item.dealAmount.replace(/,/g, ''))
        : item.dealAmount
    return raw / 10000
  })
  if (filteredHouseData.value.length === 0) {
    seriesData = []
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const { name, value } = params[0]
        return `${name}: ${value.toLocaleString()} 천만원`
      },
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        rotate: 45,
        fontSize: 10,
      },
    },
    yAxis: {
      type: 'value',
      name: '거래가(천만원)', // 👈 단위 변경
      axisLabel: {
        formatter: (val) => val.toLocaleString() + '천', // 👈 라벨 포맷
      },
    },
    series: [
      {
        data: seriesData,
        type: 'line',
        name: '거래가',
        smooth: true,
        lineStyle: {
          color: '#4169e1',
        },
        itemStyle: {
          color: '#4169e1',
        },
      },
    ],
    grid: {
      top: '20%',
      left: '10%',
      right: '5%',
      bottom: '18%',
    },
  }

  priceChart.setOption(option)
}

// Switch between tabs
const switchTab = (tab) => {
  activeTab.value = tab
  updateChart()
}

// Initialize chart when component is mounted
onMounted(() => {
  // Wait for DOM to be ready
  setTimeout(() => {
    initChart()
  }, 100)
})

// Update chart when house data changes
watch(
  house,
  () => {
    updateChart()
  },
  { deep: true },
)
</script>

<style scoped>
.property-detail-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow: hidden;
}

.detail-header {
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.detail-header i {
  font-size: 24px;
  cursor: pointer;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.detail-section {
  padding: 16px;
  /* min-height: calc(100% - 32px); */
  border-bottom: 8px solid #f5f5f5;
}

.sub-section {
  margin-top: 12px;
}
.sub-section ul {
  padding-left: 16px;
}
.sub-section li {
  margin-bottom: 4px;
}

.group-header {
  display: block;
  font-size: 15px;
  font-weight: 700;
  margin: 16px 0 8px;
  /* padding: 6px 12px;
  /*background-color: #f9f9f9; /* 연한 회색 배경 */
  /*border-top: 1px solid #e0e0e0; /* 위쪽 구분선 */
  /*border-bottom: 1px solid #e0e0e0; /* 아래쪽 구분선 */
  color: #4169e1;
}
/* facility-list 에서 바로 아래 .facility-item 과 붙지 않도록 여백 추가 */
.group-header + .transport-item {
  margin-top: 4px;
}

.property-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
}

.property-address {
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
  text-align: center;
}

.property-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 16px 0;
}

.price-section h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.price-comparison {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.price-item {
  flex: 1;
}

.price-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.price-value {
  font-size: 20px;
  font-weight: 600;
}

.price-value.primary {
  color: #4169e1;
}

.price-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
  justify-content: center;
}

.tab {
  padding: 8px 16px;
  font-size: 15px;
  cursor: pointer;
}

.tab.active {
  font-weight: 600;
  border-bottom: 2px solid #4169e1;
  color: #4169e1;
}

.price-chart {
  margin-bottom: 24px;
}

.price-history {
  font-size: 14px;
}

.history-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 8px 0;
  font-weight: 600;
  border-bottom: 1px solid #eee;
}

.history-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.price-column {
  display: flex;
  flex-direction: column;
}

.floor {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 14px;
  color: #666;
}

.section-description {
  font-size: 16px;
  margin-bottom: 24px;
}

.transport-options {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.transport-option {
  flex: 1;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.option-label {
  font-size: 16px;
  margin-bottom: 8px;
}

.option-value {
  font-size: 20px;
  font-weight: 600;
}

.transport-section {
  margin-bottom: 24px;
}

.transport-type {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  margin-top: 16px;
  padding: 5px 12px;
  width: 100%;

  background-color: #f7f8fa;
  border-radius: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.transport-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.transport-item:last-child {
  border-bottom: none;
}

.line-badge {
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  margin-right: 12px;
}

.blue {
  background-color: #1e3a8a;
}

.red {
  background-color: #dc2626;
}

.black {
  background-color: #000000;
}

.orange {
  background-color: #f97316;
}

.green {
  background-color: #10b981;
}

.brown {
  background-color: #92400e;
}

.yellow {
  background-color: #eab308;
  color: #000;
}

.station-name {
  flex: 1;
  font-size: 14px;
}

.distance {
  font-size: 14px;
  color: #666;
}

.bus-types {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.bus-type {
  padding: 4px 12px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
}

.bus-numbers {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.bus-number {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  margin-bottom: 8px;
}

.tab-header {
  display: flex;
  border-bottom: 1px solid #eee;
}

.facility-list {
  margin-top: 16px;
}

/* facility-list 안의 facility-item 중 마지막에는 border-bottom 없애기 */

.facility-list .facility-item:last-child {
  border-bottom: none;
}

.facility-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.facility-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.facility-type {
  font-size: 14px;
  color: #666;
}

.distance-value {
  font-size: 18px;
  font-weight: 600;
  text-align: right;
}

.distance-status {
  font-size: 14px;
  text-align: right;
}

.text-success {
  color: #10b981;
}

.text-danger {
  color: #ef4444;
}

.text-end {
  text-align: right;
}
.ai-summary-box {
  background-color: #f8f9fb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  color: #4169e1;
  margin-bottom: 8px;
}

.summary-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-line;
}
.detail-footer {
  background: #f5f5f5; /* 연한 회색 배경 */
  text-align: center; /* 가운데 정렬 */
  padding: 16px 0; /* 상하 16px 여백 */
  font-size: 12px; /* 작은 글씨 */
  color: #888; /* 회색 글씨 */
  border-top: 1px solid #ddd; /* 윗줄 구분선 */
}
</style>
