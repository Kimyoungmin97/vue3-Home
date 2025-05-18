<template>
  <div class="app-container">
    <HeaderComponent :location="currentLocation" />
    <div class="content-container">
      <SidebarComponent @menu-click="handleMenuClick" :activeMenu="activeMenu" />
      <MainComponent 
        :activeMenu="activeMenu" 
        :mainContent="mainContent" 
        :auxiliaryContent="auxiliaryContent"
        :showAuxiliary="showAuxiliary"
        @toggle-auxiliary="toggleAuxiliary"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import HeaderComponent from './components/HeaderComponent.vue';
import SidebarComponent from './components/SidebarComponent.vue';
import MainComponent from './components/MainComponent.vue';

// 카카오맵 API 스크립트 로드
const loadKakaoMapsScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_MAPS_APP_KEY&autoload=false&libraries=services,clusterer,drawing`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };
    document.head.appendChild(script);
  });
};

// 상태 관리
const activeMenu = ref('home');
const showAuxiliary = ref(false);
const currentLocation = ref('더샵센트럴파크2차');

// 메뉴 콘텐츠 데이터
const menuContents = reactive({
  home: {
    main: { title: '주소 정보', content: '현재 위치의 주소 정보를 확인할 수 있습니다.' },
    auxiliary: { title: '주변 시설', content: '주변 편의시설 목록을 확인할 수 있습니다.' }
  },
  search: {
    main: { title: '상가 검색', content: '주변 상가를 검색할 수 있습니다.' },
    auxiliary: { title: '상가 상세 정보', content: '선택한 상가의 상세 정보를 확인할 수 있습니다.' }
  },
  profile: {
    main: { title: '회원 정보', content: '회원님의 기본 정보를 확인할 수 있습니다.' },
    auxiliary: { title: '정보 수정', content: '회원 정보를 수정할 수 있습니다.' }
  },
  calendar: {
    main: { title: '일정 관리', content: '등록된 일정을 확인할 수 있습니다.' },
    auxiliary: { title: '일정 등록', content: '새로운 일정을 등록할 수 있습니다.' }
  },
  map: {
    main: { title: '지도 보기', content: '현재 지역의 지도를 확인할 수 있습니다.' },
    auxiliary: { title: '경로 안내', content: '원하는 목적지까지의 경로를 확인할 수 있습니다.' }
  }
});

// 현재 활성화된 콘텐츠
const mainContent = ref(menuContents.home.main);
const auxiliaryContent = ref(menuContents.home.auxiliary);

// 메뉴 클릭 핸들러
const handleMenuClick = (menuId) => {
  activeMenu.value = menuId;
  mainContent.value = menuContents[menuId].main;
  auxiliaryContent.value = menuContents[menuId].auxiliary;
  
  // 메뉴 변경 시 보조 화면 초기화
  showAuxiliary.value = false;
};

// 보조 화면 토글
const toggleAuxiliary = () => {
  showAuxiliary.value = !showAuxiliary.value;
};

// 컴포넌트 마운트 시 카카오맵 API 로드
onMounted(() => {
  loadKakaoMapsScript();
});
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