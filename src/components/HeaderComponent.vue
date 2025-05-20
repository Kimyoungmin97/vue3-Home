<template>
  <header class="header">
    <div class="container-fluid">
      <div
        class="header-main d-flex justify-content-between align-items-center py-2 px-3 border rounded"
      >
        <div class="d-flex align-items-center">
          <span class="brand text-primary fw-bold">KIDSHOME</span>
          <div class="ms-3 bg-primary text-white px-3 py-1 rounded">10. {{ location }}</div>
        </div>
        <button class="btn btn-sm btn-outline-primary" @click="completeAction">알림</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  location: {
    type: String,
    default: '위치 정보 없음',
  },
})

// 완료 버튼 액션
const completeAction = () => {
  alert('작업이 완료되었습니다.')
}
</script>

<style scoped>
.header {
  background-color: #f8f9fa;
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.breadcrumb-container {
  font-size: 14px;
}

.brand {
  font-size: 18px;
  letter-spacing: 0.5px;
}
</style>
