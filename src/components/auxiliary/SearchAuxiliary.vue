<template>
  <div class="search-auxiliary">
    <div class="store-detail">
      <div class="store-header">
        <h6>스타벅스 판교점</h6>
        <span class="badge bg-primary">카페</span>
      </div>
      
      <div class="store-info-section mt-3">
        <div class="info-item">
          <i class="bi bi-geo-alt"></i>
          <span>경기도 성남시 분당구 판교역로 152</span>
        </div>
        <div class="info-item">
          <i class="bi bi-telephone"></i>
          <span>031-123-4567</span>
        </div>
        <div class="info-item">
          <i class="bi bi-clock"></i>
          <span>07:00 - 22:00</span>
        </div>
      </div>
      
      <div class="store-actions mt-3">
        <button class="btn btn-sm btn-outline-primary me-2" @click="addToFavorites">
          <i class="bi bi-star"></i> 즐겨찾기
        </button>
        <button class="btn btn-sm btn-outline-primary" @click="shareLocation">
          <i class="bi bi-share"></i> 공유하기
        </button>
      </div>
      
      <div class="store-description mt-3">
        <h6>매장 소개</h6>
        <p>판교역 인근에 위치한 스타벅스 매장입니다. 넓은 좌석과 무료 와이파이를 제공합니다.</p>
      </div>
      
      <div class="store-map mt-3">
        <h6>위치</h6>
        <div class="map-thumbnail" @click="showOnMap">
          <img src="https://via.placeholder.com/250x150?text=Map+Thumbnail" alt="지도 미리보기" class="img-fluid rounded">
          <div class="map-overlay">
            <i class="bi bi-fullscreen"></i> 지도에서 보기
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  }
});

const addToFavorites = () => {
  alert('즐겨찾기에 추가되었습니다.');
};

const shareLocation = () => {
  alert('위치 공유 기능이 실행되었습니다.');
};

const showOnMap = () => {
  if (window.kakao && window.kakao.maps) {
    // 지도 객체 가져오기
    const mapContainer = document.getElementById('kakao-map');
    if (!mapContainer) return;
    
    const map = mapContainer.__kakao_map;
    if (!map) return;
    
    // 스타벅스 위치로 지도 이동
    const position = new window.kakao.maps.LatLng(37.4025, 127.1100);
    map.setCenter(position);
    
    // 줌 레벨 조정
    map.setLevel(2);
  }
};
</script>

<style scoped>
.store-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.store-header h6 {
  margin: 0;
  font-size: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-item i {
  margin-right: 10px;
  color: #0d6efd;
}

.store-description p {
  font-size: 14px;
  line-height: 1.5;
}

.map-thumbnail {
  position: relative;
  cursor: pointer;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 0.25rem;
}

.map-thumbnail:hover .map-overlay {
  opacity: 1;
}
</style>