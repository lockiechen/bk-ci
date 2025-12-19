import { STATUS, type StatusType } from '@/types/flow';

/**
 * 创作流首页内容表格相关 API
 */
export interface BuildStageStatus {
  stageId: string;
  name: string;
  status: string;
  elapsed?: number;
  showMsg?: string;
  startEpoch?: number;
}
interface PromiseObj {
  canManage: boolean;
  canDelete: boolean;
  canView: boolean;
  canEdit: boolean;
  canExecute: boolean;
  canDownload: boolean;
  canShare: boolean;
  canArchive: boolean;
}
// 统一从 types/flow 导入状态类型（已在上方导入）
export type { StatusType };

type TriggerType = 'manualTrigger' | 'timerTrigger' | 'codeGitWebHookTrigger' | 'remoteTrigger'

export interface ContentTableItem {
  id: string;
  name: string;
  description?: string;
  status?: string;
  creator: string;
  createTime: number;
  updateTime: number;
  flowCount?: number;
  successRate?: number;
  lastRunTime?: string;
  latestBuildNum?: number;
  permissions?: PromiseObj;
  latestBuildRoute?: object;
  latestBuildId?: string;
  lastBuildMsg?: string;
  startType?: TriggerType;
  latestBuildStartDate?: string;
  duration?: string;
  progress?: string;
  latestBuildEndTime: number;
  lastBuildFinishCount?: number;
  lastBuildTotalCount?: number;
  currentTimestamp: number;
  tags?: string[];
  favorite?: boolean;
  flowAction?: MenuItem[];
  handleExecute?: (data: ContentTableItem) => void;
  latestBuildStageStatus?: BuildStageStatus[];
  viewNames?: string[];
  latestBuildStartTime: number;
  latestBuildStatus?: StatusType;
  latestBuildUserId?: string;
  latestVersionStatus?: string;
  webhookAliasName?: string;
  webhookMessage?: string;
  trigger?: string;
  enable?: boolean;
  hasCollect: boolean;
  [key: string]: any;
}

export interface ContentTableResponse {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  records: ContentTableItem[];
}

export type SortType = 'NAME' | 'CREATE_DATE' | 'LATEST_BUILD_START_DATA' | 'UPDATE_TIME'
export type Collation = 'asc' | 'desc' | 'null'

export interface ContentTableParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  sortType?: SortType;
  collation?: Collation;
  groupId: string;
}

export interface CreateContentParams {
  baseInfo: {
    flowName: string;
    desc: string;
    authoringEnv: string;
  };
  templateInfo: {
    activeTemplate: any;
    currentModel: string;
    cloneTemplateSet: string[];
    activeMenuItem: string;
  };
}

export interface ImportContentParams {
  file: File;
  name?: string;
  description?: string;
}

export interface MenuItem<T = any> {
  text: string;
  disable?: boolean;
  hasPermission?: boolean;
  disablePermissionApi?: boolean;
  permissionData?: any;
  tooltips?: string;
  handler: (data: T, item: MenuItem) => void;
}
export interface SaveAsTemplateParams {
  templateName: string;
  isCopySetting: boolean;
}

export interface CopyFlowParams {
  name: string;
  desc?: string;
  labels?: string[];
  staticView?: string[];
  dynamicGroup?: string[];
}

export interface MatchDynamicViewParams {
  labelIds: any[];
  flowName: string;
}

/**
 * 创作环境信息
 */
export interface AuthoringEnvItem {
  id: string;
  name: string;
  displayName: string;
  envType: string;
  status: string;
  createTime: number;
  updateTime: number;
}

/**
 * 创作节点信息
 */
export interface AuthoringNodeItem {
  id: string;
  name: string;
  displayName: string;
  status: string;
  ip: string;
  port: number;
  createTime: number;
  updateTime: number;
}

/**
 * 保存基础设置参数
 */
export interface SaveBaseInfoParams {
  flowName: string;
  desc: string;
  authoringEnv: string;
  projectId: string;
}

/**
 * 获取已选中的tree数据接口返回格式
 */
export interface SelectedTreeDataResponse {
  status: number;
  data: Array<{
    id: string;
    projectId: string;
    name: string;
    projected: boolean;
    createTime: number;
    updateTime: number;
    creator: string;
    top: boolean;
    viewType: number;
    pipelineCount: number;
    pac: boolean;
  }>;
}

