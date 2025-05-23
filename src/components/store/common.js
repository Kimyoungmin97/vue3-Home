import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { houseApi } from '@/axios/house'
export const useCommonStore = defineStore('common', () => {
  const _rankings = ref([])
  const rankings = computed(() => _rankings.value)

  //검색어 랭킹 검색
  const rankingRefresh = async () => {
    try {
      const response = await houseApi({
        url: 'search/popular',
        method: 'get',
      })
      _rankings.value = response.data.data
    } catch (e) {
      console.log(e)
    }
  }

  return { _rankings, rankings, rankingRefresh }
})
