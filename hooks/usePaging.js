import { computed, ref } from 'vue'
import { PAGINATION } from '@/config/constants.js'

function normalizeListResult(result) {
  const records = result?.list || result?.records || result?.rows || result?.data || []
  const total = Number(result?.total || result?.count || records.length || 0)

  return {
    records: Array.isArray(records) ? records : [],
    total
  }
}

export function usePaging(fetcher, options = {}) {
  const {
    immediate = true,
    pageKey = 'pageNum',
    pageSizeKey = 'pageSize',
    initialPage = PAGINATION.PAGE_NUM,
    initialPageSize = PAGINATION.PAGE_SIZE,
    initialQuery = {},
    emptyText = '暂无数据',
    errorText = '加载失败，请稍后重试',
    showError = true,
    onSuccess,
    onError
  } = options

  const list = ref([])
  const query = ref({ ...initialQuery })
  const pageNum = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const total = ref(0)
  const loading = ref(false)
  const refreshing = ref(false)
  const loadingMore = ref(false)
  const finished = ref(false)
  const error = ref(null)
  const errorMessage = ref('')

  const isEmpty = computed(() => !loading.value && !list.value.length)

  async function requestList(isRefresh = false) {
    if (loading.value || loadingMore.value) {
      return list.value
    }

    if (isRefresh) {
      pageNum.value = initialPage
      finished.value = false
      refreshing.value = true
    } else if (pageNum.value > initialPage) {
      loadingMore.value = true
    } else {
      loading.value = true
    }

    error.value = null

    try {
      const payload = {
        ...query.value,
        [pageKey]: pageNum.value,
        [pageSizeKey]: pageSize.value
      }

      const result = await fetcher(payload)
      const { records, total: nextTotal } = normalizeListResult(result)
      total.value = nextTotal

      if (pageNum.value === initialPage) {
        list.value = records
      } else {
        list.value = [...list.value, ...records]
      }

      if (records.length < pageSize.value || list.value.length >= total.value) {
        finished.value = true
      } else {
        pageNum.value += 1
      }

      errorMessage.value = ''

      if (typeof onSuccess === 'function') {
        onSuccess(result, payload)
      }

      return list.value
    } catch (err) {
      error.value = err
      errorMessage.value = err?.message || errorText

      if (showError && errorMessage.value) {
        uni.showToast({
          title: errorMessage.value,
          icon: 'none'
        })
      }

      if (typeof onError === 'function') {
        onError(err)
      }

      throw err
    } finally {
      loading.value = false
      refreshing.value = false
      loadingMore.value = false
    }
  }

  function search(nextQuery = {}) {
    query.value = {
      ...initialQuery,
      ...nextQuery
    }
    return refresh()
  }

  function refresh() {
    return requestList(true)
  }

  function retry() {
    return requestList(pageNum.value === initialPage && !list.value.length)
  }

  function reload() {
    return refresh()
  }

  function loadMore() {
    if (finished.value || loading.value || loadingMore.value) {
      return Promise.resolve(list.value)
    }

    return requestList(false)
  }

  function reset() {
    query.value = { ...initialQuery }
    list.value = []
    pageNum.value = initialPage
    total.value = 0
    loading.value = false
    refreshing.value = false
    loadingMore.value = false
    finished.value = false
    error.value = null
    errorMessage.value = ''
  }

  if (immediate) {
    requestList(true).catch(() => undefined)
  }

  return {
    list,
    query,
    pageNum,
    pageSize,
    total,
    loading,
    refreshing,
    loadingMore,
    finished,
    error,
    errorMessage,
    isEmpty,
    emptyText,
    search,
    refresh,
    reload,
    retry,
    onRefresh: refresh,
    loadMore,
    onLoadMore: loadMore,
    reset,
    requestList
  }
}

export default usePaging
