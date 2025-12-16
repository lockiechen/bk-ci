import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useExecuteDetailStore } from '@/stores/executeDetail'

export type ExecuteInfo = {
  id: string
  name: string
  latestBuildNum: number
  currentBuildNum: number
}
/**
 * NewFlowPopup组件业务逻辑 Hook
 */
export function useExecuteDetail() {
  const store = useExecuteDetailStore()
  const { loading, executeDetail, flowInfo } = storeToRefs(store)

  // 使用 computed 使 executeInfo 响应式更新
  const executeInfo = computed<ExecuteInfo>(() => ({
    id: executeDetail.value?.id || '',
    name: executeDetail.value?.pipelineName || 'stream-ci-demo',
    currentBuildNum: executeDetail.value?.buildNum ?? 1,
    latestBuildNum: executeDetail.value?.latestBuildNum ?? 1,
  }))

  const isRunning = computed(() => {
    const status = executeDetail.value?.status
    return status ? ['RUNNING', 'QUEUE'].indexOf(status) > -1 : false
  })
  const isDebugExec = computed(() => executeDetail.value?.debug ?? false)

  return {
    // Store状态
    loading,
    executeDetail,
    flowInfo,

    // 本地状态
    executeInfo,
    isRunning,
    isDebugExec,

    // 方法
    initExecuteDetail: store.initExecuteDetail,
    stopExecute: store.stopExecute,
    requestRePlayFlow: store.requestRePlayFlow,
    requestRetryFlow: store.requestRetryFlow,
    requestUpdateRemark: store.requestUpdateRemark,
    getStartupParams: store.getStartupParams,
  }
}
