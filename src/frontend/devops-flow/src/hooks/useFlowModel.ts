import { computed, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useFlowModelStore } from '@/stores/flowModel'
import type { PipelineModel } from '@/api/flowModel'

/**
 * 创作流模型数据 Hook
 * 从 store 获取数据，进行二次加工，提供给组件使用
 */
export interface UseFlowModelOptions {
  flowId?: string
  version?: string
  autoLoad?: boolean
}

export function useFlowModel(options: UseFlowModelOptions = {}) {
  const { flowId, version, autoLoad = true } = options

  const store = useFlowModelStore()

  // 使用 storeToRefs 确保响应式
  const {
    pipelineModel,
    yamlContent,
    loading,
    hasError,
    currentFlowId,
    hasUnsavedChanges,
    isPipelineEmpty,
  } = storeToRefs(store)

  /**
   * 加载 Pipeline 数据
   */
  const loadPipeline = async (id?: string, ver?: string) => {
    const targetFlowId = id || flowId
    if (!targetFlowId) {
      console.warn('No flow ID provided')
      return
    }

    try {
      await store.loadPipelineModel(targetFlowId, ver || version)
    } catch (error) {
      console.error('Failed to load pipeline:', error)
    }
  }

  /**
   * 更新 Pipeline 模型
   */
  const updatePipeline = (model: PipelineModel) => {
    store.updatePipelineModel(model)
  }

  /**
   * 更新 YAML 内容
   */
  const updateYaml = (yaml: string) => {
    store.updateYamlContent(yaml)
  }

  /**
   * 保存 Pipeline
   */
  const savePipeline = async () => {
    try {
      await store.savePipeline()
    } catch (error) {
      console.error('Failed to save pipeline:', error)
      throw error
    }
  }

  /**
   * 重置状态
   */
  const reset = () => {
    store.reset()
  }

  /**
   * 设置错误状态
   */
  const setError = (error: boolean) => {
    store.setHasError(error)
  }

  /**
   * 计算属性：是否可以保存
   */
  const canSave = computed(() => {
    return hasUnsavedChanges.value && !hasError.value && !loading.value
  })

  /**
   * 计算属性：Pipeline 名称
   */
  const pipelineName = computed(() => {
    return pipelineModel.value?.name || ''
  })

  /**
   * 计算属性：Pipeline 描述
   */
  const pipelineDesc = computed(() => {
    return pipelineModel.value?.desc || ''
  })

  /**
   * 计算属性：Stage 数量
   */
  const stageCount = computed(() => {
    return pipelineModel.value?.stages.length || 0
  })

  /**
   * 组件挂载时自动加载数据
   */
  onMounted(() => {
    if (autoLoad && flowId) {
      loadPipeline()
    }
  })

  /**
   * 组件卸载前检查未保存的更改
   */
  onBeforeUnmount(() => {
    if (hasUnsavedChanges.value) {
      console.warn('There are unsaved changes')
      // 可以在这里添加提示用户保存的逻辑
    }
  })

  return {
    // 原始数据（使用 storeToRefs 确保响应式）
    pipelineModel,
    yamlContent,
    loading,
    hasError,
    currentFlowId,
    hasUnsavedChanges,
    isPipelineEmpty,

    // 计算属性
    canSave,
    pipelineName,
    pipelineDesc,
    stageCount,

    // 操作方法
    loadPipeline,
    updatePipeline,
    updateYaml,
    savePipeline,
    reset,
    setError,
  }
}
