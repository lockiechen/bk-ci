import { BuildCancelPolicy, RunLockType, type FlowInfo, type FlowVersion } from '@/types/flow'

/**
 * 获取创作流基本信息
 * @param projectId 项目ID
 * @param flowId 创作流ID
 * @returns 创作流基本信息
 */
export function fetchFlowInfo({
  projectId,
  flowId,
}: {
  projectId: string
  flowId: string
}): Promise<FlowInfo> {
  // TODO: 调用实际接口
  // return http.get(`/version/projects/${projectId}/pipelines/${flowId}/detail`)
  //   .then(res => res.data)

  // Mock 数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        pipelineId: 'p-fc1ba8afdea34eed8a95e668879f4115',
        pipelineName: '归档测试111',
        hasCollect: false,
        canManualStartup: true,
        canDebug: true,
        canRelease: true,
        instanceFromTemplate: false,
        version: 1,
        baseVersion: 2,
        baseVersionStatus: 'RELEASED',
        baseVersionName: 'V1(P1.T1.2)',
        releaseVersion: 4,
        releaseVersionName: 'V2(P2.T2.2)',
        hasPermission: true,
        pipelineDesc: '',
        creator: 'zhangsan',
        createTime: 1750665486000,
        updateTime: 1764126574000,
        permissions: {
          canManage: true,
          canDelete: true,
          canView: true,
          canEdit: true,
          canExecute: true,
          canDownload: true,
          canShare: true,
          canArchive: true,
        },
        runLockType: RunLockType.MULTIPLE,
        latestVersionStatus: 'RELEASED',

        locked: false,
        buildCancelPolicy: BuildCancelPolicy.EXECUTE_PERMISSION,
      })
    }, 500)
  })
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
  flowId,
  buildId,
  remark,
}: {
  projectId: string
  flowId: string
  buildId: string
  remark: string
}): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}
