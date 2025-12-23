import type { StartupProperty } from '@/api/preview'
import { ROUTE_NAMES } from '@/constants/routes'
import { usePreviewStore } from '@/stores'
import { Message } from 'bkui-vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

// ============================================
// 1. Type Definitions
// ============================================

/** Param type for form handling */
export type ParamType = 'params' | 'versionParam' | 'build' | 'constant' | 'other'

/** Section IDs for collapsible sections */
export type SectionId = 1 | 2 | 3 | 4 | 5

/** Atoms count result */
interface AtomsCount {
  selected: number
  total: number
}

/** UsePreview options */
interface UsePreviewOptions {
  /** Auto load data on mount */
  autoLoad?: boolean
  /** Default expanded sections */
  defaultExpandedSections?: SectionId[]
}

/** UsePreview return type */
interface UsePreviewReturn {
  // Route params
  projectId: ReturnType<typeof computed<string>>
  flowId: ReturnType<typeof computed<string>>
  version: ReturnType<typeof computed<number | undefined>>
  isDebugMode: ReturnType<typeof computed<boolean>>

  // UI State
  activeSections: ReturnType<typeof ref<Set<SectionId>>>
  checkAll: ReturnType<typeof ref<boolean>>
  selectedNode: ReturnType<typeof ref<string>>
  runMessage: ReturnType<typeof ref<string>>

  // Grouped params (computed)
  groupedParams: ReturnType<typeof computed<Record<string, StartupProperty[]>>>
  groupedConstants: ReturnType<typeof computed<Record<string, StartupProperty[]>>>
  groupedOtherParams: ReturnType<typeof computed<Record<string, StartupProperty[]>>>
  hasGroupedParams: ReturnType<typeof computed<boolean>>
  hasGroupedConstants: ReturnType<typeof computed<boolean>>
  hasGroupedOtherParams: ReturnType<typeof computed<boolean>>

  // Atoms count (computed)
  selectedAtomsCount: ReturnType<typeof computed<AtomsCount>>

  // Store getters
  store: ReturnType<typeof usePreviewStore>

  // Actions
  toggleSection: (id: SectionId) => void
  isSectionExpanded: (id: SectionId) => boolean
  handleParamChange: (type: ParamType, key: string, value: unknown) => void
  handleBuildNoChange: (key: string, value: unknown) => void
  handleCheckAllChange: (checked: boolean) => void
  handlePipelineChange: (newPipeline: unknown) => void
  handleResetDefault: (e?: Event) => void
  handleSaveCurrentParams: (e?: Event) => void
  handleVersionChange: (newVersion: number) => void
  handleExecute: () => Promise<void>
  loadData: (ver?: number) => Promise<void>
}

// ============================================
// 2. Pure Utility Functions
// ============================================

/**
 * Group params by category field (pure function)
 */
export const groupParamsByCategory = (
  list: StartupProperty[],
  notGroupedKey = '未分组'
): Record<string, StartupProperty[]> => {
  if (!list.length) return {}
  
  return list.reduce<Record<string, StartupProperty[]>>((acc, item) => {
    const categoryKey = item.category || notGroupedKey
    return {
      ...acc,
      [categoryKey]: [...(acc[categoryKey] || []), item]
    }
  }, {})
}

/**
 * Calculate selected atoms count from pipeline model (pure function)
 */
export const calculateAtomsCount = (stages: unknown[] | undefined): AtomsCount => {
  if (!stages) return { selected: 0, total: 0 }

  return stages.reduce<AtomsCount>((acc, stage: any) => {
    const containers = stage.containers || []
    const stageCount = containers.reduce((containerAcc: AtomsCount, container: any) => {
      const elements = container.elements || []
      const elementCount = elements.reduce((elemAcc: AtomsCount, element: any) => ({
        total: elemAcc.total + 1,
        selected: elemAcc.selected + (element.canElementSkip !== false ? 1 : 0)
      }), { selected: 0, total: 0 })
      
      return {
        total: containerAcc.total + elementCount.total,
        selected: containerAcc.selected + elementCount.selected
      }
    }, { selected: 0, total: 0 })

    return {
      total: acc.total + stageCount.total,
      selected: acc.selected + stageCount.selected
    }
  }, { selected: 0, total: 0 })
}

