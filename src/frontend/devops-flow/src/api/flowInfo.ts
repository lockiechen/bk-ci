import { post, get, del, put } from '@/utils/http'
import { PROCESS_API_URL_PREFIX } from '@/utils/apiUrlPrefix'
import { BuildCancelPolicy, RunLockType, type FlowInfo, type FlowVersion } from '@/types/flow'

/**
 * 获取创作流基本信息
 * @param projectId 项目ID
 * @param flowId 创作流ID
 * @returns 创作流基本信息
 */
export async function fetchFlowInfo({
  projectId,
  flowId,
}: {
  projectId: string
  flowId: string
}): Promise<FlowInfo> {
  try {
    const res = await get<FlowInfo>(
      `${PROCESS_API_URL_PREFIX}/user/version/projects/${projectId}/pipelines/${flowId}/detail`,
    )
    return res
  } catch (error) {
    throw error
  }
}

export function getFlowVersionList({
  projectId,
  flowId,
}: {
  projectId: string
  flowId: string
}): Promise<FlowVersion[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { version: 3, versionName: 'V5 (P2.T3.3)', isLatest: true },
        { version: 2, versionName: 'V5 (P2.T3.2)' },
        { version: 1, versionName: 'V5 (P2.T3.1)' },
      ])
    }, 500)
  })
}

export function updateRemark({
  projectId,
  pipelineId,
  buildId,
  remark,
}: {
  projectId: string
  pipelineId: string
  buildId: string
  remark: string
}): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}
