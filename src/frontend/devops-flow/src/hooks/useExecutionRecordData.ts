import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import type { ExecutionRecord, ExecutionRecordQueryParams } from '../api/executionRecord'
import { useExecutionRecordStore } from '../stores/executionRecord'

/**
 * Execution record data hook
 * Fetches data from store, processes it, and provides it to components
 */
export function useExecutionRecordData(projectId: string, pipelineId: string, debug = false) {
  const store = useExecutionRecordStore()

  // Use storeToRefs to ensure reactivity
  const { records, pagination, queryParams, loading } =
    storeToRefs(store)

  // Initialize query parameters
  const needsInit = !queryParams.value.projectId || 
    !queryParams.value.pipelineId ||
    queryParams.value.projectId !== projectId ||
    queryParams.value.pipelineId !== pipelineId

  if (needsInit) {
    store.setQueryParams({ projectId, pipelineId, debug })
  }

  // Watch for projectId and pipelineId changes
  watch(
    () => [projectId, pipelineId],
    ([newProjectId, newPipelineId]) => {
      if (newProjectId && newPipelineId) {
        const needsUpdate = queryParams.value.projectId !== newProjectId ||
          queryParams.value.pipelineId !== newPipelineId
        
        if (needsUpdate) {
          store.setQueryParams({ 
            projectId: newProjectId, 
            pipelineId: newPipelineId,
            debug,
          })
          store.loadExecutionRecords(1)
        }
      }
    },
    { immediate: true },
  )

  // Watch query parameter changes and auto-load data
  watch(
    () => [
      queryParams.value.startTime, 
      queryParams.value.endTime, 
      queryParams.value.keyword,
      queryParams.value.status,
      queryParams.value.trigger,
    ],
    () => {
      if (queryParams.value.projectId && queryParams.value.pipelineId) {
        store.loadExecutionRecords(1) // Reset to first page
      }
    },
    { deep: true },
  )

  // Load data when component mounts
  onMounted(() => {
    if (queryParams.value.projectId && queryParams.value.pipelineId && records.value.length === 0 && !loading.value) {
      store.loadExecutionRecords()
    }
  })

  /**
   * Handle page change
   * Now uses server-side pagination
   */
  const handlePageChange = (page: number) => {
    store.setPagination(page)
    store.loadExecutionRecords(page)
  }

  /**
   * Handle page size change
   * Now uses server-side pagination
   */
  const handleLimitChange = (limit: number) => {
    store.setPagination(1, limit)
    store.loadExecutionRecords(1)
  }

  /**
   * Handle select all
   */
  const handleSelectAll = (checked: boolean) => {
    store.toggleSelectAll(checked)
  }

  /**
   * Handle single selection
   */
  const handleSelect = (record: ExecutionRecord, checked: boolean) => {
    store.toggleSelect(record.id, checked)
  }

  /**
   * Update query parameters
   */
  const updateQueryParams = (
    params: Partial<Omit<ExecutionRecordQueryParams, 'page' | 'pageSize' | 'projectId' | 'pipelineId'>>,
  ) => {
    store.setQueryParams(params)
  }

  /**
   * Refresh data
   */
  const refresh = () => {
    store.loadExecutionRecords()
  }

  return {
    // Data
    records,
    pagination,
    loading,
  

    // Methods
    handlePageChange,
    handleLimitChange,
    handleSelectAll,
    handleSelect,
    updateQueryParams,
    refresh,
  }
}
