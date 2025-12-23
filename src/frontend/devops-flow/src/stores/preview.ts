import { fetchFlowInfo } from '@/api/flowInfo'
import {
  fetchPipelineByVersion,
  requestExecPipeline,
  requestStartupInfo,
  type StartupInfo,
  type StartupProperty
} from '@/api/preview'
import type { FlowInfo } from '@/types/flow'
import { allVersionKeyList } from '@/utils/flowConst'
import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'

// ============================================
// 1. Type Definitions
// ============================================

/** Atomic state wrapper with loading and error */
interface AtomicState<T> {
  value: T
  loading: boolean
  error: Error | null
}

/** Pipeline element type */
interface PipelineElement {
  id: string
  additionalOptions?: {
    enable?: boolean
  }
  canElementSkip?: boolean
}

/** Pipeline container type */
interface PipelineContainer {
  jobControlOption?: {
    enable?: boolean
  }
  runContainer?: boolean
  elements?: PipelineElement[]
}

/** Pipeline stage type */
interface PipelineStage {
  stageControlOption?: {
    enable?: boolean
  }
  runStage?: boolean
  containers?: PipelineContainer[]
}

/** Pipeline model type */
interface PipelineModel {
  stages: PipelineStage[]
  [key: string]: unknown
}

/** Processed startup property with additional UI fields */
interface ProcessedProperty extends StartupProperty {
  isChanged?: boolean
  readOnly?: boolean
  label?: string
}

/** Build number configuration */
interface BuildNoConfig {
  required?: boolean
  [key: string]: unknown
}

/** Params value type - key-value pairs */
type ParamsRecord = Record<string, unknown>

/** Skip atoms record type */
type SkipAtomsRecord = Record<string, boolean>

/** Param category type */
type ParamCategory = 'params' | 'versionParam' | 'build' | 'constant' | 'other'

// ============================================
// 2. Pure Utility Functions
// ============================================

/**
 * Check if two values are shallow equal (pure function)
 */
const isShallowEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (typeof a !== 'object' || a === null || b === null) return false
  
  const objA = a as Record<string, unknown>
  const objB = b as Record<string, unknown>
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  
  if (keysA.length !== keysB.length) return false
  
  return keysA.every(key => objA[key] === objB[key])
}

/**
 * Check if value is a plain object (pure function)
 */
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Create params values map from a param list (pure function)
 */
const createParamsValuesMap = (
  paramList: StartupProperty[],
  key: 'value' | 'defaultValue' = 'value',
  existingValues?: ParamsRecord
): ParamsRecord => {
  return paramList.reduce<ParamsRecord>((acc, param) => {
    const hasExisting = existingValues !== undefined && existingValues[param.id] !== undefined
    return {
      ...acc,
      [param.id]: hasExisting ? existingValues[param.id] : param[key]
    }
  }, {})
}

/**
 * Create property label (pure function)
 */
const createPropertyLabel = (id: string, name?: string): string => {
  return name ? `${id}(${name})` : id
}

/**
 * Filter and transform properties to param list (pure function)
 */
const filterToParamList = (
  properties: StartupProperty[],
  predicate: (p: StartupProperty) => boolean,
  transform: (p: StartupProperty) => ProcessedProperty
): ProcessedProperty[] => {
  return properties.filter(predicate).map(transform)
}

/**
 * Extract all elements from stages (pure function)
 */
const extractAllElements = (stages: PipelineStage[]): PipelineElement[] => {
  return stages.flatMap(stage =>
    (stage.containers ?? []).flatMap(container =>
      container.elements ?? []
    )
  )
}

/**
 * Transform stages with skip properties (pure function - creates new objects)
 */
const transformStagesWithSkipProp = (
  stages: PipelineStage[],
  checkedTotal: boolean
): PipelineStage[] => {
  return stages.map(stage => {
    const stageDisabled = stage.stageControlOption?.enable === false
    const runStage = !stageDisabled && checkedTotal

    const containers = stage.containers?.map(container => {
      const containerDisabled = container.jobControlOption?.enable === false
      const runContainer = !containerDisabled && checkedTotal

      const elements = container.elements?.map(element => {
        const isSkipEle = element.additionalOptions?.enable === false || containerDisabled
        return {
          ...element,
          canElementSkip: !isSkipEle && checkedTotal
        }
      })

      return {
        ...container,
        runContainer,
        elements
      }
    })

    return {
      ...stage,
      runStage,
      containers
    }
  })
}

