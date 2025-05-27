<template>
  <div class="main-content">
    <div class="map-container position-relative">
      <!-- Map background with Kakao Maps -->
      <div class="map-background">
        <MapView
          :center="centerCoords"
          :houseMarkers="houseList"
          :categoryCodes="['PS3', 'SC4', 'SP4', 'AC5', 'SW8', 'CT1', 'AT4', 'HP8', 'PM9']"
          :activeMenu="activeMenu"
          @marker-click="handleMarkerClick"
          @search-click="handleSearchClick"
          @select-property="handleHouseMarkerClick"
          @category-data="handleCategoryData"
        />
      </div>

      <!-- Main screen (white area) -->
      <div class="main-screen" v-if="mainActive">
        <div class="main-screen-content">
          <div class="content-area">
            <component
              :is="getMainComponent()"
              :key="activeMenu"
              @select-property="handlePropertySelect"
              @close="handleClose"
              @update:houseList="houseList = $event"
            />
          </div>
        </div>
      </div>

      <!-- Auxiliary screen (white area next to main screen) -->
      <div class="auxiliary-screen" v-if="selectedProperty">
        <HouesDetailComponent
          :property="selectedProperty"
          :category-data="categoryData"
          @close="closePropertyDetail"
        />
      </div>

      <!-- Action buttons -->
      <div class="action-buttons">
        <!-- <button class="btn btn-primary btn-sm me-1" @click="handleConfirm">확인</button>
        <button class="btn btn-primary btn-sm me-1" @click="handleModify">변경</button>
        <button class="btn btn-primary btn-sm" @click="handleMove">이동</button> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { markRaw, defineAsyncComponent, inject, ref, watch } from 'vue'
import { useUserStore } from './store/user.js'
const userStore = useUserStore()

// 컴포넌트 동적 로드
const HomeContent = markRaw(defineAsyncComponent(() => import('./content/HomeContent.vue')))
const SearchPanelComponent = markRaw(
  defineAsyncComponent(() => import('@/components/main-screen/SearchPanelComponent.vue')),
)
const HouesDetailComponent = markRaw(
  defineAsyncComponent(() => import('@/components/main-screen/HouesDetailComponent.vue')),
)
const PostListComponent = markRaw(
  defineAsyncComponent(() => import('@/components/post/PostListComponent.vue')),
)
const LoginFormComponent = markRaw(
  defineAsyncComponent(() => import('@/components/member/LoginFormComponent.vue')),
)
const NoticeComponent = markRaw(
  defineAsyncComponent(() => import('@/components/post/NoticeComponent.vue')),
)

const UpdateFormComponent = markRaw(
  defineAsyncComponent(() => import('@/components/member/UpdateFormComponent.vue')),
)
// 지도 컴포넌트
import MapView from './MapView.vue'

// Props & Emits
const props = defineProps({
  activeMenu: {
    type: String,
    default: 'home',
  },
  showAuxiliary: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-auxiliary', 'search-click'])

// 선택된 매물 상태
const selectedProperty = ref(null)

const houseList = ref([])

const centerCoords = ref({ lat: 37.402, lng: 127.1087 })

const categoryData = ref({})

// 마커 클릭 시 상세창 + 지도 이동

const handleHouseMarkerClick = (house) => {
  selectedProperty.value = house

  centerCoords.value = { lat: house.latitude, lng: house.longitude }
}

// 카테고리 검색 결과 수집

const handleCategoryData = ({ code, data }) => {
  categoryData.value[code] = data
}

// 메인 컴포넌트 결정
const getMainComponent = () => {
  switch (props.activeMenu) {
    case 'home':
      return NoticeComponent
    case 'search':
      return SearchPanelComponent
    case 'profile':
      return userStore.isLoggedIn ? UpdateFormComponent : LoginFormComponent
    case 'community':
      return userStore.isLoggedIn ? PostListComponent : LoginFormComponent
    default:
      return HomeContent
  }
}

// 마커 클릭 핸들러
const handleMarkerClick = (marker) => {
  console.log('마커 클릭:', marker)
  emit('toggle-auxiliary')
}

// 검색 클릭 핸들러
const handleSearchClick = () => {
  emit('search-click')
}

// 매물 선택 핸들러
const handlePropertySelect = (property) => {
  selectedProperty.value = property
  centerCoords.value = { lat: property.latitude, lng: property.longitude }
}

// 매물 상세 정보 닫기
const closePropertyDetail = () => {
  selectedProperty.value = null
}

/* 🔧 수정된 부분: 검색 결과 첫 항목 기준으로 지도 중앙 이동 */

watch(houseList, (list) => {
  if (list.length) {
    const first = list[0]

    centerCoords.value = { lat: first.latitude, lng: first.longitude }
  }
})

// 컴포넌트 닫기 핸들러
const handleClose = () => {
  // 필요한 경우 추가 로직 구현
}

// mainActive 상태 가져오기
const mainActive = inject('mainActive')

// Watch for changes in activeMenu and reset selectedProperty when menu changes
watch(
  () => props.activeMenu,
  () => {
    // Reset selected property when menu changes
    selectedProperty.value = null
  },
)
</script>

<style scoped>
.main-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
}

.map-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.main-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 360px;
  height: 100%;
  background-color: #ffffff;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 15;
  overflow: hidden;
}

.main-screen-content {
  flex: 1;
  padding: 0;
  overflow-y: auto;
}

.content-area {
  height: 100%;
}

.auxiliary-screen {
  position: absolute;
  top: 0;
  left: 360px; /* Position right next to main-screen */
  width: 400px;
  height: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 15;
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

.action-buttons {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
