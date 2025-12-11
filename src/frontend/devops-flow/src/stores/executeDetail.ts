import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { fetchFlowInfo, updateRemark } from '@/api/flowInfo'
import type { ExecuteDetailData, FlowInfo } from '@/types/flow'
import {
  replayFlow,
  requestPipelineExecDetail,
  requestTerminatePipeline,
  retryFlow,
} from '@/api/executeDetail'

export const useExecuteDetailStore = defineStore('executeDetail', () => {
  const route = useRoute()
  const flowId = ref(route.params.flowId as string)
  const projectId = ref(route.params.projectId as string)
  const buildNo = ref(route.params.buildNo as string)

  const loading = ref(false)
  const executeDetail = ref<ExecuteDetailData | null>(null)
  const flowInfo = ref<FlowInfo | null>(null)

  async function getExecuteDetail() {
    // TODO: 从路由参数获取实际值
    const params = {
      projectId: projectId.value,
      buildNo: buildNo.value,
      flowId: flowId.value,
    }
    return await requestPipelineExecDetail(params)
  }

  async function getFlowInfoDetail() {
    // TODO: 从路由参数获取实际值
    return await fetchFlowInfo({
      projectId: projectId.value,
      flowId: flowId.value,
    })
  }

  async function initExecuteDetail() {
    try {
      loading.value = true
      const [executeRes, flowInfoRes] = await Promise.all([getExecuteDetail(), getFlowInfoDetail()])

      executeDetail.value = executeRes
      flowInfo.value = flowInfoRes
    } catch (error) {
      console.error('Failed to fetch execute detail:', error)
      executeDetail.value = null
      flowInfo.value = null
    } finally {
      loading.value = false
    }
  }

  /**
   *  终止流水线
   */
  async function stopExecute(buildId: string) {
    try {
      // TODO: 从路由参数获取实际值
      const res = await requestTerminatePipeline({
        projectId: projectId.value,
        flowId: flowId.value,
        buildId: buildId,
      })
      return res
    } catch (error) {
      console.log('Failed to stoperror:', error)
    }
  }

  /**
   * 重试创作流retryFlow
   */
  async function requestRetryFlow({
    projectId,
    flowId,
    buildId,
    taskId,
    failedContainer,
    skip,
  }: {
    projectId: string
    flowId: string
    buildId: string
    taskId?: string
    failedContainer?: string
    skip?: boolean
  }) {
    try {
      const params = {
        projectId,
        flowId,
        buildId,
        taskId,
        failedContainer,
        skip,
      }
      return await retryFlow(params)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 重放创作流
   */
  async function requestRePlayFlow({
    projectId,
    flowId,
    buildId,
    forceTrigger,
  }: {
    projectId: string
    flowId: string
    buildId: string
    forceTrigger?: boolean
  }) {
    try {
      const params = {
        projectId,
        flowId,
        buildId,
        forceTrigger,
      }
      return await replayFlow(params)
    } catch (error) {
      console.log(error)
    }
  }

  async function requestUpdateRemark({
    projectId,
    flowId,
    buildId,
    remark,
  }: {
    projectId: string
    flowId: string
    buildId: string
    remark: string
  }) {
    try {
      return await updateRemark({
        projectId,
        flowId,
        buildId,
        remark,
      })
    } catch (error) {}
  }
  return {
    loading,
    executeDetail,
    flowInfo,

    initExecuteDetail,
    stopExecute,
    requestRePlayFlow,
    requestRetryFlow,
    requestUpdateRemark,
  }
})
