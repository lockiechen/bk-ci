import { DefineComponent, Plugin } from 'vue'

/**
 * Pipeline Stage Container Interface
 */
export interface PipelineContainer {
  '@type'?: string
  [key: string]: any
}

/**
 * Pipeline Stage Interface
 */
export interface PipelineStage {
  id: string
  name: string
  containers: PipelineContainer[]
  finally?: boolean
  [key: string]: any
}

/**
 * Pipeline Model Interface
 */
export interface PipelineModel {
  stages: PipelineStage[]
  [key: string]: any
}

/**
 * Match Rule Interface
 */
export interface MatchRule {
  [key: string]: any
}

/**
 * BkPipeline Component Props
 */
export interface BkPipelineProps {
  /**
   * Whether the pipeline is editable
   * @default true
   */
  editable?: boolean

  /**
   * Whether in preview mode
   * @default false
   */
  isPreview?: boolean

  /**
   * Current execution count
   * @default 1
   */
  currentExecCount?: number

  /**
   * Whether in execution detail mode
   * @default false
   */
  isExecDetail?: boolean

  /**
   * Whether this is the latest build
   * @default false
   */
  isLatestBuild?: boolean

  /**
   * Whether elements can be skipped
   * @default false
   */
  canSkipElement?: boolean

  /**
   * Pipeline model data (required)
   */
  pipeline: PipelineModel

  /**
   * User ID who cancelled the pipeline
   * @default "unknow"
   */
  cancelUserId?: string

  /**
   * Current user name
   * @default "unknow"
   */
  userName?: string

  /**
   * Match rules array
   * @default []
   */
  matchRules?: MatchRule[]

  /**
   * Whether to expand all matrix by default
   * @default true
   */
  isExpandAllMatrix?: boolean
}

/**
 * BkPipeline Component Exposed Methods
 */
export interface BkPipelineExpose {
  /**
   * Expand post action for a specific stage/container
   * @param stageId - Stage ID
   * @param matrixId - Optional matrix ID
   * @param containerId - Optional container ID
   * @returns Promise that resolves to true if successful
   */
  expandPostAction: (
    stageId: string,
    matrixId?: string,
    containerId?: string
  ) => Promise<boolean>

  /**
   * Expand or collapse a matrix
   * @param stageId - Stage ID
   * @param matrixId - Matrix ID
   * @param containerId - Container ID
   * @param expand - Whether to expand (default: true)
   * @returns Promise that resolves to true if successful
   */
  expandMatrix: (
    stageId: string,
    matrixId: string,
    containerId: string,
    expand?: boolean
  ) => Promise<boolean>

  /**
   * Expand or collapse a job
   * @param stageId - Stage ID
   * @param containerId - Container ID
   * @param expand - Whether to expand (default: true)
   * @returns Promise that resolves to true if successful
   */
  expandJob: (
    stageId: string,
    containerId: string,
    expand?: boolean
  ) => Promise<boolean>
}

/**
 * BkPipeline Component
 */
export type BkPipelineComponent = DefineComponent<
  BkPipelineProps,
  BkPipelineExpose
> & {
  install: Plugin['install']
}

/**
 * Load i18n messages
 * @param i18n - i18n instance
 */
export function loadI18nMessages(i18n?: any): void

/**
 * Use language hook
 * @returns Language utilities
 */
export function useLang(): any

declare const BkPipeline: BkPipelineComponent

export default BkPipeline
