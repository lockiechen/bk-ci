import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import type { FlowInfo, FlowVersion } from '@/types/flow'
import * as apiFlowInfo from '@/api/flowInfo'
import { useRoute } from 'vue-router'

export const useFlowInfoStore = defineStore('flowInfo', () => {
  const route = useRoute()
  const projectId = ref<string>(route.params.projectId as string)
  const flowId = ref<string>(route.params.flowId as string)
  const flowVersionList = ref<FlowVersion[] | null>([])

  const flowInfo = ref<FlowInfo | null>(null)
  const loading = ref<boolean>(false)

  async function getFlowInfo() {
    loading.value = true
    try {
      const res = await apiFlowInfo.fetchFlowInfo({
        projectId: projectId.value,
        flowId: flowId.value,
      })
      flowInfo.value = res
    } catch (error) {
      console.error('Failed to get flow info:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  async function getFlowVersionList() {
    loading.value = true
    try {
      const res = await apiFlowInfo.getFlowVersionList({
        projectId: projectId.value,
        flowId: flowId.value,
      })
      flowVersionList.value = res
    } finally {
      loading.value = false
    }
  }

  function initFlowInfo() {
    getFlowInfo()
    getFlowVersionList()
  }

  onMounted(() => {
    initFlowInfo()
  })

  return {
    flowInfo,
    flowVersionList,
    loading,

    getFlowInfo,
    initFlowInfo,
  }
})
