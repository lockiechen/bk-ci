import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getExecutionRecords,
  type ExecutionRecord,
  type ExecutionRecordQueryParams,
} from '../api/executionRecord'

export const useExecutionRecordStore = defineStore('executionRecord', () => {
  // 执行记录列表
  const records = ref<ExecutionRecord[]>([])

  // 分页信息
  const pagination = ref({
    current: 1,
    count: 0,
    limit: 10,
  })

  // 查询参数
  const queryParams = ref<Omit<ExecutionRecordQueryParams, 'page' | 'limit'>>({
    flowId: '',
    startTime: undefined,
    endTime: undefined,
    keyword: undefined,
  })

  // 加载状态
  const loading = ref(false)

  // 全选状态
  const isAllChecked = computed(() => {
    return records.value.length > 0 && records.value.every((item) => item.checked)
  })

  const isIndeterminate = computed(() => {
    const checkedCount = records.value.filter((item) => item.checked).length
    return checkedCount > 0 && checkedCount < records.value.length
  })

  /**
   * 加载执行记录列表
   */
  async function loadExecutionRecords() {
    if (!queryParams.value.flowId) {
      return
    }

    loading.value = true
    try {
      // 前端分页模式：不需要传递 page 和 limit，返回所有数据让 Table 组件自己处理
      const params: ExecutionRecordQueryParams = {
        ...queryParams.value,
      }

      const response = await getExecutionRecords(params)
      records.value = response.list
      pagination.value.count = response.count
      pagination.value.current = response.page
      pagination.value.limit = response.limit
    } catch (error) {
      console.error('加载执行记录失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 设置查询参数
   */
  function setQueryParams(params: Partial<Omit<ExecutionRecordQueryParams, 'page' | 'limit'>>) {
    queryParams.value = {
      ...queryParams.value,
      ...params,
    }
  }

  /**
   * 设置分页信息
   */
  function setPagination(page: number, limit?: number) {
    pagination.value.current = page
    if (limit !== undefined) {
      pagination.value.limit = limit
    }
  }

  /**
   * 切换全选
   */
  function toggleSelectAll(checked: boolean) {
    records.value.forEach((item) => {
      item.checked = checked
    })
  }

  /**
   * 切换单个选择
   */
  function toggleSelect(recordId: string, checked: boolean) {
    const record = records.value.find((item) => item.id === recordId)
    if (record) {
      record.checked = checked
    }
  }

  /**
   * 重置状态
   */
  function reset() {
    records.value = []
    pagination.value = {
      current: 1,
      count: 0,
      limit: 10,
    }
    queryParams.value = {
      flowId: '',
      startTime: undefined,
      endTime: undefined,
      keyword: undefined,
    }
  }

  return {
    // 状态
    records,
    pagination,
    queryParams,
    loading,
    isAllChecked,
    isIndeterminate,

    // 方法
    loadExecutionRecords,
    setQueryParams,
    setPagination,
    toggleSelectAll,
    toggleSelect,
    reset,
  }
})
