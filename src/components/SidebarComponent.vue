<template>
  <div class="sidebar">
    <div 
      v-for="menu in menuItems" 
      :key="menu.id"
      :class="['sidebar-item d-flex flex-column align-items-center py-3', 
              activeMenu === menu.id ? 'active' : '']"
      @click="selectMenu(menu.id)"
    >
      <i :class="['bi', menu.icon]"></i>
      <span class="sidebar-text">{{ menu.text }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Props & Emits
const props = defineProps({
  activeMenu: {
    type: String,
    default: 'home'
  }
});

const emit = defineEmits(['menu-click']);

// 메뉴 아이템 데이터
const menuItems = ref([
  { id: 'home', text: '키즈홈', icon: 'bi-house-door' },
  { id: 'search', text: '실거래가', icon: 'bi-geo-alt' },
  { id: 'profile', text: '마이페이지', icon: 'bi-person' },
  { id: 'community', text: '커뮤니티', icon: 'bi-chat-left-dots' },
  { id: 'map', text: '미정', icon: 'bi-map' }
]);

// 메뉴 선택 핸들러
const selectMenu = (menuId) => {
  emit('menu-click', menuId);
};
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