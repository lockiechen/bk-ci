import { computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useExecutionRecordStore } from '../stores/executionRecord'
import type { ExecutionRecordQueryParams, ExecutionRecord } from '../api/executionRecord'

/**
 * 执行记录数据 Hook
 * 从 store 获取数据，进行二次加工，提供给组件使用
 */
export function useExecutionRecordData(flowId: string) {
  const store = useExecutionRecordStore()

  // 使用 storeToRefs 确保响应式
  const { records, pagination, queryParams, loading, isAllChecked, isIndeterminate } =
    storeToRefs(store)

  // 初始化查询参数
  if (!queryParams.value.flowId || queryParams.value.flowId !== flowId) {
    store.setQueryParams({ flowId })
  }

  // 监听 flowId 变化
  watch(
    () => flowId,
    (newFlowId) => {
      if (newFlowId && queryParams.value.flowId !== newFlowId) {
        store.setQueryParams({ flowId: newFlowId })
        store.loadExecutionRecords()
      }
    },
    { immediate: true },
  )

  // 监听查询参数变化，自动加载数据
  watch(
    () => [queryParams.value.startTime, queryParams.value.endTime, queryParams.value.keyword],
    () => {
      if (queryParams.value.flowId) {
        store.setPagination(1) // 重置到第一页
        store.loadExecutionRecords()
      }
    },
    { deep: true },
  )

  // 组件挂载时加载数据
  onMounted(() => {
    if (queryParams.value.flowId && records.value.length === 0 && !loading.value) {
      store.loadExecutionRecords()
    }
  })

  /**
   * 处理分页变化
   * Table 组件支持前端分页，只需要更新分页状态，不需要重新加载数据
   */
  const handlePageChange = (page: number) => {
    store.setPagination(page)
    // 前端分页不需要重新加载数据，Table 组件会自动处理
  }

  /**
   * 处理每页条数变化
   * Table 组件支持前端分页，只需要更新分页状态，不需要重新加载数据
   */
  const handleLimitChange = (limit: number) => {
    store.setPagination(1, limit)
    // 前端分页不需要重新加载数据，Table 组件会自动处理
  }

  /**
   * 处理全选
   */
  const handleSelectAll = (checked: boolean) => {
    store.toggleSelectAll(checked)
  }

  /**
   * 处理单个选择
   */
  const handleSelect = (record: ExecutionRecord, checked: boolean) => {
    store.toggleSelect(record.id, checked)
  }

  /**
   * 更新查询参数
   */
  const updateQueryParams = (
    params: Partial<Omit<ExecutionRecordQueryParams, 'page' | 'limit' | 'flowId'>>,
  ) => {
    store.setQueryParams(params)
  }

  return {
    // 数据
    records,
    pagination,
    loading,
    isAllChecked,
    isIndeterminate,

    // 方法
    handlePageChange,
    handleLimitChange,
    handleSelectAll,
    handleSelect,
    updateQueryParams,
    refresh: store.loadExecutionRecords,
  }
}
