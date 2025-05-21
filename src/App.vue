<template>
  <div class="app-container">
    <HeaderComponent :location="currentLocation" />
    <div class="content-container">
      <SidebarComponent @menu-click="handleMenuClick" :activeMenu="activeMenu" />
      <MainComponent
        :activeMenu="activeMenu"
        @toggle-auxiliary="toggleAuxiliary"
        @search-click="handleSearchClick"
        :showAuxiliary="showAuxiliary"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import HeaderComponent from './components/HeaderComponent.vue'
import SidebarComponent from './components/SidebarComponent.vue'
import MainComponent from './components/MainComponent.vue'

// 카카오맵 API 스크립트 로드
const loadKakaoMapsScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_MAPS_APP_KEY&autoload=false&libraries=services,clusterer,drawing`
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve()
      })
    }
    document.head.appendChild(script)
  })
}

// 상태 관리
const activeMenu = ref('login') // 기본값을 'login'으로 변경
const showAuxiliary = ref(false)
const currentLocation = ref('더샵센트럴파크2차')

// 메뉴 클릭 핸들러
const handleMenuClick = (menuId) => {
  activeMenu.value = menuId

  // 메뉴 변경 시 보조 화면 초기화
  showAuxiliary.value = false
}

// 검색 클릭 핸들러
const handleSearchClick = () => {
  activeMenu.value = 'search'
}

//보조화면
const mainActive = ref(true)
provide('mainActive', mainActive)

// 보조 화면 토글
const toggleAuxiliary = () => {
  showAuxiliary.value = !showAuxiliary.value
}

// 컴포넌트 마운트 시 카카오맵 API 로드
onMounted(() => {
  loadKakaoMapsScript()
})
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.content-container {
  display: flex;
  flex: 1;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Noto Sans KR', sans-serif;
}
</style>
