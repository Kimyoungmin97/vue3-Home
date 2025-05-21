<template>
  <div class="sidebar">
    <div
      v-for="menu in menuItems"
      :key="menu.id"
      :class="[
        'sidebar-item d-flex flex-column align-items-center py-3',
        activeMenu === menu.id && mainActive ? 'active' : '',
      ]"
      @click="selectMenu(menu.id)"
    >
      <i :class="['bi', menu.icon]"></i>
      <span class="sidebar-text">{{ menu.text }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const mainActive = inject('mainActive')

// Props & Emits
const props = defineProps({
  activeMenu: {
    type: String,
    default: 'home',
  },
})

const emit = defineEmits(['menu-click'])

// 메뉴 아이템 데이터
const menuItems = ref([
  { id: 'login', text: '키즈홈', icon: 'bi-house-door' },
  { id: 'search', text: '실거래가', icon: 'bi-geo-alt' },
  { id: 'profile', text: '마이페이지', icon: 'bi-person' },
  { id: 'community', text: '커뮤니티', icon: 'bi-chat-left-dots' },
  // { id: 'map', text: '미정', icon: 'bi-map' }
])

// 메뉴 선택 핸들러
const selectMenu = (menuId) => {
  // 같은 메뉴를 다시 클릭한 경우 mainActive 토글
  if (menuId === props.activeMenu) {
    mainActive.value = !mainActive.value
  } else {
    // 다른 메뉴를 클릭한 경우 mainActive를 true로 설정
    mainActive.value = true
    // Emit the menu-click event to update the active menu in the parent component
    emit('menu-click', menuId)
  }
}
</script>

<style scoped>
.sidebar {
  width: 70px;
  background-color: #ffffff;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  z-index: 50;
}

.sidebar-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-item i {
  font-size: 24px;
  margin-bottom: 5px;
  transition: all 0.2s ease;
}

.sidebar-text {
  font-size: 12px;
}

.sidebar-item:hover {
  background-color: #f8f9fa;
}

.sidebar-item.active {
  background-color: #e9f5ff;
}

.sidebar-item.active i {
  color: #0d6efd;
}
</style>