/**
 * 获取创作流内容表格数据
 */
export async function getContentTableData(params: ContentTableParams): Promise<ContentTableResponse> {
  const {
    page = 1,
    pageSize = 20,
    keyword = '',
    sortType = 'NAME',
    collation = 'asc',
    groupId
  } = params;

  // TODO: 调用实际接口
  // const response = await http.get('/api/flow/content/table', { params });
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      // 生成模拟数据
      const mockData: ContentTableItem[] = [
        {
          id: 'content-1',
          name: '前端自动化部署流程',
          description: '自动化构建和部署前端项目',
          status: 'running',
          creator: '张三',
          createTime: 1762775123000,
          updateTime: 1762777795000,
          flowCount: 8,
          successRate: 98.5,
          lastRunTime: '2024-11-06 14:15:00',
          tags: ['前端', '部署', '自动化'],
          favorite: true,
          lastModifyUser: 'zhangsan',
          enable: true,
          latestBuildStageStatus: [
            {
                "stageId": "stage-1",
                "name": "stage-1",
                "status": "SUCCEED",
                "elapsed": 455,
                "showMsg": "构建已取消"
            },
            {
                "stageId": "stage-2",
                "name": "stage-1",
                "status": "SUCCEED",
                "startEpoch": 1761723856324
            },
            {
                "stageId": "stage-3",
                "name": "stage-1",
                "status": "SUCCEED",
                "startEpoch": 1761723876050
            }
          ],
          latestBuildNum: 2,
          permissions: {
            "canManage": true,
            "canDelete": true,
            "canView": true,
            "canEdit": true,
            "canExecute": true,
            "canDownload": true,
            "canShare": true,
            "canArchive": true
          },
          hasCollect: false,
          currentTimestamp: 1763968392914,
          latestBuildEndTime: 1761723906000,
          latestBuildId: "b-dfe6c98576be46e9983fc5e1d7fed112",
          lastBuildMsg: "手动触发",
          startType: "manualTrigger",
          viewNames: ['personal-1', 'personal-4'],
          latestBuildStartTime: 1760690426000,
          latestBuildStatus: STATUS.SUCCEED,
          latestBuildUserId: 'zhangsan',
          latestVersionStatus: 'RELEASED',
          webhookAliasName: 'aa-test/test/yamlv3',
          webhookMessage: 'Commit [5364988] pushed',
          trigger: '手动'
        },
        {
          id: "yu-test",
          pipelineId: "p-e1bc052fa1e34e86b42391bb0d460477",
          name: "ceui",
          pipelineDesc: "",
          taskCount: 1,
          buildCount: 0,
          lock: true,
          canManualStartup: true,
          latestBuildStartTime: 0,
          latestBuildEndTime: 0,
          latestBuildNum: 0,
          latestBuildEstimatedExecutionSeconds: 1,
          deploymentTime: 1762777695000,
          createTime: 1762775165000,
          updateTime: 1762779995000,
          pipelineVersion: 1,
          currentTimestamp: 1764036305272,
          runningBuildCount: 0,
          hasPermission: true,
          hasCollect: true,
          latestBuildUserId: "",
          instanceFromTemplate: false,
          updater: "v_yjjiaoyu",
          creator: "v_yjjiaoyu",
          lastBuildTotalCount: 0,
          lastBuildFinishCount: 0,
          delete: false,
          latestVersionStatus: "COMMITTING",
          permissions: {
              canManage: true,
              canDelete: true,
              canView: true,
              canEdit: true,
              canExecute: true,
              canDownload: true,
              canShare: true,
              canArchive: true
          },
          yamlExist: false,
          archivingFlag: false
        },
        {
          id: 'content-2',
          name: '后端服务监控告警',
          description: '监控后端服务状态并发送告警',
          status: 'running',
          creator: '李四',
          enable: true,
          hasCollect: false,
          createTime: 1762775113000,
          updateTime: 1762778695000,
          flowCount: 12,
          successRate: 95.2,
          latestBuildNum: 3452,
          permissions: {
            "canManage": true,
            "canDelete": true,
            "canView": true,
            "canEdit": true,
            "canExecute": true,
            "canDownload": true,
            "canShare": true,
            "canArchive": true
          },
          latestBuildEndTime: 1761723906000,
          lastBuildMsg: "定时触发",
          currentTimestamp: 1763968392914,
          startType: "timerTrigger",
          latestBuildId: "b-dfe6c98576be46e9983fc5e1d7fed112",
          lastRunTime: '2024-11-06 13:40:00',
          tags: ['后端', '监控', '告警'],
          latestBuildStageStatus: [
            {
              stageId: 'stage-1',
              name: '代码编译',
              status: STATUS.RUNNING,
              elapsed: 120,
              showMsg: '编译中...'
            },
            {
              stageId: 'stage-2',
              name: '单元测试',
              status: STATUS.RUNNING,
              startEpoch: 1760689426000
            }
          ],
          viewNames: ['监控组', '告警组'],
          latestBuildStartTime: 1760689426000,
          latestBuildStatus: STATUS.RUNNING,
          latestBuildUserId: 'lisi',
          latestVersionStatus: 'DRAFT',
          webhookAliasName: 'backend/monitor/v1',
          webhookMessage: 'Service restart triggered',
          trigger: '自动'
        },
        {
          id: 'content-3',
          name: '数据库备份恢复',
          description: '定时备份数据库并支持快速恢复',
          status: 'stopped',
          hasCollect: false,
          creator: '王五',
          createTime: 1762775113000,
          updateTime: 1768697695000,
          flowCount: 6,
          enable: false,
          successRate: 99.1,
          latestBuildNum: 45,
          startType: "manualTrigger",
          currentTimestamp: 1763968392914,
          permissions: {
            "canManage": true,
            "canDelete": true,
            "canView": true,
            "canEdit": true,
            "canExecute": true,
            "canDownload": true,
            "canShare": true,
            "canArchive": true
          },
          latestBuildEndTime: 1761723906000,
          latestBuildId: "b-dfe6c98576be46e9983fc5e1d7fed112",
          lastRunTime: '2024-11-05 18:25:00',
          tags: ['数据库', '备份', '恢复'],
          latestBuildStageStatus: [
            {
                "stageId": "stage-1",
                "name": "stage-1",
                "status": "SUCCEED",
                "elapsed": 505,
                "showMsg": "运行成功"
            },
            {
                "stageId": "stage-2",
                "name": "stage-2",
                "status": "SUCCEED",
                "startEpoch": 1761127754250
            },
            {
                "stageId": "stage-3",
                "name": "stage-3",
                "status": "SUCCEED",
                "startEpoch": 1761127766028
            },
            {
                "stageId": "stage-4",
                "name": "stage-4",
                "status": "FAILED",
                "startEpoch": 1761127777353
            }
          ],
          latestBuildStartTime: 1760688008000,
          latestBuildStatus: STATUS.FAILED,
          latestBuildUserId: 'wangwu',
          latestVersionStatus: 'ARCHIVED',
          trigger: '定时'
        },
        {
          id: 'content-4',
          name: '代码质量检查',
          description: '自动化代码质量检查和报告生成',
          status: 'error',
          hasCollect: false,
          creator: '赵六',
          createTime: 1762775113000,
          updateTime: 1762777695000,
          flowCount: 5,
          enable: false,
          successRate: 87.3,
          startType: "manualTrigger",
          delete: true,
          latestBuildEndTime: 1761723906000,
          currentTimestamp: 1763968392914,
          permissions: {
            "canManage": true,
            "canDelete": true,
            "canView": true,
            "canEdit": true,
            "canExecute": true,
            "canDownload": true,
            "canShare": true,
            "canArchive": true
          },
          latestBuildId: "b-dfe6c98576be46e9983fc5e1d7fed112",
          lastRunTime: '2024-11-06 10:05:00',
          tags: ['代码', '质量', '检查'],
          latestBuildStageStatus: [
            {
              stageId: 'stage-1',
              name: '代码扫描',
              status: STATUS.CANCELED,
              elapsed: 300,
              showMsg: '用户手动取消'
            }
          ],
          viewNames: ['质量组'],
          latestBuildStartTime: 1760687008000,
          // latestBuildStatus: 'CANCELED',
          latestBuildUserId: 'zhaoliu',
          latestVersionStatus: 'RELEASED',
          webhookAliasName: 'quality/scan/v2',
          trigger: '手动'
        }
      ];

      // 模拟分页
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = mockData.slice(startIndex, endIndex);
      const totalPages = Math.ceil(mockData.length / pageSize);

      resolve({
        count: mockData.length,
        page,
        pageSize,
        totalPages,
        records: paginatedData
      });
    }, 1000);
  });
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
      resolve();
    }, 300);
  });
}

