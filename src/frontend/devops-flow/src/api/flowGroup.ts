/**
 * 创作流组相关 API
 */

import { FLOW_GROUP_TYPES } from "@/constants/flowGroup";

export type ViewType = 1 | 2 | -1; // 1: 个人组，2: 项目组，-1: 全部组

export interface FlowGroupItem {
  id: string;
  name: string;
  count: number;
  icon?: string;
  showAction?: boolean;
  projected?: boolean; // true 表示项目组，false 或 undefined 表示个人组
  pin?: boolean;
  viewType?: ViewType;
}

export interface FlowGroupCounts {
  totalCount: number;
  myFavoriteCount: number;
  myFlowCount: number;
  recycleCount: number;
  recentUseCount: number;
}

/**
 * 获取创作流组列表
 * 通过 projected 字段区分项目组和个人组
 */
export async function getFlowGroups(): Promise<FlowGroupItem[]> {
  // TODO: 调用实际接口
  // const response = await http.get('/api/flow/groups');
  // return response.data;
  
  // 模拟数据 - 包含个人组和项目组，通过 projected 字段区分
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        // 个人组（projected: false 或 undefined）
        { id: 'personal-1', name: '前端开发组', count: 12, projected: false },
        { id: 'personal-2', name: '后端开发组', count: 8, projected: false },
        { id: 'personal-3', name: '测试流程组', count: 15, projected: false },
        { id: 'personal-4', name: '部署流程组', count: 6, projected: false },
        { id: 'personal-5', name: '代码审查组', count: 20, projected: false },
        { id: 'personal-6', name: '版本发布组', count: 9, projected: false },
        { id: 'personal-7', name: '运维流程组', count: 11, projected: false },
        { id: 'personal-8', name: '文档管理组', count: 4, projected: false },
        { id: 'personal-9', name: '数据备份组', count: 7, projected: false },
        { id: 'personal-10', name: '安全扫描组', count: 13, projected: false },
        { id: 'personal-11', name: '性能测试组', count: 5, projected: false },
        { id: 'personal-12', name: '自动化测试组', count: 18, projected: false },
        // 项目组（projected: true）
        { id: FLOW_GROUP_TYPES.UNCLASSIFIED_FLOWS, name: '未分组', count: 25, projected: true },
        { id: 'project-1', name: '核心业务组', count: 32, projected: true },
        { id: 'project-2', name: '用户服务组', count: 18, projected: true },
        { id: 'project-3', name: '支付流程组', count: 21, projected: true },
        { id: 'project-4', name: '消息通知组', count: 14, projected: true },
        { id: 'project-5', name: '数据分析组', count: 19, projected: true },
        { id: 'project-6', name: '缓存管理组', count: 16, projected: true },
        { id: 'project-7', name: '搜索服务组', count: 23, projected: true },
        { id: 'project-8', name: '图片处理组', count: 12, projected: true },
        { id: 'project-9', name: '文件上传组', count: 17, projected: true },
        { id: 'project-10', name: '日志分析组', count: 28, projected: true },
        { id: 'project-11', name: '监控告警组', count: 15, projected: true },
        { id: 'project-12', name: '定时任务组', count: 9, projected: true },
        { id: 'project-13', name: '第三方集成组', count: 22, projected: true },
        { id: 'project-14', name: 'API 网关组', count: 13, projected: true },
        { id: 'project-15', name: '微服务组', count: 27, projected: true },
      ]);
    }, 2000);
  });
}

/**
 * 获取创作流组数量
 */
export async function getFlowGroupsCount(): Promise<FlowGroupCounts> {
  // TODO: 调用实际接口
  // const response = await http.get('/api/flow/groups/count');
  // return response.data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalCount: 100,
        myFavoriteCount: 22,
        myFlowCount: 12,
        recycleCount: 9,
        recentUseCount: 12,
      });
    }, 300);
  });
}
/**
 * 创建创作流组
 */
export async function createFlowGroup(name: string, projected: boolean = false): Promise<FlowGroupItem> {
  // TODO: 调用实际接口
  // const response = await http.post('/api/flow/group', { name, projected });
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `${projected ? 'project' : 'personal'}-${Date.now()}`,
        name,
        count: 0,
        projected,
      });
    }, 300);
  });
}

/**
 * 删除创作流组
 */
export async function deleteFlowGroup(id: string): Promise<void> {
  // TODO: 调用实际接口
  // await http.delete(`/api/flow/group/${id}`);
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
}

/**
 * 重命名创作流组
 */
export async function renameFlowGroup(id: string, name: string): Promise<FlowGroupItem> {
  // TODO: 调用实际接口
  // const response = await http.put(`/api/flow/group/${id}`, { name });
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name,
        count: 0,
      });
    }, 300);
  });
}

/**
 * 置顶创作流组
 */
export async function pinFlowGroup(group: FlowGroupItem, pin: boolean): Promise<FlowGroupItem> {
  // TODO: 调用实际接口
  // const response = await http.put(`/api/flow/group/${id}/pin`, { pin });
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {

    setTimeout(() => {
      resolve({
        ...group,
        pin,
      });
    }, 300);
  });
}
