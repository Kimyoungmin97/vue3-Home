<template>
  <div class="home-auxiliary">
    <h6>주변 편의시설</h6>
    
    <ul class="facility-list">
      <li v-for="(facility, index) in facilities" :key="index" class="facility-item">
        <div class="facility-icon">
          <i :class="['bi', facility.icon]"></i>
        </div>
        <div class="facility-info">
          <div class="facility-name">{{ facility.name }}</div>
          <div class="facility-distance">{{ facility.distance }}</div>
        </div>
        <button class="btn btn-sm btn-outline-primary" @click="showOnMap(facility)">
          <i class="bi bi-geo-alt"></i>
        </button>
      </li>
    </ul>
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

const facilities = ref([
  { name: '스타벅스 판교점', distance: '100m', icon: 'bi-cup-hot', lat: 37.4025, lng: 127.1100 },
  { name: '세븐일레븐 판교역점', distance: '150m', icon: 'bi-shop', lat: 37.4022, lng: 127.1095 },
  { name: '판교역 1번 출구', distance: '200m', icon: 'bi-signpost', lat: 37.4015, lng: 127.1095 },
  { name: '판교 중앙공원', distance: '300m', icon: 'bi-tree', lat: 37.4010, lng: 127.1080 },
  { name: '판교 도서관', distance: '500m', icon: 'bi-book', lat: 37.4005, lng: 127.1070 }
]);

const showOnMap = (facility) => {
  if (window.kakao && window.kakao.maps) {
    // 지도 객체 가져오기
    const mapContainer = document.getElementById('kakao-map');
    if (!mapContainer) return;
    
    const map = mapContainer.__kakao_map;
    if (!map) return;
    
    // 선택한 시설의 위치로 지도 이동
    const position = new window.kakao.maps.LatLng(facility.lat, facility.lng);
    map.setCenter(position);
    
    // 줌 레벨 조정
    map.setLevel(2);
    
    // 임시 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: position,
      map: map
    });
    
    // 인포윈도우 생성
    const infoContent = `<div style="padding:5px;font-size:12px;">${facility.name}</div>`;
    const infoWindow = new window.kakao.maps.InfoWindow({
      content: infoContent
    });
    
    infoWindow.open(map, marker);
    
    // 3초 후 인포윈도우 닫기
    setTimeout(() => {
      infoWindow.close();
    }, 3000);
  }
};
</script>

<style scoped>
.facility-list {
  list-style: none;
  padding: 0;
  margin: 15px 0 0 0;
}

.facility-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.facility-icon {
  width: 40px;
  height: 40px;
  background-color: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.facility-icon i {
  font-size: 20px;
  color: #0d6efd;
}

.facility-info {
  flex: 1;
}

.facility-name {
  font-weight: 500;
  font-size: 14px;
}

.facility-distance {
  font-size: 12px;
  color: #6c757d;
}
</style>