/**
 * 禁用创作流
 */
export async function disableContent(flowId: string, enable: boolean): Promise<void> {
  // TODO: 调用实际接口
  // await http.put(`/api/flow/content/${flowId}/disable`);
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
}

/**
 * 复制创作流
 */
export async function copyContent(flowId: string, params: CopyFlowParams): Promise<ContentTableItem> {
  // TODO: 调用实际接口
  // const response = await http.post(`/api/flow/content/${flowId}/copy`, { params });
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: ContentTableItem = {
        id: `content-${Date.now()}`,
        name: params.name || `复制-${flowId}`,
        description: '定时备份数据库并支持快速恢复',
        status: 'stopped',
        creator: '王五',
        hasCollect: false,
        createTime: 1762775113000,
        updateTime: 1762777695000,
        flowCount: 6,
        enable: true,
        startType: "manualTrigger",
        latestBuildEndTime: 1761723906000,
        currentTimestamp: 1763968392914,
        latestBuildId: "b-dfe6c98576be46e9983fc5e1d7fed112",
        successRate: 99.1,
        lastRunTime: '2024-11-05 18:25:00',
        tags: ['数据库', '备份', '恢复'],
        latestBuildStageStatus: [
          {
            stageId: 'stage-1',
            name: '备份检查',
            status: STATUS.FAILED,
            elapsed: 45,
            showMsg: '备份文件校验失败'
          }
        ],
        latestBuildStartTime: 1760688008000,
        latestBuildStatus: 'FAILED',
        latestBuildUserId: 'wangwu',
        latestVersionStatus: 'ARCHIVED',
        trigger: '定时'
      }
      resolve(mockData);
    }, 300);
  });
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
      resolve();
    }, 300);
  });
}

