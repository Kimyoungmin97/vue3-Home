<template>
  <div class="map-content">
    <div class="map-controls mb-3">
      <div class="input-group">
        <input 
          type="text" 
          class="form-control form-control-sm" 
          placeholder="목적지 검색" 
          v-model="destinationQuery"
        >
        <button class="btn btn-sm btn-primary" @click="searchDestination">검색</button>
      </div>
    </div>
    
    <div class="map-options mb-3">
      <div class="btn-group w-100">
        <button 
          v-for="option in mapOptions" 
          :key="option.id"
          :class="['btn btn-sm', activeMapOption === option.id ? 'btn-primary' : 'btn-outline-primary']"
          @click="setMapOption(option.id)"
        >
          <i :class="['bi', option.icon]"></i> {{ option.name }}
        </button>
      </div>
    </div>
    
    <div class="map-info">
      <h6>현재 위치</h6>
      <p>더샵센트럴파크2차</p>
      
      <div class="map-actions mt-3">
        <button class="btn btn-sm btn-outline-primary w-100 mb-2" @click="findMyLocation">
          <i class="bi bi-geo"></i> 내 위치 찾기
        </button>
        <button class="btn btn-sm btn-outline-primary w-100" @click="toggleTraffic">
          <i class="bi bi-signpost-2"></i> 교통정보 {{ showTraffic ? '끄기' : '켜기' }}
        </button>
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

const destinationQuery = ref('');
const activeMapOption = ref('roadmap');
const showTraffic = ref(false);

const mapOptions = ref([
  { id: 'roadmap', name: '지도', icon: 'bi-map' },
  { id: 'satellite', name: '위성', icon: 'bi-globe' },
  { id: 'hybrid', name: '하이브리드', icon: 'bi-layers' }
]);

const searchDestination = () => {
  if (!destinationQuery.value) {
    alert('목적지를 입력해주세요.');
    return;
  }
  
  if (window.kakao && window.kakao.maps) {
    // 지도 객체 가져오기
    const mapContainer = document.getElementById('kakao-map');
    if (!mapContainer) return;
    
    const map = mapContainer.__kakao_map;
    if (!map) return;
    
    // 장소 검색 객체 생성
    const ps = new window.kakao.maps.services.Places();
    
    // 키워드로 장소 검색
    ps.keywordSearch(destinationQuery.value, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 첫번째 결과의 좌표로 이동
        const firstItem = data[0];
        const position = new window.kakao.maps.LatLng(firstItem.y, firstItem.x);
        map.setCenter(position);
        
        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: position,
          map: map
        });
        
        // 인포윈도우 생성
        const infoContent = `<div style="padding:5px;font-size:12px;">${firstItem.place_name}</div>`;
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: infoContent
        });
        
        infoWindow.open(map, marker);
        
        // 검색 결과 알림
        alert(`'${destinationQuery.value}' 검색 결과: ${firstItem.place_name}`);
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  }
};

const setMapOption = (option) => {
  activeMapOption.value = option;
  
  if (window.kakao && window.kakao.maps) {
    // 지도 객체 가져오기
    const mapContainer = document.getElementById('kakao-map');
    if (!mapContainer) return;
    
    const map = mapContainer.__kakao_map;
    if (!map) return;
    
    // 지도 타입 변경
    if (option === 'roadmap') {
      map.setMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
    } else if (option === 'satellite') {
      map.setMapTypeId(window.kakao.maps.MapTypeId.SATELLITE);
    } else if (option === 'hybrid') {
      map.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
    }
  }
};

const findMyLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        if (window.kakao && window.kakao.maps) {
          // 지도 객체 가져오기
          const mapContainer = document.getElementById('kakao-map');
          if (!mapContainer) return;
          
          const map = mapContainer.__kakao_map;
          if (!map) return;
          
          // 현재 위치로 지도 이동
          const currentPosition = new window.kakao.maps.LatLng(lat, lng);
          map.setCenter(currentPosition);
          
          // 현재 위치 마커 생성
          const marker = new window.kakao.maps.Marker({
            position: currentPosition,
            map: map
          });
          
          // 인포윈도우 생성
          const infoContent = '<div style="padding:5px;font-size:12px;">현재 위치</div>';
          const infoWindow = new window.kakao.maps.InfoWindow({
            content: infoContent
          });
          
          infoWindow.open(map, marker);
        }
      },
      (error) => {
        console.error('위치 정보를 가져오는데 실패했습니다:', error);
        alert('위치 정보를 가져오는데 실패했습니다.');
      }
    );
  } else {
    alert('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
  }
};

const toggleTraffic = () => {
  showTraffic.value = !showTraffic.value;
  
  if (window.kakao && window.kakao.maps) {
    // 지도 객체 가져오기
    const mapContainer = document.getElementById('kakao-map');
    if (!mapContainer) return;
    
    const map = mapContainer.__kakao_map;
    if (!map) return;
    
    // 교통정보 표시/숨김
    if (showTraffic.value) {
      map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC);
    } else {
      map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC);
    }
  }
};
</script>

<style scoped>
.map-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.map-info {
  flex: 1;
}

h6 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

p {
  margin-bottom: 0;
}

.map-options .btn i {
  margin-right: 5px;
}
</style>