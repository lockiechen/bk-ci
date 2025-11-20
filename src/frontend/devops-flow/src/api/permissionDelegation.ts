/**
 * 权限代持相关 API
 */

/**
 * 资源授权数据结构
 */
export interface ResourceAuthData {
  id: number
  projectCode: string
  resourceType: string
  resourceName: string
  resourceCode: string
  handoverTime: number
  handoverFrom: string
  handoverFromCnName: string
  executePermission: boolean
}

/**
 * 资源授权交接项
 */
export interface ResourceAuthorizationHandoverItem {
  projectCode: string
  resourceType: string
  resourceName: string
  resourceCode: string
  handoverFrom: string
  handoverTo: string
}

/**
 * 重置资源授权参数
 */
export interface ResetResourceAuthParams {
  projectCode: string
  resourceType: string
  handoverChannel: string
  resourceAuthorizationHandoverList: ResourceAuthorizationHandoverItem[]
}

/**
 * 重置失败项
 */
export interface ResetFailedItem {
  handoverFailedMessage?: string
  [key: string]: any
}

/**
 * 重置资源授权响应
 */
export interface ResetResourceAuthResponse {
  FAILED?: ResetFailedItem[]
  [key: string]: any
}

/**
 * 获取资源授权信息
 * @param projectId 项目ID
 * @param flowId 流水线ID
 */
export async function getResourceAuthorization({
  projectId,
  flowId,
}: {
  projectId: string
  flowId: string
}): Promise<ResourceAuthData> {
  // TODO: 调用实际接口
  // const response = await http.get(`/auth/authorization/${projectId}/pipeline/getResourceAuthorization`, {
  //   params: { resourceCode: flowId }
  // });
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 2369,
        projectCode: 'dgdf',
        resourceType: 'flow',
        resourceName: 'trigger/t-default.yml',
        resourceCode: 'dfgsdfgdfgfdg',
        handoverTime: 1747137436000,
        handoverFrom: 'zhangsan',
        handoverFromCnName: '张三',
        executePermission: true,
      })
    }, 300)
  })
}

/**
 * 重置资源授权
 * @param projectId 项目ID
 * @param params 重置参数
 */
export async function resetResourceAuthorization(
  projectId: string,
  params: ResetResourceAuthParams,
): Promise<ResetResourceAuthResponse> {
  // TODO: 调用实际接口
  // const response = await http.post(`/auth/authorization/${projectId}/resetResourceAuthorization`, params);
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('重置资源授权成功:', params)
      // 模拟成功响应（无失败项）
      resolve({})
      // 如果需要模拟失败响应，可以使用：
      // resolve({
      //   FAILED: [{
      //     handoverFailedMessage: '重置失败原因1<br/>重置失败原因2'
      //   }]
      // })
    }, 300)
  })
}
