/**
 * 加载状态 Hook
 * 统一管理列表加载、下拉刷新、上拉加载更多等状态
 */

import { ref, computed } from 'vue'
import { PAGINATION } from '@/config/constants.js'

export function useLoading() {
  const loading = ref(false)
  const refreshing = ref(false)
  const loadingMore = ref(false)
  const finished = ref(false)
  const error = ref(false)

  function setLoading(val) {
    loading.value = val
  }

  function setRefreshing(val) {
    refreshing.value = val
  }

  function setLoadingMore(val) {
    loadingMore.value = val
  }

  function setFinished(val) {
    finished.value = val
  }

  function setError(val) {
    error.value = val
  }

  function reset() {
    loading.value = false
    refreshing.value = false
    loadingMore.value = false
    finished.value = false
    error.value = false
  }

  return {
    loading,
    refreshing,
    loadingMore,
    finished,
    error,
    setLoading,
    setRefreshing,
    setLoadingMore,
    setFinished,
    setError,
    reset
  }
}

/**
 * 分页列表 Hook
 * 封装常见的分页列表逻辑
 */
export function usePageList(fetchFn, options = {}) {
  const {
    pageSize = PAGINATION.PAGE_SIZE,
    immediate = true
  } = options

  const list = ref([])
  const pageNum = ref(PAGINATION.PAGE_NUM)
  const total = ref(0)
  const { loading, refreshing, loadingMore, finished, error, reset } = useLoading()

  const isEmpty = computed(() => !loading.value && list.value.length === 0)

  /**
   * 加载数据
   */
  async function loadData(isRefresh = false) {
    if (loading.value || loadingMore.value) return

    try {
      if (isRefresh) {
        refreshing.value = true
        pageNum.value = PAGINATION.PAGE_NUM
        finished.value = false
        error.value = false
      } else if (pageNum.value > PAGINATION.PAGE_NUM) {
        loadingMore.value = true
      } else {
        loading.value = true
      }

      const res = await fetchFn({
        pageNum: pageNum.value,
        pageSize
      })

      // 根据后端返回格式调整
      const records = res.list || res.records || res.data || res || []
      total.value = res.total || 0

      if (isRefresh || pageNum.value === PAGINATION.PAGE_NUM) {
        list.value = records
      } else {
        list.value = [...list.value, ...records]
      }

      // 判断是否加载完毕
      if (records.length < pageSize || list.value.length >= total.value) {
        finished.value = true
      } else {
        pageNum.value++
      }
    } catch (e) {
      error.value = true
      console.error('加载数据失败:', e)
    } finally {
      loading.value = false
      refreshing.value = false
      loadingMore.value = false
    }
  }

  /**
   * 下拉刷新
   */
  function onRefresh() {
    loadData(true)
  }

  /**
   * 上拉加载更多
   */
  function onLoadMore() {
    if (finished.value || loading.value || loadingMore.value) return
    loadData(false)
  }

  // 是否立即加载
  if (immediate) {
    loadData()
  }

  return {
    list,
    pageNum,
    total,
    loading,
    refreshing,
    loadingMore,
    finished,
    error,
    isEmpty,
    loadData,
    onRefresh,
    onLoadMore,
    reset: () => {
      list.value = []
      pageNum.value = PAGINATION.PAGE_NUM
      total.value = 0
      reset()
    }
  }
}
