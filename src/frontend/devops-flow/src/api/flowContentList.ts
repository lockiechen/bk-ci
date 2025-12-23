import { post, get, del } from '@/utils/http'
import { PROCESS_API_URL_PREFIX, ENVIRONMENT_API_URL_PREFIX } from '@/utils/apiUrlPrefix'
import {
  STATUS,
  type StatusType,
  type VersionStatus,
  type StageStatusInfo,
  type FlowPermissions,
  type FlowModel,
} from '@/types/flow'

/**
 * 创作流首页内容表格相关 API
 */
// 统一从 types/flow 导入状态类型（已在上方导入）
export type { StatusType }

type TriggerType = 'manualTrigger' | 'timerTrigger' | 'codeGitWebHookTrigger' | 'remoteTrigger'

export interface ContentTableItem {
  latestBuildRoute?: object
  latestBuildStartDate?: string
  duration?: string
  progress?: string
  flowAction?: MenuItem[]
  disabled?: boolean
  tooltips?: string | { disabled: boolean }
  updateDate?: string
  released?: boolean
  onlyDraftVersion?: boolean
  onlyBranchVersion?: boolean
  createDate?: string
  model?: FlowModel
  projectId: string
  pipelineId: string
  pipelineName: string
  pipelineDesc: string
  taskCount: number
  buildCount: number
  lock: boolean
  canManualStartup: boolean
  latestBuildStartTime: number
  latestBuildEndTime: number
  latestBuildStatus?: StatusType
  latestBuildNum: number
  latestBuildTaskName?: string
  latestBuildEstimatedExecutionSeconds: number
  latestBuildId?: string
  deploymentTime: number
  createTime: number
  updateTime: number
  pipelineVersion: number
  currentTimestamp: number
  runningBuildCount: number
  hasPermission: boolean
  hasCollect: boolean
  latestBuildUserId: string
  instanceFromTemplate: boolean
  templateId?: string
  versionName?: string
  version?: number
  updater: string
  creator: string
  groupLabel?: [
    {
      groupName: string
      labelName: string[]
    },
  ]
  latestBuildNumAlias?: string
  buildNumRule?: string
  viewNames?: string[]
  lastBuildMsg?: string
  lastBuildTotalCount?: number
  lastBuildFinishCount?: number
  startType?: TriggerType
  trigger?: string
  webhookAliasName?: string
  webhookMessage?: string
  webhookRepoUrl?: string
  webhookType?: string
  delete: boolean
  latestVersionStatus?: VersionStatus
  permissions?: FlowPermissions
  yamlExist: boolean
  archivingFlag: boolean
  latestBuildStageStatus?: StageStatusInfo[]
}

export interface ContentTableResponse {
  count: number
  page: number
  pageSize: number
  totalPages: number
  records: ContentTableItem[]
}

export type SortType = 'NAME' | 'CREATE_DATE' | 'LATEST_BUILD_START_DATA' | 'UPDATE_TIME'
export type Collation = 'ASC' | 'DESC' | 'null' | 'DEFAULT'

export interface ContentTableParams {
  projectId: string
  page?: number
  pageSize?: number
  sortType?: SortType
  filterByPipelineName?: string // 创作流名称
  filterByViewIds?: string // 创作流组id
  viewId: string // 当前所在视图ID
  collation?: Collation
  status?: string // 状态过滤
}

export interface CreateContentFormData {
  baseInfo: {
    pipelineName: string
    pipelineDesc: string
    envName: string
  }
  templateInfo: {
    activeTemplate: any
    currentModel: string
    cloneTemplateSet: string[]
    activeMenuItem: string
  }
}

export interface CreateContentParams {
  projectId: string
  templateId: string
  templateVersion: number
  pipelineName: string
  useSubscriptionSettings?: boolean // 是否使用通知配置
  useLabelSettings?: boolean // 是否使用标签配置
  useConcurrencyGroup?: boolean // 是否使用并发组配置
  instanceType?: string // 创建实例的模式
  emptyTemplate?: boolean // 是否为空模板
  pipelineDesc?: string
  envName?: string
}

export interface ImportContentParams {
  file: File
  name?: string
  description?: string
}

export interface MenuItem<T = any> {
  text: string
  disable?: boolean
  hasPermission?: boolean
  disablePermissionApi?: boolean
  permissionData?: any
  tooltips?: string
  handler: (data: T, item: MenuItem) => void
}
export interface SaveAsTemplateParams {
  templateName: string
  isCopySetting: boolean
}

export interface CopyFlowParams {
  name: string
  desc?: string
  labels?: string[]
  staticView?: string[]
  dynamicGroup?: string[]
}

export interface MatchDynamicViewParams {
  labelIds: any[]
  flowName: string
}

type CanUpdate = 'INTERNAL' | 'TRUE' | 'FALSE'
/**
 * 创作环境信息
 */