/**
 * 添加至创作流组
 */
export async function addToFlowGroup(flowId: string, groupId: string): Promise<void> {
  // TODO: 调用实际接口
  // await http.post(`/api/flow/content/${flowId}/add-to-group`, { groupId });
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
}

/**
 * 新建创作流
 */
export async function createContent(params: CreateContentParams): Promise<ContentTableItem> {
  // TODO: 调用实际接口
  // const response = await http.post('/api/flow/content', params);
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: ContentTableItem = {
        id: `content-${Date.now()}`,
        name: params.baseInfo.flowName,
        description: params.baseInfo.desc,
        status: 'stopped',
        creator: '当前用户',
        hasCollect: false,
        createTime: 1762775113000,
        updateTime: 1762777695000,
        flowCount: 0,
        successRate: 0,
        tags: [],
        enable: true,
        latestBuildEndTime: 1761723906000,
        currentTimestamp: 1763968392914,
        startType: "manualTrigger",
        latestBuildId: "b-dfe6c98576be46e9983fc5e1d7fed112",
        latestBuildStartTime: 1760690426000,
        latestBuildStatus: 'SUCCEED',
        latestVersionStatus: 'DRAFT',
        trigger: '手动'
      };
      resolve(mockData);
    }, 300);
  });
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
        id: `content-${Date.now()}`,
        name: params.name || `导入-${params.file.name}`,
        description: params.description || '导入的创作流',
        status: 'stopped',
        creator: '当前用户',
        hasCollect: false,
        createTime: 1762775113000,
        updateTime: 1762777695000,
        flowCount: 0,
        successRate: 0,
        enable: true,
        tags: ['导入'],
        latestBuildStatus: 'SUCCEED',
        latestVersionStatus: 'DRAFT',
        latestBuildEndTime: 1761723906000,
        currentTimestamp: 1763968392914,
        startType: "manualTrigger",
        latestBuildStartTime: 1760690426000,
        latestBuildId: "b-dfe6c98576be46e9983fc5e1d7fed112",
        trigger: '手动'
      };
      resolve(mockData);
    }, 300);
  });
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
        id: 'content-1',
        name: '前端自动化部署流程',
        description: '自动化构建和部署前端项目',
        status: 'running',
        creator: '张三',
        hasCollect: false,
        createTime: 1762775113000,
        updateTime: 1762777695000,
        flowCount: 8,
        latestBuildEndTime: 1761723906000,
        latestBuildId: "b-dfe6c98576be46e9983fc5e1d7fed112",
        startType: "manualTrigger",
        currentTimestamp: 1763968392914,
        successRate: 98.5,
        lastRunTime: '2024-11-06 14:15:00',
        tags: ['前端', '部署', '自动化'],
        favorite: true,
        enable: true,
        latestBuildStageStatus: [
          {
            stageId: 'stage-1',
            name: 'stage-1',
            status: 'SUCCEED',
            elapsed: 782,
            showMsg: '运行成功'
          },
          {
            stageId: 'stage-2',
            name: 'stage-2',
            status: 'SUCCEED',
            startEpoch: 1760690426368
          }
        ],
        viewNames: ['组1'],
        latestBuildStartTime: 1760690426000,
        latestBuildStatus: 'SUCCEED',
        latestBuildUserId: 'zhangsan',
        latestVersionStatus: 'RELEASED',
        webhookAliasName: 'aa-test/test/yamlv3',
        webhookMessage: 'Commit [5364988] pushed',
        trigger: '手动'
      };
      resolve(mockData);
    }, 300);
  });
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
      resolve(['personal-1']);
    }, 300);
  });
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
            "id": "mobdjbyp",
            "projectId": "yu-test",
            "name": "标签一",
            "createTime": 1741333022,
            "updateTime": 1741333022,
            "createUser": "v_yjjiaoyu",
            "updateUser": "v_yjjiaoyu",
            "labels": [
                {
                    "id": "mobdjgap",
                    "groupId": "mobdjbyp",
                    "name": "测试标签",
                    "createTime": 1741333039,
                    "uptimeTime": 1741333039,
                    "createUser": "v_yjjiaoyu",
                    "updateUser": "v_yjjiaoyu"
                },
                {
                    "id": "pwgdbjop",
                    "groupId": "mobdjbyp",
                    "name": "测试标签2",
                    "createTime": 1741333053,
                    "uptimeTime": 1741333053,
                    "createUser": "v_yjjiaoyu",
                    "updateUser": "v_yjjiaoyu"
                },
                {
                    "id": "pdraqqdp",
                    "groupId": "mobdjbyp",
                    "name": "测试标签3",
                    "createTime": 1762852870,
                    "uptimeTime": 1762852870,
                    "createUser": "v_yjjiaoyu",
                    "updateUser": "v_yjjiaoyu"
                }
            ]
        },
        {
            "id": "mobdjbyp1",
            "projectId": "yu-test",
            "name": "标签一",
            "createTime": 1741333022,
            "updateTime": 1741333022,
            "createUser": "v_yjjiaoyu",
            "updateUser": "v_yjjiaoyu",
            "labels": [
                {
                    "id": "mobdjgap",
                    "groupId": "mobdjbyp",
                    "name": "测试标签",
                    "createTime": 1741333039,
                    "uptimeTime": 1741333039,
                    "createUser": "v_yjjiaoyu",
                    "updateUser": "v_yjjiaoyu"
                },
                {
                    "id": "pwgdbjop",
                    "groupId": "mobdjbyp",
                    "name": "测试标签2",
                    "createTime": 1741333053,
                    "uptimeTime": 1741333053,
                    "createUser": "v_yjjiaoyu",
                    "updateUser": "v_yjjiaoyu"
                },
                {
                    "id": "pdraqqdp",
                    "groupId": "mobdjbyp",
                    "name": "测试标签3",
                    "createTime": 1762852870,
                    "uptimeTime": 1762852870,
                    "createUser": "v_yjjiaoyu",
                    "updateUser": "v_yjjiaoyu"
                }
            ]
        }
    ]);
    }, 300);
  });
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
export async function apiGetAuthoringEnvList(projectId: string, envType: string = 'CREATE'): Promise<AuthoringEnvItem[]> {
  // TODO: 调用实际接口
  // const response = await http.get(`/environment/api/user/environment/${projectId}`, { 
  //   params: { envType } 
  // });
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'env-1',
          name: 'dev-env-001',
          displayName: '开发环境001',
          envType: 'CREATE',
          status: 'RUNNING',
          createTime: 1762775113000,
          updateTime: 1762777695000,
        },
        {
          id: 'env-2',
          name: 'test-env-002',
          displayName: '测试环境002',
          envType: 'CREATE',
          status: 'RUNNING',
          createTime: 1762775113000,
          updateTime: 1762777695000,
        },
        {
          id: 'env-3',
          name: 'prod-env-003',
          displayName: '生产环境003',
          envType: 'CREATE',
          status: 'STOPPED',
          createTime: 1762775113000,
          updateTime: 1762777695000,
        }
      ]);
    }, 300);
  });
}

