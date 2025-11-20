/**
 * 变更日志相关 API
 */
export interface ChangeLogRecord {
  id: number
  projectId: string
  pipelineId: string
  version: number
  operator: string
  operationLogType: string
  operationLogStr: string
  params: string
  operateTime: number
  versionName: string
  versionCreateTime: number
  status: string
}

export interface ChangeLogQueryParams {
  projectId: string
  flowId: string
  creator?: string
  page?: number
  pageSize?: number
}

export interface ChangeLogListResponse {
  records: ChangeLogRecord[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 获取操作人列表
 * @param projectId 项目ID
 * @param flowId 创作流ID
 */
export async function getChangeLogOperators(projectId: string, flowId: string): Promise<string[]> {
  // TODO: 调用实际接口
  // const response = await http.get(`/version/projects/${projectId}/pipelines/${flowId}/operatorList`);
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['zhangsan', 'lisi', 'wangwu'])
    }, 300)
  })
}

/**
 * 获取变更日志列表
 * @param projectId 项目ID
 * @param flowId 创作流ID
 * @param params 查询参数
 */
export async function getChangeLogList(
  params: ChangeLogQueryParams,
): Promise<ChangeLogListResponse> {
  // TODO: 调用实际接口
  // const response = await http.get(`/version/projects/${projectId}/pipelines/${flowId}/operationLog`, { params });
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: ChangeLogRecord[] = [
        {
          id: 296090,
          projectId: 'abc',
          pipelineId: 'p-e0f2eb86b8df4sds',
          version: 3,
          operator: 'zhangsan',
          operationLogType: 'UPDATE_DRAFT_VERSION',
          operationLogStr: '修改了草稿',
          params: '',
          operateTime: 1746692280000,
          versionName: '',
          versionCreateTime: 1746692078000,
          status: 'COMMITTING',
        },
        {
          id: 296091,
          projectId: 'abc',
          pipelineId: 'p-e0f2eb86b8df4sds',
          version: 2,
          operator: 'lisi',
          operationLogType: 'CREATE_DRAFT_VERSION',
          operationLogStr: '创建了草稿',
          params: '',
          operateTime: 1746692080000,
          versionName: '',
          versionCreateTime: 1746692078000,
          status: 'COMMITTED',
        },
        {
          id: 296092,
          projectId: 'abc',
          pipelineId: 'p-e0f2eb86b8df4sds',
          version: 1,
          operator: 'zhangsan',
          operationLogType: 'COMMIT_VERSION',
          operationLogStr: '提交了版本',
          params: '',
          operateTime: 1746692078000,
          versionName: '',
          versionCreateTime: 1746692078000,
          status: 'COMMITTED',
        },
      ]

      resolve({
        count: 3,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        records: mockData,
      })
    }, 1000)
  })
}
