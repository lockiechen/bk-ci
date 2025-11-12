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

export interface ContentTableItem {
  id: string;
  name: string;
  description?: string;
  status: string;
  creator: string;
  createTime: string;
  updateTime: string;
  flowCount: number;
  successRate: number;
  lastRunTime?: string;
  tags?: string[];
  favorite?: boolean;
  flowAction?: MenuItem[];
  handleExecute?: (data: ContentTableItem) => void;
  latestBuildStageStatus?: BuildStageStatus[];
  viewNames?: string[];
  latestBuildStartTime?: number;
  latestBuildStatus?: string;
  latestBuildUserId?: string;
  latestVersionStatus?: string;
  webhookAliasName?: string;
  webhookMessage?: string;
  trigger?: string;
  enable?: boolean
}

export interface ContentTableResponse {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  records: ContentTableItem[];
}

export interface ContentTableParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  sortBy?: 'createTime' | 'updateTime' | 'flowCount' | 'successRate';
  sortOrder?: 'asc' | 'desc';
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
 * 获取创作流内容表格数据
 */
export async function getContentTableData(params: ContentTableParams): Promise<ContentTableResponse> {
  const {
    page = 1,
    pageSize = 20,
    keyword = '',
    status = '',
    sortBy = 'updateTime',
    sortOrder = 'desc',
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
          createTime: '2024-01-15 10:30:00',
          updateTime: '2024-11-06 14:20:00',
          flowCount: 8,
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
        },
        {
          id: 'content-2',
          name: '后端服务监控告警',
          description: '监控后端服务状态并发送告警',
          status: 'running',
          creator: '李四',
          enable: true,
          createTime: '2024-02-20 09:15:00',
          updateTime: '2024-11-06 13:45:00',
          flowCount: 12,
          successRate: 95.2,
          lastRunTime: '2024-11-06 13:40:00',
          tags: ['后端', '监控', '告警'],
          latestBuildStageStatus: [
            {
              stageId: 'stage-1',
              name: '代码编译',
              status: 'RUNNING',
              elapsed: 120,
              showMsg: '编译中...'
            },
            {
              stageId: 'stage-2',
              name: '单元测试',
              status: 'QUEUE',
              startEpoch: 1760689426000
            }
          ],
          viewNames: ['监控组', '告警组'],
          latestBuildStartTime: 1760689426000,
          latestBuildStatus: 'RUNNING',
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
          creator: '王五',
          createTime: '2024-03-10 16:20:00',
          updateTime: '2024-11-05 18:30:00',
          flowCount: 6,
          enable: false,
          successRate: 99.1,
          lastRunTime: '2024-11-05 18:25:00',
          tags: ['数据库', '备份', '恢复'],
          latestBuildStageStatus: [
            {
              stageId: 'stage-1',
              name: '备份检查',
              status: 'FAILED',
              elapsed: 45,
              showMsg: '备份文件校验失败'
            }
          ],
          latestBuildStartTime: 1760688008000,
          latestBuildStatus: 'FAILED',
          latestBuildUserId: 'wangwu',
          latestVersionStatus: 'ARCHIVED',
          trigger: '定时'
        },
        {
          id: 'content-4',
          name: '代码质量检查',
          description: '自动化代码质量检查和报告生成',
          status: 'error',
          creator: '赵六',
          createTime: '2024-04-05 11:45:00',
          updateTime: '2024-11-06 10:10:00',
          flowCount: 5,
          enable: false,
          successRate: 87.3,
          lastRunTime: '2024-11-06 10:05:00',
          tags: ['代码', '质量', '检查'],
          latestBuildStageStatus: [
            {
              stageId: 'stage-1',
              name: '代码扫描',
              status: 'CANCELED',
              elapsed: 300,
              showMsg: '用户手动取消'
            }
          ],
          viewNames: ['质量组'],
          latestBuildStartTime: 1760687008000,
          latestBuildStatus: 'CANCELED',
          latestBuildUserId: 'zhaoliu',
          latestVersionStatus: 'RELEASED',
          webhookAliasName: 'quality/scan/v2',
          webhookMessage: 'Code quality threshold exceeded',
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
        createTime: '2024-03-10 16:20:00',
        updateTime: '2024-11-05 18:30:00',
        flowCount: 6,
        enable: true,
        successRate: 99.1,
        lastRunTime: '2024-11-05 18:25:00',
        tags: ['数据库', '备份', '恢复'],
        latestBuildStageStatus: [
          {
            stageId: 'stage-1',
            name: '备份检查',
            status: 'FAILED',
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
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        flowCount: 0,
        successRate: 0,
        tags: [],
        enable: true,
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
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        flowCount: 0,
        successRate: 0,
        enable: true,
        tags: ['导入'],
        latestBuildStatus: 'SUCCEED',
        latestVersionStatus: 'DRAFT',
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
        createTime: '2024-01-15 10:30:00',
        updateTime: '2024-11-06 14:20:00',
        flowCount: 8,
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