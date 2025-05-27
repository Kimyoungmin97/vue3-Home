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
const props = defineProps({
  center: {
    // 부모로부터 받은 지도 중심 좌표
    type: Object,
    default: () => ({ lat: 37.402, lng: 127.1087 }),
  },
  houseMarkers: {
    // 부모로부터 받은 매물 리스트(실거래가 데이터)
    type: Array,
    default: () => [],
  },
  categoryCodes: {
    // 부모로부터 받은 카테고리 검색 코드 목록
    type: Array,
    default: () => ['PS3', 'SC4', 'AC5', 'SW8', 'CT1', 'AT4', 'HP8', 'PM9'],
  },
  activeMenu: {
    type: String,
    default: 'home',
  },
})

const CATEGORY_STYLE = {
  PS3: { icon: '/icons/nursery.png', bg: '#FFC107' }, // 어린이집·유치원 (Amber 500)
  SC4: { icon: '/icons/school.svg', bg: '#42A5F5' }, // 학교         (Blue 400)
  AC5: { icon: '/icons/academy.png', bg: '#66BB6A' }, // 학원         (Green 400)
  SW8: { icon: '/icons/subway.png', bg: '#FFA726' }, // 지하철역     (Orange 400)
  CT1: { icon: '/icons/culture.svg', bg: '#AB47BC' }, // 문화시설     (Purple 400)
  AT4: { icon: '/icons/tourism.png', bg: '#26C6DA' }, // 관광명소     (Cyan 400)
  HP8: { icon: '/icons/hospital.png', bg: '#EF5350' }, // 병원         (Red 400)
  PM9: { icon: '/icons/pharmacy.png', bg: '#9CCC65' }, // 약국         (Light Green 400)
}

const emit = defineEmits([
  'marker-click', // 기존 generic 마커 클릭
  'search-click', // 검색창 클릭
  'select-property', // 실거래가 마커 클릭
  'category-data', // 카테고리별 장소 검색 결과
])

const locationName = ref('영등포구 여의도동')
const mainActive = inject('mainActive')

let map = null // 지도
let placesService = null // 장소 검색 객체
let houseMarkerObjs = []
let categoryMarkerObjs = []
const mapContainer = ref(null)

// 지도 초기화
function initMap() {
  if (!window.kakao || !window.kakao.maps) {
    console.error('Kakao Maps API가 로드되지 않았습니다.')
    return
  }

  const options = {
    center: new window.kakao.maps.LatLng(props.center.lat, props.center.lng), // 판교 중심 좌표
    level: 3, // 확대 레벨
  }

  map = new window.kakao.maps.Map(mapContainer.value, options)

  // 지도 컨트롤 추가
  const zoomControl = new window.kakao.maps.ZoomControl()
  map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)

  // 마커 생성
  createHouseMarkers() // 집 마커 생성
  // 🔧 services 라이브러리가 있으면 카테고리 검색
  if (window.kakao.maps.services) {
    placesService = new window.kakao.maps.services.Places(map)
    doCategorySearch()
  } else {
    console.warn('⚠️ kakao.maps.services 를 찾을 수 없습니다. &libraries=services 확인하세요.')
  }
}

/* 부모로부터 center 변경 시 지도 이동 + 카테고리 재검색 */
watch(
  () => props.center,
  ({ lat, lng }) => {
    if (!map) return
    map.setCenter(new window.kakao.maps.LatLng(lat, lng))
    clearCategoryMarkers()
    if (placesService) doCategorySearch()
  },
  { deep: true },
)

/* 부모로부터 houseMarkers 변경 시 마커 갱신 */
watch(
  () => props.houseMarkers,
  () => {
    if (!map) return
    clearHouseMarkers()
    createHouseMarkers()
  },
  { deep: true },
)

