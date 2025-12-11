import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useFlowModelStore } from '@/stores/flowModel'
import { useAtomStore } from '@/stores/atom'
import type { FlowModel, Stage, Container, Element, FlowSettings } from '@/api/flowModel'
import type { AtomModal } from '@/api/atom'
import { useEditingPos } from './useEditingPos'
import {
  createDefaultStage,
  createDefaultContainer,
  createDefaultElement,
  generateId,
} from '@/utils/flowDefaults'

import {
  getAtomDefaultValue,
  getAtomOutputObj,
  isNewAtomTemplate,
  diffAtomVersions,
} from '@/utils/atom'
import type { AddAtomEventPayload, AddStageEventPayload, ClickEventPayload } from 'bkui-pipeline'
import { DEFAULT_VERSION } from './useAtomVersion'

export interface UseFlowModelOptions {
  flowId?: string
  version?: string
  autoLoad?: boolean
}

export function useFlowModel(options: UseFlowModelOptions = {}) {
  const { flowId, version, autoLoad = true } = options

  const store = useFlowModelStore()
  const atomStore = useAtomStore()

  // 使用 storeToRefs 确保响应式
  const {
    flowModel,
    yamlContent,
    loading,
    hasError,
    currentFlowId,
    hasUnsavedChanges,
    isFlowEmpty,
    flowSetting,
  } = storeToRefs(store)

  // 统一的位置/索引管理
  const {
    realEditingPos,
    setEditingPos,
    clearEditingPos,
    isEditingStage,
    isEditingJob,
    isEditingPlugin,
  } = useEditingPos()

  // 新建状态标记
  const isNewStage = ref(false)
  const isNewJob = ref(false)

  // 临时存储正在编辑的对象（用于新建时，或者作为编辑时的临时副本）
  const tempEditingObject = ref<Stage | Container | Element | null>(null)

  // 计算属性：Flow 数据（去除触发器 Stage 用于展示）
  const flowModelWithoutTriggerStage = computed(() => {
    if (!flowModel.value) return null
    return {
      ...flowModel.value,
      stages: flowModel.value.stages?.slice(1) || [],
    }
  })

  // 计算属性：是否有 Stage（排除 trigger stage）
  const hasFlowStages = computed(() => {
    return flowModel.value?.stages && flowModel.value?.stages.length > 1
  })

  // 获取当前正在编辑的对象
  const editingStage = computed(() => {
    if (!isEditingStage.value) return null
    if (isNewStage.value) return tempEditingObject.value as Stage
    return flowModel.value?.stages[realEditingPos.value.stageIndex] || null
  })

  const editingContainer = computed(() => {
    if (!isEditingJob.value) return null
    if (isNewJob.value) return tempEditingObject.value as Container
    const { stageIndex, containerIndex } = realEditingPos.value
    if (containerIndex === undefined) return null
    return flowModel.value?.stages[stageIndex]?.containers?.[containerIndex] || null
  })

  const editingElement = computed(() => {
    if (!isEditingPlugin.value) return null
    const { stageIndex, containerIndex, elementIndex } = realEditingPos.value
    return flowModel.value?.stages[stageIndex]?.containers?.[containerIndex!]?.elements?.[
      elementIndex!
    ]
  })

  /**
   * 触发变更事件
   */
  const emitChange = () => {
    if (flowModel.value) {
      store.updateFlowModel(flowModel.value)
    }
  }

  // ========== 基础操作方法 (CRUD) ==========

  const addStage = () => {
    const { stageIndex } = realEditingPos.value
    const newStage = createDefaultStage(stageIndex)
    if (flowModel.value) {
      flowModel.value.stages = [
        ...flowModel.value.stages.slice(0, stageIndex),
        newStage,
        ...flowModel.value.stages.slice(stageIndex),
      ]
      emitChange()
    }
    return newStage
  }

  const updateStage = (stage: Stage) => {
    const { stageIndex } = realEditingPos.value
    if (flowModel.value?.stages[stageIndex]) {
      flowModel.value.stages[stageIndex] = stage
      emitChange()
    }
  }

  const deleteStage = () => {
    const { stageIndex } = realEditingPos.value
    if (flowModel.value?.stages[stageIndex]) {
      flowModel.value.stages.splice(stageIndex, 1)
      emitChange()
    }
  }

  const addJob = () => {
    const { stageIndex, containerIndex } = realEditingPos.value
    const stage = flowModel.value?.stages[stageIndex]
    if (!stage) return

    if (!stage.containers) stage.containers = []
    const newContainer = tempEditingObject.value as Container
    stage.containers = [
      ...stage.containers.slice(0, containerIndex!),
      newContainer,
      ...stage.containers.slice(containerIndex!),
    ]
    emitChange()
    return newContainer
  }

  const updateJob = (container: Partial<Container>) => {
    const { stageIndex, containerIndex } = realEditingPos.value
    const stage = flowModel.value?.stages[stageIndex]
    const currentContainer = stage?.containers?.[containerIndex!]
    if (currentContainer) {
      stage.containers[containerIndex!] = {
        ...currentContainer,
        ...container,
      }
      emitChange()
    }
  }

  const deleteJob = () => {
    const { stageIndex, containerIndex } = realEditingPos.value
    if (containerIndex === undefined) return
    const stage = flowModel.value?.stages[stageIndex]
    if (stage && stage.containers) {
      stage.containers.splice(containerIndex, 1)
      emitChange()
    }
  }

  const addPlugin = () => {
    const { stageIndex, containerIndex, elementIndex } = realEditingPos.value
    const stage = flowModel.value?.stages[stageIndex!]
    const container = stage?.containers?.[containerIndex!]
    if (!container) return

    if (!container.elements) container.elements = []
    const newElement = createDefaultElement(elementIndex!)

    container.elements = [
      ...container.elements.slice(0, elementIndex!),
      newElement,
      ...container.elements.slice(elementIndex!),
    ]

    emitChange()
    return newElement
  }

  const updateAtom = (element: Element) => {
    const { stageIndex, containerIndex, elementIndex } = realEditingPos.value
    const container = flowModel.value?.stages[stageIndex]?.containers?.[containerIndex!]
    if (container && container.elements && elementIndex !== undefined) {
      container.elements[elementIndex] = element
      emitChange()
    }
  }

  const deletePlugin = () => {
    const { stageIndex, containerIndex, elementIndex } = realEditingPos.value
    if (containerIndex === undefined || elementIndex === undefined) return
    const container = flowModel.value?.stages[stageIndex!]?.containers?.[containerIndex!]
    if (container && container.elements) {
      container.elements.splice(elementIndex, 1)
      emitChange()
    }
  }

  // ========== 业务逻辑方法 (Event Handlers) ==========

  /**
   * 处理 Flow 点击事件 (Stage, Job, Plugin)
   */
  const handleFlowClick = (payload: ClickEventPayload) => {
    const { stageIndex = -1, containerIndex, elementIndex, atomIndex } = payload
    // 兼容 atomIndex
    const realElementIndex = elementIndex !== undefined ? elementIndex : atomIndex

    if (stageIndex === -1) return

    // 重置新建状态
    isNewStage.value = false
    isNewJob.value = false
    tempEditingObject.value = null
    if (realElementIndex !== undefined && realElementIndex !== -1 && containerIndex !== undefined) {
      // Click Plugin
      setEditingPos({ stageIndex, containerIndex, elementIndex: realElementIndex })
    } else if (containerIndex !== undefined && containerIndex !== -1) {
      // Click Job
      setEditingPos({ stageIndex, containerIndex })
    } else {
      // Click Stage
      setEditingPos({ stageIndex })
    }
  }

  /**
   * 处理添加 Stage (打开面板)
   */
  const handleAddStage = ({ stageIndex }: AddStageEventPayload) => {
    const newStage = createDefaultStage(stageIndex, { name: `Stage-${stageIndex}` })

    tempEditingObject.value = newStage
    isNewStage.value = true

    setEditingPos({ stageIndex })
  }

  const handleAddFirstStage = () => {
    handleAddStage({ stageIndex: 0 })
  }

  /**
   * 处理 Stage 变更 (属性面板)
   */
  const handleStageChange = (stage: Stage) => {
    // 只在非新建状态下更新模型
    if (!isNewStage.value) {
      updateStage(stage)
    }
    // 更新编辑状态 (如果是新建，更新 temp 对象)
    if (isNewStage.value) {
      tempEditingObject.value = stage
    }
  }

  /**
   * 确认添加/修改 Stage
   */
  const handleStageConfirm = (stage: Stage) => {
    // 使用传入的 stage 进行保存
    if (isNewStage.value) {
      addStage()
    } else {
      updateStage(stage)
    }
    isNewStage.value = false
    tempEditingObject.value = null
    clearEditingPos()
  }

  /**
   * 处理添加 Job (打开面板)
   */
  const handleAddJob = (payload: AddStageEventPayload) => {
    const { stageIndex } = payload
    const stage = flowModel.value?.stages[stageIndex]
    if (!stage) return
    const containerIndex = stage.containers?.length || 0
    const newContainer = createDefaultContainer(containerIndex, {
      name: `Job-${containerIndex + 1}`,
      jobId: generateId('job'),
    })
    setEditingPos({ stageIndex, containerIndex: 0 })
    tempEditingObject.value = newContainer
    isNewJob.value = true
  }

  /**
   * 处理 Job 变更 (属性面板)
   */
  const handleJobChange = (container: Container) => {
    if (!isNewJob.value) {
      updateJob(container)
    }
    if (isNewJob.value) {
      tempEditingObject.value = container
    }
  }

  /**
   * 确认添加/修改 Job
   */
  const handleJobConfirm = (container: Partial<Container>) => {
    if (isNewJob.value) {
      addJob()
    } else {
      updateJob(container)
    }
    isNewJob.value = false
    tempEditingObject.value = null
    clearEditingPos()
  }

  /**
   * 处理添加 Plugin (直接添加占位符并打开面板)
   */
  const handleAddAtom = (payload: AddAtomEventPayload) => {
    const { stageIndex, containerIndex, atomIndex } = payload
    const insertIndex = (atomIndex ?? 0) + 1
    setEditingPos({ stageIndex, containerIndex, elementIndex: insertIndex })
    addPlugin()
  }

  /**
   * 插件选择完成
   */
  const handleAtomSelect = ({
    atomCode,
    version,
    atomModal,
  }: {
    atomCode: string
    version?: string
    atomModal?: AtomModal
  }) => {
    const { stageIndex, containerIndex, elementIndex } = realEditingPos.value
    if (
      !atomModal ||
      stageIndex === -1 ||
      containerIndex === undefined ||
      elementIndex === undefined
    )
      return

    const container = flowModel.value?.stages[stageIndex]?.containers?.[containerIndex]
    const preVerEle = container?.elements?.[elementIndex!]

    const isChangeAtom = !preVerEle || preVerEle.atomCode !== atomCode
    const finalVersion = version || DEFAULT_VERSION
    const htmlTemplateVersion = atomModal.htmlTemplateVersion
    const isNewTemplate = isNewAtomTemplate(htmlTemplateVersion)
    const atomProps = atomModal.props || {}

    let element: Element

    if (isNewTemplate) {
      const preVerData = (preVerEle?.data as any) || {}
      const preVerModelProps: Record<string, any> = {}
      const atomInputProps = (atomProps.input as Record<string, any>) || {}

      const diffRes = diffAtomVersions(
        (preVerData.input as Record<string, any>) || {},
        (preVerModelProps.input as Record<string, any>) || {},
        atomInputProps,
        isChangeAtom,
      )

      const mergedInput = {
        ...getAtomDefaultValue(atomInputProps),
        ...diffRes.atomValue,
      }

      const outputObj = getAtomOutputObj(atomProps.output || {})

      element = createDefaultElement(elementIndex, {
        id: preVerEle?.id || generateId('element'),
        '@type':
          atomModal.classType && atomModal.classType !== atomCode ? atomModal.classType : atomCode,
        atomCode,
        name: isChangeAtom ? atomModal.name : preVerEle.name,
        version: finalVersion,
        classType: atomModal.classType || atomCode,
        data: {
          input: mergedInput,
          output: outputObj,
          namespace: isChangeAtom ? '' : preVerData.namespace || '',
          config: atomProps.config || {},
        } as any,
      })
    } else {
      const preVerModelProps = {}
      const diffRes = diffAtomVersions(
        (preVerEle as Record<string, any>) || {},
        preVerModelProps,
        atomProps,
        isChangeAtom,
      )
      const mergedProps = {
        ...getAtomDefaultValue(atomProps),
        ...diffRes.atomValue,
      }
      element = createDefaultElement(elementIndex, {
        id: preVerEle?.id || generateId('element'),
        '@type':
          atomModal.classType && atomModal.classType !== atomCode ? atomModal.classType : atomCode,
        atomCode,
        version: finalVersion,
        name: isChangeAtom ? atomModal.name : preVerEle.name,
        ...mergedProps,
      })
    }

    if (atomModal.logoUrl) (element as any).logoUrl = atomModal.logoUrl

    atomStore.setAtomModal(atomCode, finalVersion, atomModal)

    updateAtom(element)
    // clearEditingPos()
  }

  // Load/Save/Misc
  const loadFlow = async (id?: string, ver?: string) => {
    const targetFlowId = id || flowId
    if (targetFlowId) await store.loadFlowModel(targetFlowId, ver || version)
  }

  const saveFlow = async (params: Parameters<typeof store.saveFlow>[0]) => {
    return await store.saveFlow(params)
  }

  const updateFlowModel = (model: FlowModel) => {
    store.updateFlowModel(model)
  }

  const updateFlowSetting = (setting: FlowSettings) => {
    store.updateFlowSetting(setting)
  }

  const updateYaml = (yaml: string) => store.updateYamlContent(yaml)
  const reset = () => store.reset()

  onMounted(() => {
    if (autoLoad && flowId) loadFlow()
  })

  return {
    // State
    flowModel,
    flowModelWithoutTriggerStage,
    hasFlowStages,
    yamlContent,
    loading,
    hasError,
    currentFlowId,
    hasUnsavedChanges,
    isFlowEmpty,
    flowSetting,
    // Editing State
    realEditingPos,
    isEditingStage,
    isEditingJob,
    isEditingPlugin,
    isNewStage,
    isNewJob,

    editingStage,
    editingContainer,
    editingElement, // Plugin context

    // Actions
    loadFlow,
    saveFlow,
    updateFlowModel,
    updateFlowSetting,
    updateYaml,
    reset,

    // CRUD
    addStage,
    updateStage,
    deleteStage,
    addJob,
    updateJob,
    deleteJob,
    addPlugin,
    updateAtom,
    deletePlugin,

    // Handlers
    handleFlowClick,
    handleAddStage,
    handleAddFirstStage,
    handleStageChange,
    handleStageConfirm,
    handleAddJob,
    handleJobChange,
    handleJobConfirm,
    handleAddAtom,
    handleAtomSelect,
    // Close handler (simply clear pos)
    handleClosePanel: clearEditingPos,
  }
}