/**
 * 获取创作节点列表
 */
export async function apiGetAuthoringNodeList(projectId: string, envName: string): Promise<AuthoringNodeItem[]> {
  // TODO: 调用实际接口
  // const response = await http.get(`/environment/api/user/environment/${projectId}/listNodesNew`, {
  //   params: { envName }
  // });
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'node-1',
          name: 'ins-be4830935d0ed3db',
          displayName: '创作节点001',
          status: 'RUNNING',
          ip: '192.168.1.100',
          port: 8080,
          createTime: 1762775113000,
          updateTime: 1762777695000,
        },
        {
          id: 'node-2',
          name: 'ins-be4830935d0ed3dc',
          displayName: '创作节点002',
          status: 'RUNNING',
          ip: '192.168.1.101',
          port: 8080,
          createTime: 1762775113000,
          updateTime: 1762777695000,
        }
      ]);
    }, 300);
  });
}

/**
 * 保存基础设置
 */
export async function apiSaveBaseInfo(params: SaveBaseInfoParams): Promise<void> {
  // TODO: 调用实际接口
  // await http.post(`/process/api/user/version/projects/${params.projectId}/base/info/create`, params);
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('保存基础设置成功:', params);
      resolve();
    }, 300);
  });
}

/**
 * 获取项目模板
 */