export interface AuthoringEnvItem {
  envHashId: string
  name: string
  desc: string
  envType: string
  envNodeType: string
  nodeCount: number
  tags: [
    {
      tagKeyId: number
      tagKeyName: string
      tagAllowMulValue: true
      canUpdate: CanUpdate
      tagValues: [
        {
          tagValueId: number
          tagValueName: string
          nodeCount: number
          canUpdate: CanUpdate
        },
      ]
    },
  ]
  envVars: [
    {
      name: string
      value: string
      secure: true
      lastUpdateUser: string
      lastUpdateTime: number
    },
  ]
  createdUser: string
  createdTime: number
  updatedUser: string
  updatedTime: number
  canEdit: true
  canDelete: true
  canUse: true
  projectName: string
}

/**
 * 创作节点信息
 */
export interface AuthoringNodeItem {
  nodeHashId: string
  nodeId: string
  name: string
  ip: string
  nodeStatus: string
  agentStatus: true
  nodeType: string
  osName: string
  createdUser: string
  operator: string
  bakOperator: string
  gateway: string
  displayName: string
  bizId: number
  envEnableNode: true
  lastModifyTime: number
  nodeName: string
  size: string
  agentHashId: string
  agentId: number
}
export interface AuthoringNodeResponse {
  count: number
  page: number
  pageSize: number
  totalPages: number
  records: AuthoringNodeItem[]
}

/**
 * 保存基础设置参数
 */
export interface SaveBaseInfoParams {
  flowName: string
  desc: string
  authoringEnv: string
  projectId: string
}

/**
 * 获取已选中的tree数据接口返回格式
 */
export interface SelectedTreeDataResponse {
  status: number
  data: Array<{
    id: string
    projectId: string
    name: string
    projected: boolean
    createTime: number
    updateTime: number
    creator: string
    top: boolean
    viewType: number
    pipelineCount: number
    pac: boolean
  }>
}

export interface CreateContentResponse {
  pipelineId: string
  pipelineName: string
  version: number
  versionNum?: number
  versionName?: string
  targetUrl?: string
  pullRequestId?: number
  yamlInfo?: {
    repoHashId?: string
    scmType?: string
    filePath?: string
    pathWithNamespace?: string
    webUrl?: string
    fileUrl?: string
    status?: string
  }
  updateBuildNo?: true
}

/**
 * 获取创作流内容表格数据
 */
export async function getContentTableData(
  params: ContentTableParams,
): Promise<ContentTableResponse> {
  const { projectId, ...query } = params
  try {
    const res = await get<ContentTableResponse>(
      `${PROCESS_API_URL_PREFIX}/user/pipelines/projects/${projectId}/listViewPipelines`,
      {
        params: query,
      },
    )
    return res
  } catch (error) {
    throw error
  }
}

/**
 * 单条删除
 */
export async function deleteContent(flowId: string): Promise<void> {
  // TODO: 调用实际接口
  // await http.delete(`/api/flow/content/${flowId}`);

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 300)
  })
}

/**
 * 禁用创作流
 */
export async function disableContent(flowId: string, disabled: boolean): Promise<void> {
  // TODO: 调用实际接口
  // await http.put(`/api/flow/content/${flowId}/disable`);

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 300)
  })
}

/**
 * 复制创作流
 */
export async function copyContent(
  flowId: string,
  params: CopyFlowParams,
): Promise<ContentTableItem> {
  // TODO: 调用实际接口
  // const response = await http.post(`/api/flow/content/${flowId}/copy`, { params });
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: ContentTableItem = {
        projectId: 'fayetest',
        pipelineId: 'p-68ae025a1a354136948596ab3d09073f',
        pipelineName: '0420-4',
        pipelineDesc: '',
        taskCount: 3,
        buildCount: 0,
        lock: false,
        canManualStartup: true,
        latestBuildStartTime: 0,
        latestBuildEndTime: 0,
        latestBuildNum: 0,
        latestBuildEstimatedExecutionSeconds: 1,
        deploymentTime: 1618922545000,
        createTime: 1618922545000,
        updateTime: 1618922545000,
        pipelineVersion: 1,
        currentTimestamp: 1766136363205,
        runningBuildCount: 0,
        hasPermission: true,
        hasCollect: false,
        latestBuildUserId: '',
        instanceFromTemplate: false,
        updater: 'fayewang',
        creator: 'fayewang',
        lastBuildTotalCount: 0,
        lastBuildFinishCount: 0,
        delete: false,
        latestVersionStatus: 'RELEASED',
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
        yamlExist: false,
        archivingFlag: false,
      }
      resolve(mockData)
    }, 300)
  })
}

/**
 * 另存为模板
 */
