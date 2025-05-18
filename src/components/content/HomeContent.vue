<template>
  <div class="home-content">
    <div class="address-info">
      <h6>현재 위치</h6>
      <p>더샵센트럴파크2차</p>
      
      <h6 class="mt-3">상세 주소</h6>
      <p>경기도 성남시 분당구 판교역로 152</p>
      
      <h6 class="mt-3">우편번호</h6>
      <p>13529</p>
    </div>
    
    <div class="mt-4">
      <button class="btn btn-sm btn-outline-primary w-100" @click="copyAddress">주소 복사하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  }
});

const copyAddress = () => {
  const address = '경기도 성남시 분당구 판교역로 152';
  navigator.clipboard.writeText(address)
    .then(() => {
      alert('주소가 클립보드에 복사되었습니다.');
    })
    .catch(err => {
      console.error('주소 복사 실패:', err);
      alert('주소 복사에 실패했습니다.');
    });
};
</script>

<style scoped>
.home-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.address-info {
  flex: 1;
}

h6 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

p {
  margin-bottom: 0;
}
</style>