/**
 * Build skipped atoms record from elements (pure function)
 */
const buildSkippedAtomsRecord = (elements: PipelineElement[]): SkipAtomsRecord => {
  return elements
    .filter(element => !element.canElementSkip)
    .reduce<SkipAtomsRecord>((acc, element) => ({
      ...acc,
      [`devops_container_condition_skip_atoms_${element.id}`]: true
    }), {})
}

/**
 * Stringify object params for API (pure function)
 */
const stringifyObjectParams = (params: ParamsRecord): ParamsRecord => {
  return Object.entries(params).reduce<ParamsRecord>((acc, [key, value]) => ({
    ...acc,
    [key]: key !== 'buildNo' && isPlainObject(value) ? JSON.stringify(value) : value
  }), {})
}

// ============================================
// 3. Store Definition
// ============================================

export const usePreviewStore = defineStore('preview', () => {
  // ----------------------------------------
  // 3.1 Atomic Data Layer (Raw API Data)
  // ----------------------------------------
  
  /** Raw startup info from API */
  const atomicStartupInfo = shallowRef<AtomicState<StartupInfo | null>>({
    value: null,
    loading: false,
    error: null
  })

  /** Raw pipeline model from API */
  const atomicPipelineModel = shallowRef<AtomicState<PipelineModel | null>>({
    value: null,
    loading: false,
    error: null
  })

  /** Raw flow info from API */
  const atomicFlowInfo = shallowRef<AtomicState<FlowInfo | null>>({
    value: null,
    loading: false,
    error: null
  })

  /** User-modified param values (mutable by user interaction) */
  const userParamsValues = ref<ParamsRecord>({})
  const userVersionParamValues = ref<ParamsRecord>({})
  const userBuildValues = ref<ParamsRecord>({})
  const userConstantValues = ref<ParamsRecord>({})
  const userOtherValues = ref<ParamsRecord>({})
  const userBuildNo = ref<BuildNoConfig>({})

  /** Pipeline stages with skip state (derived but mutable for UI) */
  const stagesWithSkipState = shallowRef<PipelineStage[]>([])

  /** Execution state */
  const executing = ref(false)

  // ----------------------------------------
  // 3.2 Computed Data Layer (Derived Data)
  // ----------------------------------------

  /** Global loading state */
  const loading = computed(() => 
    atomicStartupInfo.value.loading || 
    atomicPipelineModel.value.loading || 
    atomicFlowInfo.value.loading
  )

  /** Global error state */
  const error = computed(() => 
    atomicStartupInfo.value.error || 
    atomicPipelineModel.value.error || 
    atomicFlowInfo.value.error
  )

  /** Startup info value */
  const startupInfo = computed(() => atomicStartupInfo.value.value)

  /** Raw pipeline model value (without skip state) */
  const rawPipelineModel = computed(() => atomicPipelineModel.value.value)

  /** Pipeline model value (with skip state applied) */
  const pipelineModel = computed(() => {
    const rawModel = rawPipelineModel.value
    if (!rawModel) return null
    
    // Return model with stages that have skip state applied
    return {
      ...rawModel,
      stages: stagesWithSkipState.value.length > 0 
        ? stagesWithSkipState.value 
        : rawModel.stages
    }
  })

  /** Flow info value */
  const flowInfo = computed(() => atomicFlowInfo.value.value)

  /** Whether element skip is allowed */
  const canElementSkip = computed(() => startupInfo.value?.canElementSkip ?? false)

  /** Whether manual startup is allowed */
  const canManualStartup = computed(() => startupInfo.value?.canManualStartup ?? false)

  /** Whether to use last parameters */
  const useLastParams = computed(() => startupInfo.value?.useLatestParameters ?? false)

  /** Build number configuration */
  const buildNo = computed(() => userBuildNo.value)

  /** Whether version is visible */
  const isVisibleVersion = computed(() => userBuildNo.value.required ?? false)

  /** Param key for value extraction */
  const paramValueKey = computed<'value' | 'defaultValue'>(() => 
    useLastParams.value ? 'value' : 'defaultValue'
  )

  /** Filtered param list - required non-constant params */
  const paramList = computed<ProcessedProperty[]>(() => {
    const properties = startupInfo.value?.properties ?? []
    return filterToParamList(
      properties,
      p => !p.constant && p.required && !allVersionKeyList.includes(p.id) && p.propertyType !== 'BUILD',
      p => ({
        ...p,
        isChanged: isPlainObject(p.defaultValue)
          ? !isShallowEqual(p.defaultValue, p.value)
          : p.defaultValue !== p.value,
        readOnly: false,
        label: createPropertyLabel(p.id, p.name)
      })
    )
  })

  /** Filtered version param list */
  const versionParamList = computed<ProcessedProperty[]>(() => {
    const properties = startupInfo.value?.properties ?? []
    return filterToParamList(
      properties,
      p => allVersionKeyList.includes(p.id),
      p => ({
        ...p,
        isChanged: p.defaultValue !== p.value
      })
    )
  })

  /** Filtered build list */
  const buildList = computed<ProcessedProperty[]>(() => {
    const properties = startupInfo.value?.properties ?? []
    return properties.filter(p => p.propertyType === 'BUILD')
  })

  /** Filtered constant params */
  const constantParams = computed<ProcessedProperty[]>(() => {
    const properties = startupInfo.value?.properties ?? []
    return filterToParamList(
      properties,
      p => p.constant,
      p => ({
        ...p,
        label: createPropertyLabel(p.id, p.name)
      })
    )
  })

  /** Filtered other params - non-required, non-constant */
  const otherParams = computed<ProcessedProperty[]>(() => {
    const properties = startupInfo.value?.properties ?? []
    return filterToParamList(
      properties,
      p => !p.constant && !p.required && !allVersionKeyList.includes(p.id) && p.propertyType !== 'BUILD',
      p => ({
        ...p,
        label: createPropertyLabel(p.id, p.name)
      })
    )
  })

  /** Whether has pipeline params */
  const hasPipelineParams = computed(() => {
    if (isVisibleVersion.value) {
      return paramList.value.length + versionParamList.value.length > 0
    }
    return paramList.value.length > 0
  })

  /** Whether has other params */
  const hasOtherParams = computed(() => {
    if (!isVisibleVersion.value) {
      return otherParams.value.length + versionParamList.value.length > 0
    }
    return otherParams.value.length > 0
  })

  /** Combined pipeline params for display */
  const pipelineParams = computed<ProcessedProperty[]>(() => {
    if (isVisibleVersion.value) {
      return [...paramList.value, ...versionParamList.value]
    }
    return paramList.value
  })

  /** Current params values (merged computed defaults with user values) */
  const paramsValues = computed(() => ({
    ...createParamsValuesMap(paramList.value, paramValueKey.value),
    ...userParamsValues.value
  }))

  /** Current version param values */
  const versionParamValues = computed(() => ({
    ...createParamsValuesMap(versionParamList.value, paramValueKey.value),
    ...userVersionParamValues.value
  }))

  /** Current build values */
  const buildValues = computed(() => ({
    ...createParamsValuesMap(buildList.value, paramValueKey.value),
    ...userBuildValues.value
  }))

  /** Current constant values */
  const constantValues = computed(() => ({
    ...createParamsValuesMap(constantParams.value, paramValueKey.value),
    ...userConstantValues.value
  }))

  /** Current other values */
  const otherValues = computed(() => ({
    ...createParamsValuesMap(otherParams.value, paramValueKey.value),
    ...userOtherValues.value
  }))

  /** All elements from current pipeline stages */
  const allElements = computed(() => extractAllElements(stagesWithSkipState.value))

  /** Skipped atoms record for API */
  const skippedAtoms = computed(() => buildSkippedAtomsRecord(allElements.value))

  // ----------------------------------------
  // 3.3 Actions (Data Fetching & Mutations)
  // ----------------------------------------

  /**
   * Set atomic state helper
   */
  const setAtomicState = <T>(
    atomicRef: typeof atomicStartupInfo | typeof atomicPipelineModel | typeof atomicFlowInfo,
    updates: Partial<AtomicState<T>>
  ) => {
    atomicRef.value = {
      ...atomicRef.value,
      ...updates
    } as AtomicState<T>
  }

  /**
   * Initialize params from startup info
   */
  const initParams = (info: StartupInfo, existingValues?: ParamsRecord): boolean => {
    if (!info.canManualStartup) {
      return false
    }

    // Set buildNo immutably
    if (info.buildNo) {
      userBuildNo.value = { ...info.buildNo }
    }

    // Initialize user values from computed defaults
    const key = info.useLatestParameters ? 'value' : 'defaultValue'
    
    userParamsValues.value = createParamsValuesMap(
      info.properties.filter(p => !p.constant && p.required && !allVersionKeyList.includes(p.id) && p.propertyType !== 'BUILD'),
      key,
      existingValues
    )
    
    userVersionParamValues.value = createParamsValuesMap(
      info.properties.filter(p => allVersionKeyList.includes(p.id)),
      key,
      existingValues
    )
    
    userBuildValues.value = createParamsValuesMap(
      info.properties.filter(p => p.propertyType === 'BUILD'),
      key,
      existingValues
    )
    
    userConstantValues.value = createParamsValuesMap(
      info.properties.filter(p => p.constant),
      key,
      existingValues
    )
    
    userOtherValues.value = createParamsValuesMap(
      info.properties.filter(p => !p.constant && !p.required && !allVersionKeyList.includes(p.id) && p.propertyType !== 'BUILD'),
      key,
      existingValues
    )

    return true
  }

  /**
   * Load preview data from API
   */
  const loadPreviewData = async ({
    projectId,
    flowId,
    version,
  }: {
    projectId: string
    flowId: string
    version?: number
  }) => {
    // Set loading states
    setAtomicState(atomicStartupInfo, { loading: true, error: null })
    setAtomicState(atomicPipelineModel, { loading: true, error: null })
    setAtomicState(atomicFlowInfo, { loading: true, error: null })

    try {
      const [infoRes, pipelineRes, flowInfoRes] = await Promise.all([
        requestStartupInfo({ projectId, flowId, version }),
        fetchPipelineByVersion({ projectId, flowId, version }),
        fetchFlowInfo({ projectId, flowId })
      ])

      // Update atomic states immutably
      setAtomicState(atomicStartupInfo, { value: infoRes, loading: false })
      setAtomicState(atomicFlowInfo, { value: flowInfoRes, loading: false })

      // Process pipeline model immutably
      if (pipelineRes?.modelAndSetting?.model) {
        const processedModel: PipelineModel = {
          ...pipelineRes.modelAndSetting.model,
          stages: pipelineRes.modelAndSetting.model.stages.slice(1)
        }
        setAtomicState(atomicPipelineModel, { value: processedModel, loading: false })
        
        // Initialize stages with skip state
        stagesWithSkipState.value = transformStagesWithSkipProp(processedModel.stages, true)
      } else {
        setAtomicState(atomicPipelineModel, { value: null, loading: false })
      }

      // Initialize params
      initParams(infoRes)

      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setAtomicState(atomicStartupInfo, { loading: false, error })
      setAtomicState(atomicPipelineModel, { loading: false, error })
      setAtomicState(atomicFlowInfo, { loading: false, error })
      console.error('Failed to load preview data:', error)
      throw error
    }
  }

  /**
   * Execute the pipeline
   */
  const executePipeline = async ({
    projectId,
    flowId,
    version,
    skipAtoms = {},
  }: {
    projectId: string
    flowId: string
    version?: number
    skipAtoms?: SkipAtomsRecord
  }) => {
    try {
      executing.value = true

      // Collect all param values immutably
      const collectedParams: ParamsRecord = {
        ...paramsValues.value,
        ...versionParamValues.value,
        ...buildValues.value,
        ...constantValues.value,
        ...otherValues.value,
        ...skipAtoms,
      }

      // Stringify object values (pure transformation)
      const processedParams = stringifyObjectParams(collectedParams)

      // Add buildNo if exists
      const finalParams: ParamsRecord = Object.keys(userBuildNo.value).length > 0
        ? { ...processedParams, buildNo: userBuildNo.value }
        : processedParams
      
      const result = await requestExecPipeline({
        projectId,
        flowId,
        version,
        params: finalParams,
      })

      return result
    } finally {
      executing.value = false
    }
  }

  /**
   * Update param value immutably
   */
  const updateParamValue = (category: ParamCategory, key: string, value: unknown): void => {
    const categoryMap: Record<ParamCategory, typeof userParamsValues> = {
      params: userParamsValues,
      versionParam: userVersionParamValues,
      build: userBuildValues,
      constant: userConstantValues,
      other: userOtherValues,
    }

    const target = categoryMap[category]
    if (target) {
      target.value = {
        ...target.value,
        [key]: value
      }
    }
  }

  /**
   * Update buildNo value immutably
   */
  const updateBuildNo = (key: string, value: unknown): void => {
    userBuildNo.value = {
      ...userBuildNo.value,
      [key]: value
    }
  }

  /**
   * Set pipeline skip prop for stages (creates new state)
   * Uses raw pipeline model stages to avoid circular dependency
   */
  const setPipelineSkipProp = (checkedTotal: boolean): void => {
    const rawModel = rawPipelineModel.value
    if (!rawModel?.stages) return
    stagesWithSkipState.value = transformStagesWithSkipProp(rawModel.stages, checkedTotal)
  }

  /**
   * Update pipeline model from external change (e.g., BkPipeline component)
   */
  const updatePipelineFromChange = (newPipeline: PipelineModel): void => {
    if (!newPipeline?.stages) return
    // Update stages with skip state directly from the changed pipeline
    stagesWithSkipState.value = newPipeline.stages
  }

  /**
   * Get all elements from stages (uses computed)
   */
  const getAllElements = (stages: PipelineStage[]): PipelineElement[] => {
    return extractAllElements(stages)
  }

  /**
   * Get skipped atoms (uses computed)
   */
  const getSkippedAtoms = (): SkipAtomsRecord => {
    return skippedAtoms.value
  }

  /**
   * Reset store state immutably
   */
  const $reset = (): void => {
    setAtomicState(atomicStartupInfo, { value: null, loading: false, error: null })
    setAtomicState(atomicPipelineModel, { value: null, loading: false, error: null })
    setAtomicState(atomicFlowInfo, { value: null, loading: false, error: null })
    
    userParamsValues.value = {}
    userVersionParamValues.value = {}
    userBuildValues.value = {}
    userConstantValues.value = {}
    userOtherValues.value = {}
    userBuildNo.value = {}
    stagesWithSkipState.value = []
    executing.value = false
  }

  // ----------------------------------------
  // 3.4 Return Public API
  // ----------------------------------------

  return {
    // Atomic States (for debugging/advanced use)
    atomicStartupInfo,
    atomicPipelineModel,
    atomicFlowInfo,

    // Computed State (read-only)
    loading,
    error,
    executing,
    startupInfo,
    pipelineModel,
    flowInfo,
    paramList,
    versionParamList,
    buildList,
    constantParams,
    otherParams,
    paramsValues,
    versionParamValues,
    buildValues,
    constantValues,
    otherValues,
    buildNo,
    isVisibleVersion,

    // Computed Flags
    canElementSkip,
    canManualStartup,
    useLastParams,
    hasPipelineParams,
    hasOtherParams,
    pipelineParams,
    allElements,
    skippedAtoms,

    // Pipeline Stages State
    stagesWithSkipState,
    rawPipelineModel,

    // Actions
    loadPreviewData,
    executePipeline,
    updateParamValue,
    updateBuildNo,
    initParams,
    setPipelineSkipProp,
    updatePipelineFromChange,
    getAllElements,
    getSkippedAtoms,
    $reset,
  }
})

// Export types for external use
export type {
  AtomicState,
  BuildNoConfig, ParamCategory, ParamsRecord, PipelineContainer, PipelineElement, PipelineModel, PipelineStage, ProcessedProperty, SkipAtomsRecord
}