function createHouseMarkers() {
  clearHouseMarkers()

  props.houseMarkers.forEach((h) => {
    const pos = new window.kakao.maps.LatLng(h.latitude, h.longitude)
    // 실제 보이지 않는 기본 마커 (영역 클릭을 위해)
    const marker = new window.kakao.maps.Marker({
      position: pos,
      // map,
      // 커서를 포인터로 설정
      clickable: true, // 클릭 가능하게
    })

    // CustomOverlay 로 항상 보이는 라벨
    const contentEl = document.createElement('div')
    contentEl.className = 'house-label'
    contentEl.innerHTML = `
      <div class="house-title">${h.aptNm}</div>
      <div class="house-price">${h.price}만</div>
    `

    contentEl.addEventListener('click', () => {
      emit('select-property', h)
    })

    const overlay = new window.kakao.maps.CustomOverlay({
      position: pos,
      content: contentEl,
      map,
      yAnchor: 1, // 라벨이 마커 위에 떠 있도록
      zIndex: 10,
    })

    // const marker = new window.kakao.maps.Marker({ position: pos, map })
    // marker.getElement().style.cursor = 'pointer'
    // 실거래가 마커 클릭 시
    window.kakao.maps.event.addListener(marker, 'click', () => {
      emit('select-property', h)
    })
    // overlay.getContent().addEventListener('click', () => {
    //   emit('select-property', h)
    // })
    // 저장
    // houseMarkerObjs.push(marker)
    houseMarkerObjs.push(overlay)
  })
}

function clearHouseMarkers() {
  houseMarkerObjs.forEach((m) => m.setMap(null))
  houseMarkerObjs = []
}

function doCategorySearch() {
  props.categoryCodes.forEach((code) => {
    placesService.categorySearch(
      code,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // console.log('카테고리 데이터 조회 결과: ', code, data)

          // 부모로부터 결과 데이터 전달
          emit('category-data', { code, data })

          const { icon, bg } = CATEGORY_STYLE[code] || {}

          // 지도에도 마커 찍기
          data.forEach((place) => {
            // const marker = new window.kakao.maps.Marker({
            //   map,
            //   position: new window.kakao.maps.LatLng(p.y, p.x),
            // }

            const pos = new window.kakao.maps.LatLng(place.y, place.x)

            // 1) DOM 엘리먼트 생성
            const el = document.createElement('div')
            el.className = 'category-marker'
            if (bg) el.style.backgroundColor = bg

            // 2) 아이콘 삽입
            const img = document.createElement('img')
            img.src = icon
            el.appendChild(img)

            // 4) CustomOverlay 생성
            const overlay = new window.kakao.maps.CustomOverlay({
              position: pos,
              content: el,
              map,
              yAnchor: 1,
              zIndex: 5,
            })

            // categoryMarkerObjs.push(marker)
            categoryMarkerObjs.push(overlay)
          })
        }
      },
      { x: props.center.lng, y: props.center.lat, radius: 1000 },
    )
  })
}

function clearCategoryMarkers() {
  categoryMarkerObjs.forEach((m) => m.setMap(null))
  categoryMarkerObjs = []
}

// 컴포넌트 마운트 시 지도 초기화(initMap 콜)
onMounted(() => {
  const timer = setInterval(() => {
    if (window.kakao?.maps) {
      clearInterval(timer)
      initMap()
    }
  }, 100)
})

// 컴포넌트 언마운트 시 마커 제거
onUnmounted(() => {
  clearHouseMarkers()
  clearCategoryMarkers()
})

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
<style>
.house-label {
  display: inline-block;
  background: #fff;
  border: 1px solid #ff5a5f;
  border-radius: 4px;
  padding: 2px 9px;
  text-align: center;
  white-space: nowrap;
  font-family: sans-serif;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.2s cubic-bezier(0.33, 1, 0.68, 1),
    box-shadow 0.2s cubic-bezier(0.33, 1, 0.68, 1);
}

.house-label:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
}
.house-title {
  font-size: 13px;
  font-weight: 400;
  color: #333;
  line-height: 1.2;
}
.house-price {
  font-size: 12px;
  color: #ff5a5f;
  line-height: 1.2;
  margin-top: 2px;
}
.category-marker {
  width: 33px;
  height: 33px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--marker-bg); /* JS에서 지정한 bg 컬러 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.category-marker:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.category-marker img {
  width: 23px;
  height: 23px;
  /* 아이콘에도 살짝 그림자 */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
</style>
