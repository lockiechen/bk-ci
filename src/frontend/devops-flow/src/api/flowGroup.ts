/**
 * 创作流组相关 API
 */

export interface FlowGroupItem {
  id: string;
  name: string;
  count: number;
}

export interface ProjectFlowGroup extends FlowGroupItem {
  isDefault?: boolean;
}

export interface FlowGroupCounts {
  allFlows: number;
  myFavorites: number;
  myCreated: number;
  myFlowGroups: number;
}

/**
 * 获取全部创作流数量
 */
export async function getAllFlowsCount(): Promise<number> {
  // TODO: 调用实际接口
  // const response = await http.get('/api/flow/count');
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(10);
    }, 300);
  });
}

/**
 * 获取我收藏的创作流数量
 */
export async function getMyFavoritesCount(): Promise<number> {
  // TODO: 调用实际接口
  // const response = await http.get('/api/flow/favorites/count');
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(10);
    }, 300);
  });
}

/**
 * 获取我创建的创作流数量
 */
export async function getMyCreatedCount(): Promise<number> {
  // TODO: 调用实际接口
  // const response = await http.get('/api/flow/created/count');
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(10);
    }, 300);
  });
}

/**
 * 获取我的创作流组总数
 */
export async function getMyFlowGroupsCount(): Promise<number> {
  // TODO: 调用实际接口
  // const response = await http.get('/api/flow/group/my/count');
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(3);
    }, 300);
  });
}

/**
 * 获取所有创作流组数量统计
 */
export async function getFlowGroupCounts(): Promise<FlowGroupCounts> {
  const [allFlows, myFavorites, myCreated, myFlowGroups] = await Promise.all([
    getAllFlowsCount(),
    getMyFavoritesCount(),
    getMyCreatedCount(),
    getMyFlowGroupsCount(),
  ]);
  
  return {
    allFlows,
    myFavorites,
    myCreated,
    myFlowGroups,
  };
}

/**
 * 获取个人创作流组列表
 */
export async function getPersonalFlowGroups(): Promise<FlowGroupItem[]> {
  // TODO: 调用实际接口
  // const response = await http.get('/api/flow/group/personal');
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'personal-1', name: '个人可见的创作流组 1', count: 10 },
        { id: 'personal-2', name: '个人可见的创作流组 2', count: 5 },
      ]);
    }, 300);
  });
}

/**
 * 获取项目创作流组列表
 */
export async function getProjectFlowGroups(): Promise<ProjectFlowGroup[]> {
  // TODO: 调用实际接口
  // const response = await http.get('/api/flow/group/project');
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'project-default', name: '未分组', count: 8, isDefault: true },
        { id: 'project-1', name: '创作流组 1', count: 10 },
        { id: 'project-2', name: '创作流组 2', count: 15 },
        { id: 'project-3', name: '创作流组 3', count: 5 },
      ]);
    }, 300);
  });
}

/**
 * 获取项目创作流组总数
 */
export async function getProjectFlowGroupsCount(): Promise<number> {
  // TODO: 调用实际接口
  // const response = await http.get('/api/flow/group/project/count');
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(10);
    }, 300);
  });
}

/**
 * 创建个人创作流组
 */
export async function createPersonalFlowGroup(name: string): Promise<FlowGroupItem> {
  // TODO: 调用实际接口
  // const response = await http.post('/api/flow/group/personal', { name });
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `personal-${Date.now()}`,
        name,
        count: 0,
      });
    }, 300);
  });
}

/**
 * 创建项目创作流组
 */
export async function createProjectFlowGroup(name: string): Promise<ProjectFlowGroup> {
  // TODO: 调用实际接口
  // const response = await http.post('/api/flow/group/project', { name });
  // return response.data;
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `project-${Date.now()}`,
        name,
        count: 0,
      });
    }, 300);
  });
}

/**
 * 删除个人创作流组
 */
export async function deletePersonalFlowGroup(id: string): Promise<void> {
  // TODO: 调用实际接口
  // await http.delete(`/api/flow/group/personal/${id}`);
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
}

/**
 * 删除项目创作流组
 */
export async function deleteProjectFlowGroup(id: string): Promise<void> {
  // TODO: 调用实际接口
  // await http.delete(`/api/flow/group/project/${id}`);
  
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
}