export async function saveAsTemplate(flowId: string, params: SaveAsTemplateParams): Promise<void> {
  // TODO: 调用实际接口
  // const response = await http.post(`/api/flow/content/${flowId}/save-as-template`, { templateName });
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 300)
  })
}

/**
 * 添加至创作流组
 */
export async function addToFlowGroup(flowId: string, viewId: string): Promise<void> {
  // TODO: 调用实际接口
  // await http.post(`/api/flow/content/${flowId}/add-to-group`, { viewId });

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 300)
  })
}

/**
 * 新建创作流
 */
export async function createContent(params: CreateContentParams): Promise<CreateContentResponse> {
  try {
    const { projectId, ...otherParams } = params
    const response = await post<CreateContentResponse>(
      `${PROCESS_API_URL_PREFIX}/user/version/projects/${projectId}/createPipelineWithTemplate`,
      otherParams,
    )
    return response
  } catch (error) {
    throw error
  }
}

/**
 * 导入创作流
 */
export async function importContent(params: ImportContentParams): Promise<ContentTableItem> {
  // TODO: 调用实际接口
  // const formData = new FormData();
  // formData.append('file', params.file);
  // if (params.name) formData.append('name', params.name);
  // if (params.description) formData.append('description', params.description);
  // const response = await http.post('/api/flow/content/import', formData);
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: ContentTableItem = {
        projectId: 'fayetest',
        pipelineId: 'p-68ae025a1a354136948596ab3d09073f',
        pipelineName: '0420-4',
        pipelineDesc: '',
        taskCount: 3,
        buildCount: 0,
        lock: false,
        canManualStartup: true,
        latestBuildStartTime: 0,
        latestBuildEndTime: 0,
        latestBuildNum: 0,
        latestBuildEstimatedExecutionSeconds: 1,
        deploymentTime: 1618922545000,
        createTime: 1618922545000,
        updateTime: 1618922545000,
        pipelineVersion: 1,
        currentTimestamp: 1766136363205,
        runningBuildCount: 0,
        hasPermission: true,
        hasCollect: false,
        latestBuildUserId: '',
        instanceFromTemplate: false,
        updater: 'fayewang',
        creator: 'fayewang',
        lastBuildTotalCount: 0,
        lastBuildFinishCount: 0,
        delete: false,
        latestVersionStatus: 'RELEASED',
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
        yamlExist: false,
        archivingFlag: false,
      }
      resolve(mockData)
    }, 300)
  })
}

/**
 * 获取内容详情
 */
export async function getContentDetail(id: string): Promise<ContentTableItem> {
  // TODO: 调用实际接口
  // const response = await http.get(`/api/flow/content/${id}`);
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: ContentTableItem = {
        projectId: 'fayetest',
        pipelineId: 'p-68ae025a1a354136948596ab3d09073f',
        pipelineName: '0420-4',
        pipelineDesc: '',
        taskCount: 3,
        buildCount: 0,
        lock: false,
        canManualStartup: true,
        latestBuildStartTime: 0,
        latestBuildEndTime: 0,
        latestBuildNum: 0,
        latestBuildEstimatedExecutionSeconds: 1,
        deploymentTime: 1618922545000,
        createTime: 1618922545000,
        updateTime: 1618922545000,
        pipelineVersion: 1,
        currentTimestamp: 1766136363205,
        runningBuildCount: 0,
        hasPermission: true,
        hasCollect: false,
        latestBuildUserId: '',
        instanceFromTemplate: false,
        updater: 'fayewang',
        creator: 'fayewang',
        lastBuildTotalCount: 0,
        lastBuildFinishCount: 0,
        delete: false,
        latestVersionStatus: 'RELEASED',
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
        yamlExist: false,
        archivingFlag: false,
      }
      resolve(mockData)
    }, 300)
  })
}

/**
 * 获取动态流水线组数据
 */
export async function getMatchDynamicView(params: MatchDynamicViewParams): Promise<string[]> {
  // TODO: 调用实际接口
  // const response = await http.post('/api/flow/content', params);
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['personal-1'])
    }, 300)
  })
}

/**
 * 获取项目标签数据
 */
