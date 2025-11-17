import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getPipelineModel,
  savePipelineModel,
  pipelineModelToYaml,
  yamlToPipelineModel,
  type PipelineModel,
} from '@/api/flowModel'

/**
 * 创作流模型状态管理
 */
export const useFlowModelStore = defineStore('flowModel', () => {
  // Pipeline 模型数据
  const pipelineModel = ref<PipelineModel | null>(null)

  // YAML 格式的代码内容
  const yamlContent = ref<string>('')

  // 加载状态
  const loading = ref(false)

  // 错误状态
  const hasError = ref(false)

  // 当前创作流 ID
  const currentFlowId = ref<string>('')

  // 是否有未保存的更改
  const hasUnsavedChanges = ref(false)

  /**
   * 计算属性：Pipeline 是否为空
   */
  const isPipelineEmpty = computed(() => {
    return !pipelineModel.value || pipelineModel.value.stages.length === 0
  })

  /**
   * 加载 Pipeline 模型数据
   * @param flowId 创作流 ID
   * @param version 版本号（可选）
   */
  async function loadPipelineModel(flowId: string, version?: string) {
    loading.value = true
    hasError.value = false
    currentFlowId.value = flowId

    try {
      const model = await getPipelineModel(flowId, version)
      pipelineModel.value = model
      yamlContent.value = pipelineModelToYaml(model)
      hasUnsavedChanges.value = false
    } catch (error) {
      console.error('Failed to load pipeline model:', error)
      hasError.value = true
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新 Pipeline 模型数据
   * @param model 新的 Pipeline 模型
   */
  function updatePipelineModel(model: PipelineModel) {
    pipelineModel.value = model
    yamlContent.value = pipelineModelToYaml(model)
    hasUnsavedChanges.value = true
  }

  /**
   * 更新 YAML 内容
   * @param yaml YAML 字符串
   */
  function updateYamlContent(yaml: string) {
    yamlContent.value = yaml
    hasUnsavedChanges.value = true

    try {
      const model = yamlToPipelineModel(yaml)
      pipelineModel.value = model
      hasError.value = false
    } catch (error) {
      console.error('Failed to parse YAML:', error)
      hasError.value = true
    }
  }

  /**
   * 保存 Pipeline 模型
   */
  async function savePipeline() {
    if (!pipelineModel.value || !currentFlowId.value) {
      throw new Error('No pipeline model or flow ID')
    }

    loading.value = true

    try {
      await savePipelineModel(currentFlowId.value, pipelineModel.value)
      hasUnsavedChanges.value = false
    } catch (error) {
      console.error('Failed to save pipeline model:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 重置状态
   */
  function reset() {
    pipelineModel.value = null
    yamlContent.value = ''
    loading.value = false
    hasError.value = false
    currentFlowId.value = ''
    hasUnsavedChanges.value = false
  }

  /**
   * 设置错误状态
   * @param error 是否有错误
   */
  function setHasError(error: boolean) {
    hasError.value = error
  }

  return {
    // 状态
    pipelineModel,
    yamlContent,
    loading,
    hasError,
    currentFlowId,
    hasUnsavedChanges,

    // 计算属性
    isPipelineEmpty,

    // 方法
    loadPipelineModel,
    updatePipelineModel,
    updateYamlContent,
    savePipeline,
    reset,
    setHasError,
  }
})
