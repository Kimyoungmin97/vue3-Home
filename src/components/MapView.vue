<template>
  <div class="map-view">
    <!-- 상단 검색창 -->
    <div class="search-bar" v-if="!mainActive" @click="goToSearch">
      <i class="bi bi-search me-2"></i> {{ locationName }}
    </div>
    <div id="kakao-map" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, inject } from 'vue'
const locationName = ref('영등포구 여의도동')
const props = defineProps({
  activeMenu: {
    type: String,
    default: 'home',
  },
})

const emit = defineEmits(['marker-click', 'search-click'])

const mapContainer = ref(null)
let map = null
let markers = []

// 마커 데이터
const markerData = [
  {
    id: 1,
    position: { lat: 37.402, lng: 127.1087 },
    title: '더샵센트럴파크2차',
    type: 'home',
    content: '현재 위치',
  },
  {
    id: 2,
    position: { lat: 37.4025, lng: 127.11 },
    title: '스타벅스 판교점',
    type: 'search',
    content: '카페',
  },
  {
    id: 3,
    position: { lat: 37.4015, lng: 127.1095 },
    title: '판교역',
    type: 'map',
    content: '지하철역',
  },
  {
    id: 4,
    position: { lat: 37.403, lng: 127.108 },
    title: '판교 병원',
    type: 'search',
    content: '병원',
  },
  {
    id: 5,
    position: { lat: 37.401, lng: 127.107 },
    title: '판교 초등학교',
    type: 'map',
    content: '학교',
  },
]

// 지도 초기화
const initMap = () => {
  if (!window.kakao || !window.kakao.maps) {
    console.error('Kakao Maps API가 로드되지 않았습니다.')
    return
  }

  const options = {
    center: new window.kakao.maps.LatLng(37.402, 127.1087), // 판교 중심 좌표
    level: 3, // 확대 레벨
  }

  map = new window.kakao.maps.Map(mapContainer.value, options)

  // 지도 컨트롤 추가
  const zoomControl = new window.kakao.maps.ZoomControl()
  map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)

  // 마커 생성
  createMarkers()
}

// 마커 생성
const createMarkers = () => {
  // 기존 마커 제거
  removeMarkers()

  markerData.forEach((data) => {
    const markerPosition = new window.kakao.maps.LatLng(data.position.lat, data.position.lng)

    // 마커 이미지 설정
    const isHighlighted =
      props.activeMenu === data.type || (props.activeMenu === 'home' && data.type === 'home')

    const imageSrc = isHighlighted
      ? '//t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
      : '//t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png'

    const imageSize = new window.kakao.maps.Size(24, 35)
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize)

    // 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      map: map,
      title: data.title,
      image: markerImage,
    })

    // 인포윈도우 생성
    const infoContent = `<div style="padding:5px;font-size:12px;">${data.title}<br><span style="color:#888;">${data.content}</span></div>`
    const infoWindow = new window.kakao.maps.InfoWindow({
      content: infoContent,
    })

    // 마커 클릭 이벤트
    window.kakao.maps.event.addListener(marker, 'click', () => {
      // 모든 인포윈도우 닫기
      markers.forEach((m) => m.infoWindow.close())

      // 클릭한 마커의 인포윈도우 열기
      infoWindow.open(map, marker)

      // 마커 클릭 이벤트 발생
      emit('marker-click', data)
    })

    // 마커 마우스오버 이벤트
    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      infoWindow.open(map, marker)
    })

    // 마커 마우스아웃 이벤트
    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      infoWindow.close()
    })

    // 마커 저장
    markers.push({ marker, infoWindow, data })
  })
}

// 마커 제거
const removeMarkers = () => {
  markers.forEach((m) => {
    m.marker.setMap(null)
    m.infoWindow.close()
  })
  markers = []
}

// 활성 메뉴에 따라 지도 업데이트
const updateMapByMenu = () => {
  if (!map) return

  // 마커 업데이트
  createMarkers()

  // 활성 메뉴에 해당하는 마커로 지도 중심 이동
  const activeMarkers = markers.filter((m) => m.data.type === props.activeMenu)
  if (activeMarkers.length > 0) {
    const position = activeMarkers[0].marker.getPosition()
    map.setCenter(position)
  }
}

// 컴포넌트 마운트 시 지도 초기화
onMounted(() => {
  // 카카오맵 API가 로드되었는지 확인
  if (window.kakao && window.kakao.maps) {
    initMap()
  } else {
    // API가 로드될 때까지 대기
    const checkKakaoMaps = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        clearInterval(checkKakaoMaps)
        initMap()
      }
    }, 100)
  }
})

// 활성 메뉴 변경 시 지도 업데이트
watch(
  () => props.activeMenu,
  () => {
    updateMapByMenu()
  },
)

// 컴포넌트 언마운트 시 마커 제거
onUnmounted(() => {
  removeMarkers()
})

const mainActive = inject('mainActive')
function goToSearch() {
  mainActive.value = true
  emit('search-click')
}
</script>

<style scoped>
.map-view {
  width: 100%;
  height: 100%;
}

#kakao-map {
  width: 100%;
  height: 100%;
}
.search-bar {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1000;
  background: white;
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 500;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
