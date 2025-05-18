<template>
  <div class="map-auxiliary">
    <div class="route-info">
      <h6>경로 안내</h6>
      
      <div class="route-endpoints mt-3">
        <div class="route-start mb-2">
          <div class="input-group">
            <span class="input-group-text bg-primary text-white">출발</span>
            <input type="text" class="form-control form-control-sm" v-model="startPoint" placeholder="출발지">
          </div>
        </div>
        <div class="route-end">
          <div class="input-group">
            <span class="input-group-text bg-danger text-white">도착</span>
            <input type="text" class="form-control form-control-sm" v-model="endPoint" placeholder="도착지">
          </div>
        </div>
      </div>
      
      <div class="route-options mt-3">
        <div class="btn-group w-100">
          <button 
            v-for="option in routeOptions" 
            :key="option.id"
            :class="['btn btn-sm', activeRouteOption === option.id ? 'btn-primary' : 'btn-outline-primary']"
            @click="activeRouteOption = option.id"
          >
            <i :class="['bi', option.icon]"></i> {{ option.name }}
          </button>
        </div>
      </div>
      
      <div class="route-action mt-3">
        <button class="btn btn-primary btn-sm w-100" @click="findRoute">
          경로 찾기
        </button>
      </div>
      
      <div class="route-result mt-3" v-if="showRouteResult">
        <div class="route-summary">
          <div class="route-distance">
            <i class="bi bi-signpost-2"></i> 총 거리: {{ routeDistance }}
          </div>
          <div class="route-time">
            <i class="bi bi-clock"></i> 예상 시간: {{ routeTime }}
          </div>
        </div>
        
        <div class="route-steps mt-3">
          <div class="step-item" v-for="(step, index) in routeSteps" :key="index">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-instruction">{{ step }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  }
});

const startPoint = ref('더샵센트럴파크2차');
const endPoint = ref('');
const activeRouteOption = ref('car');
const showRouteResult = ref(false);
const routeDistance = ref('');
const routeTime = ref('');
const routeSteps = ref([]);

const routeOptions = ref([
  { id: 'car', name: '자동차', icon: 'bi-car-front' },
  { id: 'public', name: '대중교통', icon: 'bi-bus-front' },
  { id: 'walk', name: '도보', icon: 'bi-person-walking' }
]);

const findRoute = () => {
  if (!endPoint.value) {
    alert('도착지를 입력해주세요.');
    return;
  }
  
  // 실제로는 카카오맵 API를 사용한 경로 검색 로직이 들어갈 수 있음
  // 여기서는 더미 데이터로 구현
  
  // 경로 결과 표시
  showRouteResult.value = true;
  
  // 더미 데이터
  routeDistance.value = '5.2km';
  routeTime.value = '15분';
  
  if (activeRouteOption.value === 'car') {
    routeSteps.value = [
      '더샵센트럴파크2차에서 출발',
      '판교역로를 따라 300m 직진',
      '첫 번째 교차로에서 우회전',
      '분당수서로를 따라 2km 직진',
      '판교IC에서 우회전',
      '목적지 도착'
    ];
  } else if (activeRouteOption.value === 'public') {
    routeSteps.value = [
      '더샵센트럴파크2차에서 출발',
      '판교역까지 도보 5분',
      '신분당선 판교역에서 강남역 방면 탑승',
      '강남역에서 하차',
      '목적지까지 도보 3분',
      '목적지 도착'
    ];
  } else {
    routeSteps.value = [
      '더샵센트럴파크2차에서 출발',
      '판교역로를 따라 북쪽으로 10분 도보',
      '횡단보도를 건너 우측으로 5분 도보',
      '공원을 지나 직진 10분 도보',
      '목적지 도착'
    ];
  }
  
  // 지도에 경로 표시 (실제로는 카카오맵 API 사용)
  if (window.kakao && window.kakao.maps) {
    // 지도 객체 가져오기
    const mapContainer = document.getElementById('kakao-map');
    if (!mapContainer) return;
    
    const map = mapContainer.__kakao_map;
    if (!map) return;
    
    // 출발지와 도착지 좌표 (더미 데이터)
    const startPosition = new window.kakao.maps.LatLng(37.4020, 127.1087);
    const endPosition = new window.kakao.maps.LatLng(37.4050, 127.1150);
    
    // 경로 선 그리기
    const linePath = [startPosition, endPosition];
    const polyline = new window.kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: '#FF0000',
      strokeOpacity: 0.7,
      strokeStyle: 'solid'
    });
    
    // 기존 선 제거 (map 객체에 저장된 polyline이 있다면)
    if (map.polyline) {
      map.polyline.setMap(null);
    }
    
    polyline.setMap(map);
    map.polyline = polyline;
    
    // 지도 범위 재설정
    const bounds = new window.kakao.maps.LatLngBounds();
    bounds.extend(startPosition);
    bounds.extend(endPosition);
    map.setBounds(bounds);
  }
};
</script>

<style scoped>
.route-info {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.route-options .btn i {
  margin-right: 5px;
}

.route-summary {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.route-distance, .route-time {
  font-size: 14px;
  margin-bottom: 5px;
}

.route-distance i, .route-time i {
  margin-right: 5px;
  color: #0d6efd;
}

.route-steps {
  flex: 1;
  overflow-y: auto;
}

.step-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.step-number {
  width: 24px;
  height: 24px;
  background-color: #0d6efd;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 10px;
  flex-shrink: 0;
}

.step-instruction {
  font-size: 14px;
  line-height: 1.4;
}
</style>