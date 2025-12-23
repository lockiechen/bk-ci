import { type FlowInfo, type FlowVersion } from '@/types/flow'
import { get, post } from '@/utils/http'
import {
    delay,
    ENABLE_MOCK_FALLBACK,
    getMockFlowInfo,
    getMockVersionList,
    MOCK_API_DELAY,
} from './previewMock'

/**
 * Get flow basic info
 * Falls back to mock data on API failure when ENABLE_MOCK_FALLBACK is true
 */
export async function fetchFlowInfo({
  projectId,
  flowId,
}: {
  projectId: string
  flowId: string
}): Promise<FlowInfo> {
  try {
    return await get<FlowInfo>(
      `/version/api/user/projects/${projectId}/pipelines/${flowId}/detail`
    )
  } catch (error) {
    if (ENABLE_MOCK_FALLBACK) {
      console.warn('[API Fallback] fetchFlowInfo failed, using mock data:', error)
      await delay(MOCK_API_DELAY)
      return getMockFlowInfo() as FlowInfo
    }
    throw error
  }
}

/**
 * Get flow version list
 * Falls back to mock data on API failure when ENABLE_MOCK_FALLBACK is true
 */
export async function getFlowVersionList({
  projectId,
  flowId,
}: {
  projectId: string
  flowId: string
}): Promise<FlowVersion[]> {
  try {
    return await get<FlowVersion[]>(
      `/version/api/user/projects/${projectId}/pipelines/${flowId}/versions`
    )
  } catch (error) {
    if (ENABLE_MOCK_FALLBACK) {
      console.warn('[API Fallback] getFlowVersionList failed, using mock data:', error)
      await delay(MOCK_API_DELAY)
      return getMockVersionList() as FlowVersion[]
    }
    throw error
  }
}

/**
 * Update build remark
 */
export async function updateRemark({
  projectId,
  flowId,
  buildId,
  remark,
}: {
  projectId: string
  flowId: string
  buildId: string
  remark: string
}): Promise<boolean> {
  try {
    await post(
      `/process/api/user/builds/${projectId}/${flowId}/${buildId}/updateRemark`,
      { remark }
    )
    return true
  } catch (error) {
    if (ENABLE_MOCK_FALLBACK) {
      console.warn('[API Fallback] updateRemark failed, using mock data:', error)
      await delay(MOCK_API_DELAY)
      return true
    }
    throw error
  }
}
