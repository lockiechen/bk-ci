import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getFlowModel,
  saveFlowModel,
  flowModelToYaml,
  yamlToFlowModel,
  type FlowModel,
  type SaveFlowModelParams,
  type FlowSettings,
} from '@/api/flowModel'

/**
 * 创作流模型状态管理
 */
export const useFlowModelStore = defineStore('flowModel', () => {
  // Flow 模型数据
  const flowModel = ref<FlowModel | null>(null)
  const flowSetting = ref<FlowSettings | null>(null)

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
   * 计算属性：Flow 是否为空
   */
  const isFlowEmpty = computed(() => {
    return !flowModel.value || flowModel.value.stages.length === 0
  })

  /**
   * 加载 Flow 模型数据
   * @param flowId 创作流 ID
   * @param version 版本号（可选）
   */
  async function loadFlowModel(flowId: string, version?: string) {
    loading.value = true
    hasError.value = false
    currentFlowId.value = flowId

    try {
      const model = await getFlowModel(flowId, version)
      flowModel.value = model.modelAndSetting.model
      flowSetting.value = model.modelAndSetting.setting
      yamlContent.value = model.yamlPreview.yaml
      hasUnsavedChanges.value = false
    } catch (error) {
      console.error('Failed to load flow model:', error)
      hasError.value = true
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新 Flow 模型数据
   * @param model 新的 Flow 模型
   */
  function updateFlowModel(model: FlowModel) {
    flowModel.value = model
    yamlContent.value = flowModelToYaml(model)
    hasUnsavedChanges.value = true
  }

  function updateFlowSetting(setting: FlowSettings) {
    flowSetting.value = setting
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
      const model = yamlToFlowModel(yaml)
      flowModel.value = model
      hasError.value = false
    } catch (error) {
      console.error('Failed to parse YAML:', error)
      hasError.value = true
    }
  }

  /**
   * 保存 Flow 模型
   * @param params 保存参数（包含projectId等）
   */
  async function saveFlow(params: SaveFlowModelParams) {
    if (!flowModel.value) {
      throw new Error('No flow model')
    }

    loading.value = true

    try {
      const saveParams: SaveFlowModelParams = {
        ...params,
        modelAndSetting: {
          model: flowModel.value,
          setting: flowSetting.value!,
        },
        storageType: params.storageType || 'MODEL',
      }

      const response = await saveFlowModel(saveParams)
      hasUnsavedChanges.value = false
      return response
    } catch (error) {
      console.error('Failed to save flow model:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 重置状态
   */
  function reset() {
    flowModel.value = null
    yamlContent.value = ''
    flowSetting.value = null
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
    flowModel,
    flowSetting,
    yamlContent,
    loading,
    hasError,
    currentFlowId,
    hasUnsavedChanges,

    // 计算属性
    isFlowEmpty,

    // 方法
    loadFlowModel,
    updateFlowModel,
    updateFlowSetting,
    updateYamlContent,
    saveFlow,
    reset,
    setHasError,
  }
})
