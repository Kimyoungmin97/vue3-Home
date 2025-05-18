<template>
  <div class="main-content">
    <div class="map-container position-relative">
      <!-- Map background with Kakao Maps -->
      <div class="map-background">
        <MapView 
          :activeMenu="activeMenu" 
          @marker-click="handleMarkerClick"
        />
      </div>
      
      <!-- Main screen (green area) -->
      <div class="main-screen" v-if="mainContent">
        <div class="main-screen-header">
          <h5>{{ mainContent.title }}</h5>
          <button 
            class="btn btn-sm btn-outline-dark" 
            @click="$emit('toggle-auxiliary')"
            v-if="!showAuxiliary"
          >
            상세 보기
          </button>
        </div>
        
        <div class="main-screen-content">
          <div class="content-area">
            <component :is="getMainComponent()" :content="mainContent" />
          </div>
        </div>
        
        <!-- Main screen label -->
        <div class="main-screen-label">
          원쪽 네비의 메인 화면(1번)
        </div>
      </div>
      
      <!-- Auxiliary screen (blue area) -->
      <div class="auxiliary-screen" v-if="showAuxiliary && auxiliaryContent">
        <div class="auxiliary-screen-header">
          <h5>{{ auxiliaryContent.title }}</h5>
          <button class="btn btn-sm btn-outline-dark" @click="$emit('toggle-auxiliary')">
            닫기
          </button>
        </div>
        
        <div class="auxiliary-screen-content">
          <component :is="getAuxiliaryComponent()" :content="auxiliaryContent" />
        </div>
      </div>
      
      <!-- Action buttons -->
      <div class="action-buttons">
        <button class="btn btn-primary btn-sm me-1" @click="handleConfirm">확인</button>
        <button class="btn btn-primary btn-sm me-1" @click="handleModify">변경</button>
        <button class="btn btn-primary btn-sm" @click="handleMove">이동</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, markRaw, defineAsyncComponent } from 'vue';

// 컴포넌트 동적 로드
const HomeContent = markRaw(defineAsyncComponent(() => import('./content/HomeContent.vue')));
const SearchContent = markRaw(defineAsyncComponent(() => import('./content/SearchContent.vue')));
// const ProfileContent = markRaw(defineAsyncComponent(() => import('./content/ProfileContent.vue')));
// const CalendarContent = markRaw(defineAsyncComponent(() => import('./content/CalendarContent.vue')));
const MapContent = markRaw(defineAsyncComponent(() => import('./content/MapContent.vue')));

const HomeAuxiliary = markRaw(defineAsyncComponent(() => import('./auxiliary/HomeAuxiliary.vue')));
const SearchAuxiliary = markRaw(defineAsyncComponent(() => import('./auxiliary/SearchAuxiliary.vue')));
// const ProfileAuxiliary = markRaw(defineAsyncComponent(() => import('./auxiliary/ProfileAuxiliary.vue')));
// const CalendarAuxiliary = markRaw(defineAsyncComponent(() => import('./auxiliary/CalendarAuxiliary.vue')));
const MapAuxiliary = markRaw(defineAsyncComponent(() => import('./auxiliary/MapAuxiliary.vue')));

// 지도 컴포넌트
import MapView from './MapView.vue';

// Props & Emits
const props = defineProps({
  activeMenu: {
    type: String,
    default: 'home'
  },
  mainContent: {
    type: Object,
    default: () => ({})
  },
  auxiliaryContent: {
    type: Object,
    default: () => ({})
  },
  showAuxiliary: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle-auxiliary']);

// 메인 컴포넌트 결정
const getMainComponent = () => {
  switch (props.activeMenu) {
    case 'home': return HomeContent;
    case 'search': return SearchContent;
    case 'profile': return ProfileContent;
    case 'calendar': return CalendarContent;
    case 'map': return MapContent;
    default: return HomeContent;
  }
};

// 보조 컴포넌트 결정
const getAuxiliaryComponent = () => {
  switch (props.activeMenu) {
    case 'home': return HomeAuxiliary;
    case 'search': return SearchAuxiliary;
    case 'profile': return ProfileAuxiliary;
    case 'calendar': return CalendarAuxiliary;
    case 'map': return MapAuxiliary;
    default: return HomeAuxiliary;
  }
};

// 마커 클릭 핸들러
const handleMarkerClick = (marker) => {
  console.log('마커 클릭:', marker);
  emit('toggle-auxiliary');
};

// 버튼 핸들러
const handleConfirm = () => {
  alert('확인 버튼이 클릭되었습니다.');
};

const handleModify = () => {
  alert('변경 버튼이 클릭되었습니다.');
};

const handleMove = () => {
  alert('이동 버튼이 클릭되었습니다.');
};
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
  top: 100px;
  left: 80px;
  width: 300px;
  height: 500px;
  background-color: rgba(144, 238, 144, 0.9);
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 10;
}

.main-screen-header {
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.main-screen-header h5 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.main-screen-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.content-area {
  height: 100%;
}

.main-screen-label {
  text-align: center;
  font-weight: bold;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border-top: 1px solid rgba(0,0,0,0.1);
}

.auxiliary-screen {
  position: absolute;
  top: 150px;
  left: 400px;
  width: 300px;
  height: 400px;
  background-color: rgba(135, 206, 250, 0.9);
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
  z-index: 10;
}

.auxiliary-screen-header {
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.auxiliary-screen-header h5 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.auxiliary-screen-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
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