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
        <h2 class="property-title">{{ property.name }}</h2>
        <p class="property-address">{{ property.address }}</p>

        <div class="property-stats">
          <div class="stat-item">
            <i class="bi bi-heart-fill text-danger"></i> {{ property.likes }}
          </div>
          <div class="stat-item"><i class="bi bi-eye"></i> {{ property.views }}</div>
          <div class="stat-item">
            <i class="bi bi-chat-fill text-success"></i>
          </div>
        </div>

        <div class="divider"></div>

        <div class="price-section">
          <h3>실거래가 내역</h3>
          <div class="price-comparison">
            <div class="price-item">
              <p class="price-label">최근 실거래 기준 1개월 평균</p>
              <p class="price-value primary">{{ property.priceHistory.average }}</p>
            </div>
            <div class="price-item">
              <p class="price-label">매물 가격 평균</p>
              <p class="price-value">{{ property.priceHistory.marketAverage }}</p>
            </div>
          </div>

          <div class="price-tabs">
            <div class="tab active">최근 3년</div>
            <div class="tab">전체 기간</div>
            <div class="tab">매매/전세</div>
            <div class="tab">비교</div>
          </div>

          <div class="price-chart">
            <img
              src="https://via.placeholder.com/350x200?text=Price+Chart"
              alt="가격 차트"
              class="img-fluid"
            />
          </div>

          <div class="price-history">
            <div class="history-header">
              <div>계약일</div>
              <div>면적(공급)</div>
              <div>가격</div>
            </div>

            <div
              class="history-item"
              v-for="(item, index) in property.priceHistory.history"
              :key="index"
            >
              <div>{{ item.date }}</div>
              <div>{{ item.area }}</div>
              <div class="price-column">
                <div>{{ item.price }}</div>
                <div class="floor">{{ item.floor }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 두 번째 화면: 주변 교통 정보 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>주변 대중교통</h3>
          <p class="section-subtitle">지하철 1km, 광역버스 500m 이내</p>
        </div>

        <p class="section-description">이 단지에서 출/퇴근 지역까지의 시간을 비교해보세요.</p>

        <div class="transport-options">
          <div
            class="transport-option"
            v-for="(option, index) in property.transport.commute.options"
            :key="index"
          >
            <div class="option-label">{{ option.destination }}</div>
            <div class="option-value">{{ option.time }}</div>
          </div>
        </div>

        <div class="transport-section">
          <div class="transport-type">
            <i class="bi bi-train-front"></i> 지하철 {{ property.transport.subway.length }}
          </div>

          <div
            class="transport-item"
            v-for="(subway, index) in property.transport.subway"
            :key="index"
          >
            <div class="line-badge" :class="subway.color">{{ subway.line }}</div>
            <div class="station-name">{{ subway.name }}</div>
            <div class="distance">{{ subway.distance }}/도보 {{ subway.time }}</div>
          </div>
        </div>

        <div class="transport-section">
          <div class="transport-type">
            <i class="bi bi-bus-front"></i> 버스 {{ property.transport.bus.lines.length }}
          </div>

          <div class="bus-types">
            <div
              class="bus-type"
              v-for="(type, index) in property.transport.bus.types"
              :key="index"
              :class="type.color"
            >
              {{ type.name }}
            </div>
          </div>

          <div class="bus-numbers">
            <div
              class="bus-number"
              v-for="(line, index) in property.transport.bus.lines"
              :key="index"
            >
              {{ line }}
            </div>
          </div>
        </div>
      </div>

      <!-- 세 번째 화면: 주변 어린이집 정보 -->
      <div class="detail-section">
        <div class="section-header">
          <div class="tab-header">
            <div class="tab active">어린이집</div>
            <div class="tab">유치원</div>
          </div>
        </div>

        <p class="section-subtitle text-end">반경 1km내의 보육시설</p>

        <div class="facility-list">
          <div
            class="facility-item"
            v-for="(kindergarten, index) in property.facilities.kindergartens"
            :key="index"
          >
            <div class="facility-info">
              <div class="facility-name">{{ kindergarten.name }}</div>
              <div class="facility-type">{{ kindergarten.type }}</div>
            </div>
            <div class="facility-distance">
              <div class="distance-value">{{ kindergarten.distance }}</div>
              <div class="distance-status text-success" v-if="kindergarten.status">
                {{ kindergarten.status }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

const detailContent = ref(null)

// 뒤로가기
const goBack = () => {
  emit('close')
}
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
  min-height: calc(100% - 32px);
  border-bottom: 8px solid #f5f5f5;
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
  font-size: 14px;
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
}

.tab {
  padding: 8px 16px;
  font-size: 14px;
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
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.transport-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
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

.facility-item {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
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
</style>