/**
 * Create immutable set toggle (pure function)
 */
export const toggleSetItem = <T>(set: Set<T>, item: T): Set<T> => {
  const newSet = new Set(set)
  if (newSet.has(item)) {
    newSet.delete(item)
  } else {
    newSet.add(item)
  }
  return newSet
}

// ============================================
// 3. Composable Definition
// ============================================

/**
 * Preview composable hook
 * Encapsulates all preview business logic with immutable data flow
 */
export const usePreview = (options: UsePreviewOptions = {}): UsePreviewReturn => {
  const {
    autoLoad = true,
    defaultExpandedSections = [1, 2, 3, 4, 5]
  } = options

  // ----------------------------------------
  // 3.1 Dependencies
  // ----------------------------------------
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const store = usePreviewStore()

  // ----------------------------------------
  // 3.2 Route Params (Computed)
  // ----------------------------------------
  const projectId = computed(() => route.params.projectId as string)
  const flowId = computed(() => route.params.flowId as string)
  const version = computed(() => {
    const v = route.params.version
    return v ? Number(v) : undefined
  })
  const isDebugMode = computed(() => 
    Object.prototype.hasOwnProperty.call(route.query, 'debug')
  )

  // ----------------------------------------
  // 3.3 Local UI State
  // ----------------------------------------
  const activeSections = ref<Set<SectionId>>(new Set(defaultExpandedSections as SectionId[]))
  const checkAll = ref(true)
  const selectedNode = ref('')
  const runMessage = ref('')

  // ----------------------------------------
  // 3.4 Computed Data Layer (Derived from Store)
  // ----------------------------------------
  const groupedParams = computed(() => 
    groupParamsByCategory(store.paramList, '未分组入参')
  )

  const groupedConstants = computed(() => 
    groupParamsByCategory(store.constantParams, '未分组常量')
  )

  const groupedOtherParams = computed(() => 
    groupParamsByCategory(store.otherParams, '未分组变量')
  )

  const hasGroupedParams = computed(() => 
    Object.keys(groupedParams.value).length > 0
  )

  const hasGroupedConstants = computed(() => 
    Object.keys(groupedConstants.value).length > 0
  )

  const hasGroupedOtherParams = computed(() => 
    Object.keys(groupedOtherParams.value).length > 0
  )

  const selectedAtomsCount = computed(() => 
    calculateAtomsCount(store.pipelineModel?.stages)
  )

  // ----------------------------------------
  // 3.5 UI Actions (Pure, No Side Effects)
  // ----------------------------------------
  
  /**
   * Toggle section collapse state (immutable)
   */
  const toggleSection = (id: SectionId): void => {
    activeSections.value = toggleSetItem(activeSections.value, id)
  }

  /**
   * Check if section is expanded
   */
  const isSectionExpanded = (id: SectionId): boolean => {
    return activeSections.value.has(id)
  }

  // ----------------------------------------
  // 3.6 Store Actions (Delegated to Store)
  // ----------------------------------------
  
  /**
   * Handle param value change
   */
  const handleParamChange = (type: ParamType, key: string, value: unknown): void => {
    store.updateParamValue(type, key, value)
  }

  /**
   * Handle buildNo value change
   */
  const handleBuildNoChange = (key: string, value: unknown): void => {
    store.updateBuildNo(key, value)
  }

  /**
   * Handle check all change for element skip
   */
  const handleCheckAllChange = (checked: boolean): void => {
    checkAll.value = checked
    store.setPipelineSkipProp(checked)
  }

  /**
   * Handle pipeline change from BkPipeline component
   */
  const handlePipelineChange = (newPipeline: unknown): void => {
    store.updatePipelineFromChange(newPipeline as any)
    // Update checkAll state based on new pipeline state
    const count = calculateAtomsCount((newPipeline as any)?.stages)
    checkAll.value = count.total > 0 && count.selected === count.total
  }

  /**
   * Handle reset to default params
   */
  const handleResetDefault = (e?: Event): void => {
    e?.stopPropagation()
    
    // Reset each param to its default value (immutable updates via store)
    store.paramList.forEach(param => {
      store.updateParamValue('params', param.id, param.defaultValue)
    })
    
    Message({
      theme: 'success',
      message: t('flow.preview.resetSuccess'),
    })
  }

  /**
   * Handle save current params
   */
  const handleSaveCurrentParams = (e?: Event): void => {
    e?.stopPropagation()
    // TODO: Implement save current params API
    Message({
      theme: 'success',
      message: t('flow.common.success'),
    })
  }

  /**
   * Handle version change
   */
  const handleVersionChange = (newVersion: number): void => {
    loadData(newVersion)
  }

  // ----------------------------------------
  // 3.7 Data Fetching (Async Actions)
  // ----------------------------------------
  
  /**
   * Load preview data from API
   */
  const loadData = async (ver?: number): Promise<void> => {
    try {
      await store.loadPreviewData({
        projectId: projectId.value,
        flowId: flowId.value,
        version: ver ?? version.value,
      })

      // Set pipeline skip props after loading
      store.setPipelineSkipProp(checkAll.value)

      // Check if can manual startup
      if (!store.startupInfo?.canManualStartup) {
        Message({
          theme: 'error',
          message: t('flow.preview.cannotManualStartup'),
        })
      }
    } catch (error: unknown) {
      console.error('Failed to load preview data:', error)
      Message({
        theme: 'error',
        message: (error as Error)?.message || t('flow.preview.loadFailed'),
      })
      router.back()
    }
  }

  /**
   * Execute the pipeline
   */
  const handleExecute = async (): Promise<void> => {
    try {
      const skipAtoms = store.canElementSkip ? store.getSkippedAtoms() : {}
      
      const result = await store.executePipeline({
        projectId: projectId.value,
        flowId: flowId.value,
        version: isDebugMode.value ? store.flowInfo?.version : version.value,
        skipAtoms,
      })

      if (result?.id) {
        Message({
          theme: 'success',
          message: t('flow.preview.executeSuccess'),
        })

        // Navigate to execution detail
        router.push({
          name: ROUTE_NAMES.FLOW_DETAIL_EXECUTION_DETAIL_TAB,
          params: {
            projectId: projectId.value,
            flowId: flowId.value,
            buildNo: result.id,
          },
        })
      } else {
        Message({
          theme: 'error',
          message: t('flow.preview.executeFailed'),
        })
      }
    } catch (error: unknown) {
      console.error('Failed to execute pipeline:', error)
      Message({
        theme: 'error',
        message: (error as Error)?.message || t('flow.preview.executeFailed'),
      })
    }
  }

  // ----------------------------------------
  // 3.8 Lifecycle & Watchers
  // ----------------------------------------
  
  // Watch version change to reload data
  watch(version, () => {
    if (autoLoad) {
      loadData()
    }
  })

  // Load data on mount
  onMounted(() => {
    if (autoLoad) {
      loadData()
    }
  })

  // Clean up on unmount
  onBeforeUnmount(() => {
    store.$reset()
  })

  // ----------------------------------------
  // 3.9 Return Public API
  // ----------------------------------------
  return {
    // Route params
    projectId,
    flowId,
    version,
    isDebugMode,

    // UI State
    activeSections,
    checkAll,
    selectedNode,
    runMessage,

    // Grouped params
    groupedParams,
    groupedConstants,
    groupedOtherParams,
    hasGroupedParams,
    hasGroupedConstants,
    hasGroupedOtherParams,

    // Atoms count
    selectedAtomsCount,

    // Store access
    store,

    // Actions
    toggleSection,
    isSectionExpanded,
    handleParamChange,
    handleBuildNoChange,
    handleCheckAllChange,
    handlePipelineChange,
    handleResetDefault,
    handleSaveCurrentParams,
    handleVersionChange,
    handleExecute,
    loadData,
  }
}

// Export types
export type { AtomsCount, UsePreviewOptions, UsePreviewReturn }

