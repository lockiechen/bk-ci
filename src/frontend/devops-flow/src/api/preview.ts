import { get, post } from '@/utils/http'
import {
  delay,
  ENABLE_MOCK_FALLBACK,
  getMockExecuteResponse,
  getMockPipelineModel,
  getMockStartupInfo,
  MOCK_API_DELAY,
} from './previewMock'

/**
 * Startup info response from API
 */
export interface StartupInfo {
  canManualStartup: boolean
  canElementSkip?: boolean
  useLatestParameters?: boolean
  buildNo?: {
    buildNo: number
    buildNoType: string
    required: boolean
    currentBuildNo?: number
  }
  properties: StartupProperty[]
}

/**
 * Startup property item
 */
export interface StartupProperty {
  maxLength?: number
  id: string
  name?: string
  required: boolean
  constant: boolean
  type?: string
  defaultValue?: any
  value?: any
  desc?: string
  readOnly?: boolean
  valueNotEmpty?: boolean
  propertyType?: string
  label?: string
  isChanged?: boolean
  options?: Array<{ id: string; name: string }>
  category?: string
}

/**
 * Pipeline model response
 */
export interface PipelineModelResponse {
  modelAndSetting?: {
    model: {
      name: string
      stages: any[]
      [key: string]: any
    }
    [key: string]: any
  }
  [key: string]: any
}

/**
 * Execute pipeline response
 */
export interface ExecutePipelineResponse {
  id: string
  [key: string]: any
}

/**
 * Get startup info for manual execution
 * Falls back to mock data on API failure when ENABLE_MOCK_FALLBACK is true
 */
export async function requestStartupInfo({
  projectId,
  flowId,
  version,
}: {
  projectId: string
  flowId: string
  version?: number
}): Promise<StartupInfo> {
  const params: Record<string, any> = {}
  if (version) {
    params.version = version
  }

  try {
    return await get<StartupInfo>(
      `/process/api/user/builds/${projectId}/${flowId}/manualStartupInfo`,
      { params }
    )
  } catch (error) {
    if (ENABLE_MOCK_FALLBACK) {
      console.warn('[API Fallback] requestStartupInfo failed, using mock data:', error)
      await delay(MOCK_API_DELAY)
      return getMockStartupInfo()
    }
    throw error
  }
}

/**
 * Get pipeline model by version
 * Falls back to mock data on API failure when ENABLE_MOCK_FALLBACK is true
 */
export async function fetchPipelineByVersion({
  projectId,
  flowId,
  version,
}: {
  projectId: string
  flowId: string
  version?: number
}): Promise<PipelineModelResponse> {
  const params: Record<string, any> = {}
  if (version) {
    params.version = version
  }

  try {
    return await get<PipelineModelResponse>(
      `/process/api/user/pipelines/${projectId}/${flowId}`,
      { params }
    )
  } catch (error) {
    if (ENABLE_MOCK_FALLBACK) {
      console.warn('[API Fallback] fetchPipelineByVersion failed, using mock data:', error)
      await delay(MOCK_API_DELAY)
      return getMockPipelineModel()
    }
    throw error
  }
}

/**
 * Execute pipeline
 * Falls back to mock data on API failure when ENABLE_MOCK_FALLBACK is true
 */
export async function requestExecPipeline({
  projectId,
  flowId,
  version,
  params,
}: {
  projectId: string
  flowId: string
  version?: number
  params: Record<string, any>
}): Promise<ExecutePipelineResponse> {
  const query: Record<string, any> = {}
  if (version) {
    query.version = version
  }
  // Handle buildNo parameter
  if (params.buildNo && typeof params.buildNo.currentBuildNo !== 'undefined') {
    query.buildNo = params.buildNo.currentBuildNo
    delete params.buildNo
  }

  try {
    return await post<ExecutePipelineResponse>(
      `/process/api/user/builds/${projectId}/${flowId}`,
      params,
      { params: query }
    )
  } catch (error) {
    if (ENABLE_MOCK_FALLBACK) {
      console.warn('[API Fallback] requestExecPipeline failed, using mock data:', error)
      await delay(MOCK_API_DELAY)
      return getMockExecuteResponse()
    }
    throw error
  }
}