export async function getProjectTags(projectId: string): Promise<any[]> {
  // TODO: 调用实际接口获取项目标签
  // const response = await http.get('/api/project/tags', { params });
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'mobdjbyp',
          projectId: 'yu-test',
          name: '标签一',
          createTime: 1741333022,
          updateTime: 1741333022,
          createUser: 'v_yjjiaoyu',
          updateUser: 'v_yjjiaoyu',
          labels: [
            {
              id: 'mobdjgap',
              viewId: 'mobdjbyp',
              name: '测试标签',
              createTime: 1741333039,
              uptimeTime: 1741333039,
              createUser: 'v_yjjiaoyu',
              updateUser: 'v_yjjiaoyu',
            },
            {
              id: 'pwgdbjop',
              viewId: 'mobdjbyp',
              name: '测试标签2',
              createTime: 1741333053,
              uptimeTime: 1741333053,
              createUser: 'v_yjjiaoyu',
              updateUser: 'v_yjjiaoyu',
            },
            {
              id: 'pdraqqdp',
              viewId: 'mobdjbyp',
              name: '测试标签3',
              createTime: 1762852870,
              uptimeTime: 1762852870,
              createUser: 'v_yjjiaoyu',
              updateUser: 'v_yjjiaoyu',
            },
          ],
        },
        {
          id: 'mobdjbyp1',
          projectId: 'yu-test',
          name: '标签一',
          createTime: 1741333022,
          updateTime: 1741333022,
          createUser: 'v_yjjiaoyu',
          updateUser: 'v_yjjiaoyu',
          labels: [
            {
              id: 'mobdjgap',
              viewId: 'mobdjbyp',
              name: '测试标签',
              createTime: 1741333039,
              uptimeTime: 1741333039,
              createUser: 'v_yjjiaoyu',
              updateUser: 'v_yjjiaoyu',
            },
            {
              id: 'pwgdbjop',
              viewId: 'mobdjbyp',
              name: '测试标签2',
              createTime: 1741333053,
              uptimeTime: 1741333053,
              createUser: 'v_yjjiaoyu',
              updateUser: 'v_yjjiaoyu',
            },
            {
              id: 'pdraqqdp',
              viewId: 'mobdjbyp',
              name: '测试标签3',
              createTime: 1762852870,
              uptimeTime: 1762852870,
              createUser: 'v_yjjiaoyu',
              updateUser: 'v_yjjiaoyu',
            },
          ],
        },
      ])
    }, 300)
  })
}

/**
 * 根据flowId获取已选中的tree数据
 */
export async function getSelectedTreeData(flowId: string): Promise<SelectedTreeDataResponse> {
  // TODO: 调用实际接口
  // const response = await http.get(`/api/flow/content/${flowId}/selected-tree-data`);
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 0,
        data: [
          {
            id: 'personal-3',
            projectId: '后端开发组',
            name: 'fdsafsafdsdsa',
            projected: true,
            createTime: 1705994742,
            updateTime: 1705994742,
            creator: 'v_jingdhe',
            top: false,
            viewType: 1,
            pipelineCount: 0,
            pac: false,
          },
          {
            id: 'personal-4',
            projectId: '部署流程组',
            name: '?\u0011+33',
            projected: true,
            createTime: 1668502613,
            updateTime: 1756350071,
            creator: 'v_jingdhe',
            top: false,
            viewType: 2,
            pipelineCount: 0,
            pac: false,
          },
        ],
      })
    }, 300)
  })
}

/**
 * 获取创作环境列表
 */
export async function apiGetAuthoringEnvList(params: {
  projectId: string
  envType: string
}): Promise<AuthoringEnvItem[]> {
  try {
    const res = await get<AuthoringEnvItem[]>(
      `${ENVIRONMENT_API_URL_PREFIX}/user/environment/${params.projectId}?envType=${params.envType}`,
    )
    return res
  } catch (error) {
    throw error
  }
}

/**
 * 获取创作节点列表
 */
export async function apiGetAuthoringNodeList(params: {
  projectId: string
  envName: string
}): Promise<AuthoringNodeResponse> {
  try {
    const res = await get<AuthoringNodeResponse>(
      `${ENVIRONMENT_API_URL_PREFIX}/user/environment/${params.projectId}/listNodesNew?envName=${params.envName}`,
    )
    return res
  } catch (error) {
    throw error
  }
}

/**
 * 获取项目模板
 */
export async function apiGetProjectTemplates(projectId: string): Promise<any> {
  try {
    const res = await get(
      `${PROCESS_API_URL_PREFIX}/user/pipeline/template/v2/${projectId}/allTemplates`,
    )
    return res
  } catch (error) {
    throw error
  }
}

/**
 * 获取默认配置
 */
export async function apiGetDefaultSetting(): Promise<any> {
  try {
    const res = await get(`${PROCESS_API_URL_PREFIX}/user/setting/default/get`)
    return res
  } catch (error) {
    throw error
  }
}

/**
 * 获取商店模板列表
 */
export async function apiGetStoreTemplates(projectId: string): Promise<any> {
  // TODO: 调用实际接口
  // const response = await http.get(`/api/template/store/${projectId}/templates`);
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        records: [],
      })
    }, 300)
  })
}

/**
 * 收藏/取消收藏创作流
 * @param flowId 创作流ID
 * @param hasCollect 是否收藏（true: 收藏, false: 取消收藏）
 */
export async function toggleFlowFavorite(flowId: string, hasCollect: boolean) {
  // TODO: 调用实际接口
  // const response = await http.post(`/pipelines/flow/${flowId}/favor?type=${hasCollect}`);
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 300)
  })
}