export async function apiGetProjectTemplates(projectId: string): Promise<any> {
  // TODO: 调用实际接口
  // await http.get(`pipeline/template/v2/${params.projectId}/allTemplates`)
  
  return new Promise((resolve) => {
    setTimeout(()=>{
      resolve({
        count: 1,
        page: 1,
        pageSize: 1,
        templates: {
          'b0070f67b1454e818821128f5da5bcd6': {
            name: '空白流水线',
            templateId: 'b0070f67b1454e818821128f5da5bcd6',
            projectId: '',
            version: 381,
            versionName: '空白流水线',
            templateType: 'PUBLIC',
            templateTypeDesc: 'public',
            category: [],
            logoUrl: '',
            stages: [
              {
                containers: [
                  {
                    '@type': 'trigger',
                    id: '0',
                    name: 'trigger',
                    elements: [
                      {
                        '@type': 'manualTrigger',
                        name: '手动触发',
                        id: 'T-1-1-1',
                        canElementSkip: false,
                        useLatestParameters: false,
                        executeCount: 1,
                        version: '1.*',
                        additionalOptions: {
                          enable: true,
                          continueWhenFailed: false,
                          retryWhenFailed: false,
                          retryCount: 0,
                          manualRetry: true,
                          timeout: 100,
                          pauseBeforeExec: false,
                          subscriptionPauseUser: '',
                          customCondition: '',
                          enableCustomEnv: true,
                        },
                        classType: 'manualTrigger',
                        atomCode: 'manualTrigger',
                        taskAtom: '',
                      },
                    ],
                    params: [],
                    matrixGroupFlag: false,
                    classType: 'trigger',
                  },
                ],
                id: 'stage-1',
                name: '',
                fastKill: false,
                finally: false,
              },
            ],
            cloneTemplateSettingExist: {
              notifySettingExist: false,
              concurrencySettingExist: false,
              labelSettingExist: false,
              inheritedDialect: true,
            },
          },
          '1097041009b348ea8e03cadb6c53ab53': {
            name: '代码库模板',
            templateId: '1097041009b348ea8e03cadb6c53ab53',
            projectId: 'carltemplate123',
            version: 1015610,
            versionName: '1.0.4',
            templateType: 'CUSTOMIZE',
            templateTypeDesc: '',
            category: [],
            logoUrl: '',
            stages: [
              {
                containers: [
                  {
                    '@type': 'trigger',
                    name: '触发构建',
                    elements: [
                      {
                        '@type': 'manualTrigger',
                        name: '触发构建',
                        id: 'T-1-1-1',
                        canElementSkip: true,
                        useLatestParameters: false,
                        executeCount: 1,
                        canRetry: false,
                        version: '1.*',
                        classType: 'manualTrigger',
                        atomCode: 'manualTrigger',
                        taskAtom: '',
                      },
                    ],
                    params: [
                      {
                        id: 'test',
                        required: true,
                        constant: false,
                        type: 'GIT_REF',
                        defaultValue: '123',
                        options: [],
                        desc: '',
                        repoHashId: 'Rvpk',
                        readOnly: false,
                        valueNotEmpty: false,
                        removeFlag: false,
                      },
                    ],
                    templateParams: [],
                    containerHashId: 'c-6d1d3bbb35664a82a4b646f23b461d31',
                    matrixGroupFlag: false,
                    classType: 'trigger',
                  },
                ],
                id: 'stage-1',
                name: 'stage-1',
                tag: ['28ee946a59f64949a74f3dee40a1bda4'],
                fastKill: false,
                finally: false,
              },
              {
                containers: [
                  {
                    '@type': 'vmBuild',
                    id: 'c029e57d08c011e99792fa163e50f2b5',
                    name: '构建环境-Linux',
                    elements: [
                      {
                        '@type': 'linuxScript',
                        name: 'Bash',
                        id: 'e-efa15fd135fe4570b0a86dae8617ac14',
                        scriptType: 'SHELL',
                        script:
                          '# 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell\n\n# 旧的${}引用变量的方式已升级为${{}}，和bash原生引用变量的方式区分开\n\n# 通过::set-variable命令字设置/修改全局变量\n# echo "::set-variable name=<var_name>::<value>"\n# 在后续的插件表单中使用表达式${{variables.<var_name>}}引用这个变量\n# 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用\n\n# 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖)\n# echo "::set-output name=<output_name>::<value>"\n# 在后续的插件表单中使用表达式${{jobs.<job_id>.steps.<step_id>.outputs.<output_name>}}引用这个输出，其中job_id和step_id在对应的Job和Task上配置\n\n# 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值\n# setGateValue "CodeCoverage" $myValue\n# 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住\n\n# cd $WORKSPACE 可进入当前工作空间目录\necho 123',
                        continueNoneZero: false,
                        enableArchiveFile: false,
                        archiveFile: '',
                        additionalOptions: {
                          enable: true,
                          continueWhenFailed: false,
                          manualSkip: false,
                          retryWhenFailed: false,
                          retryCount: 1,
                          manualRetry: false,
                          timeout: 900,
                          timeoutVar: '900',
                          runCondition: 'PRE_TASK_SUCCESS',
                          pauseBeforeExec: false,
                          subscriptionPauseUser: 'carlyin',
                          otherTask: '',
                          customVariables: [
                            {
                              key: 'param1',
                              value: '',
                            },
                          ],
                          customCondition: '',
                          enableCustomEnv: false,
                          customEnv: [
                            {
                              key: 'param1',
                              value: '',
                            },
                          ],
                        },
                        executeCount: 1,
                        version: '1.*',
                        classType: 'linuxScript',
                        atomCode: 'linuxScript',
                        taskAtom: '',
                      },
                      {
                        '@type': 'marketBuild',
                        name: 'post插件测试',
                        id: 'e-a36bc403e3a9481a870437c6954fd06b',
                        atomCode: 'postAtomTest',
                        version: '1.0.8',
                        data: {
                          input: {
                            desc: '哈哈',
                          },
                          output: {
                            testResult: 'string',
                          },
                          namespace: '',
                        },
                        additionalOptions: {
                          enable: true,
                          continueWhenFailed: false,
                          manualSkip: false,
                          retryWhenFailed: false,
                          retryCount: 1,
                          manualRetry: false,
                          timeout: 900,
                          timeoutVar: '900',
                          runCondition: 'PRE_TASK_SUCCESS',
                          pauseBeforeExec: false,
                          subscriptionPauseUser: 'carlyin',
                          otherTask: '',
                          customVariables: [
                            {
                              key: 'param1',
                              value: '',
                            },
                          ],
                          customCondition: '',
                          enableCustomEnv: false,
                          customEnv: [
                            {
                              key: 'param1',
                              value: '',
                            },
                          ],
                        },
                        executeCount: 1,
                        autoAtomCode: 'postAtomTest',
                        classType: 'marketBuild',
                        taskAtom: '',
                      },
                    ],
                    baseOS: 'LINUX',
                    vmNames: [],
                    maxQueueMinutes: 60,
                    maxRunningMinutes: 900,
                    buildEnv: {},
                    dispatchType: {
                      buildType: 'PUBLIC_DEVCLOUD',
                      value: 'tlinux3',
                      performanceUid: '',
                      persistence: false,
                      imageType: 'BKSTORE',
                      credentialId: '',
                      credentialProject: '',
                      imageCode: 'tlinux3',
                      imageVersion: '2.*',
                      imageName: 'tlinux3_CI镜像',
                      dockerBuildVersion: 'tlinux3',
                      imagePublicFlag: false,
                      imageRDType: '',
                      recommendFlag: true,
                    },
                    showBuildResource: false,
                    enableExternal: false,
                    containerId: 'c-3d2991b7a31c4c728554d32347ce5586',
                    containerHashId: 'c-8b2105f995e040beb0a0e0ede6b666c9',
                    jobControlOption: {
                      enable: true,
                      prepareTimeout: 10,
                      timeout: 900,
                      timeoutVar: '900',
                      runCondition: 'STAGE_RUNNING',
                      customVariables: [
                        {
                          key: 'param1',
                          value: '',
                        },
                      ],
                      customCondition: '',
                      dependOnType: 'ID',
                      dependOnId: [],
                      dependOnName: '',
                      continueWhenFailed: false,
                    },
                    jobId: 'job_1LD',
                    matrixGroupFlag: false,
                    nfsSwitch: false,
                    classType: 'vmBuild',
                  },
                ],
                id: 's-f07d54b883934ba09ca20a21aca14899',
                name: 'stage-2',
                tag: ['28ee946a59f64949a74f3dee40a1bda4'],
                fastKill: false,
                finally: false,
                checkIn: {
                  manualTrigger: false,
                  timeout: 24,
                  markdownContent: false,
                  notifyType: ['RTX'],
                },
                checkOut: {
                  manualTrigger: false,
                  timeout: 24,
                  markdownContent: false,
                  notifyType: ['RTX'],
                },
              },
            ],
            cloneTemplateSettingExist: {
              notifySettingExist: true,
              concurrencySettingExist: false,
              labelSettingExist: false,
              inheritedDialect: true,
            },
            desc: '',
          },
          '1097041009b34rgt8e03cadb6c53ab53': {
            name: '代码库模板1',
            templateId: '1097041009b34rgt8e03cadb6c53ab53',
            projectId: 'carltemplate123',
            version: 1015610,
            versionName: '1.0.4',
            templateType: 'CONSTRAINT',
            templateTypeDesc: '',
            category: [],
            logoUrl: '',
            stages: [],
            desc: '',
          },
        },
      })
    })
  })
}

/**
 * 获取商店模板列表
 */
export async function apiGetStoreTemplates(projectId: string = 'default-project'): Promise<any> {
  // TODO: 调用实际接口
  // const response = await http.get(`/api/template/store/${projectId}/templates`);
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        records: []
      });
    }, 300);
  });
}

/**
 * 收藏/取消收藏创作流
 * @param flowId 创作流ID
 * @param hasCollect 是否收藏（true: 收藏, false: 取消收藏）
 */
export async function toggleFlowFavorite(flowId: string, hasCollect: boolean){
  // TODO: 调用实际接口
  // const response = await http.post(`/pipelines/flow/${flowId}/favor?type=${hasCollect}`);
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
}