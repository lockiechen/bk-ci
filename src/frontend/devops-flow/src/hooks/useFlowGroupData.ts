import { onMounted } from 'vue';
import { useFlowGroupStore } from '../stores/flowGroup';
import {
  getFlowGroupCounts,
  getPersonalFlowGroups,
  getProjectFlowGroups,
  getProjectFlowGroupsCount,
  type FlowGroupItem,
  type ProjectFlowGroup,
} from '../api/flowGroup';

export function useFlowGroupData() {
  const store = useFlowGroupStore();
  
  /**
   * 加载所有数据
   */
  async function loadAllData() {
    store.setLoading(true);
    try {
      // 并发加载所有数据
      const [counts, personalFlowGroups, projectFlowGroups, projectFlowGroupsTotal] = await Promise.all([
        getFlowGroupCounts(),
        getPersonalFlowGroups(),
        getProjectFlowGroups(),
        getProjectFlowGroupsCount(),
      ]);
      
      store.setCounts(counts);
      store.setPersonalFlowGroups(personalFlowGroups);
      store.setProjectFlowGroups(projectFlowGroups);
      store.setProjectFlowGroupsTotal(projectFlowGroupsTotal);
    } catch (error) {
      console.error('Failed to load flow group data:', error);
      // 可以在这里添加错误提示
    } finally {
      store.setLoading(false);
    }
  }
  
  /**
   * 刷新数量统计
   */
  async function refreshCounts() {
    try {
      const counts = await getFlowGroupCounts();
      store.setCounts(counts);
    } catch (error) {
      console.error('Failed to refresh counts:', error);
    }
  }
  
  /**
   * 刷新个人创作流组
   */
  async function refreshPersonalFlowGroups() {
    try {
      const groups = await getPersonalFlowGroups();
      store.setPersonalFlowGroups(groups);
    } catch (error) {
      console.error('Failed to refresh personal flow groups:', error);
    }
  }
  
  /**
   * 刷新项目创作流组
   */
  async function refreshProjectFlowGroups() {
    try {
      const [groups, total] = await Promise.all([
        getProjectFlowGroups(),
        getProjectFlowGroupsCount(),
      ]);
      store.setProjectFlowGroups(groups);
      store.setProjectFlowGroupsTotal(total);
    } catch (error) {
      console.error('Failed to refresh project flow groups:', error);
    }
  }
  
  /**
   * 添加个人创作流组
   */
  async function addPersonalFlowGroup(name: string) {
    try {
      // TODO: await createPersonalFlowGroup(name);
      // 临时添加到列表
      const newGroup: FlowGroupItem = {
        id: `personal-${Date.now()}`,
        name,
        count: 0,
      };
      store.addPersonalFlowGroup(newGroup);
    } catch (error) {
      console.error('Failed to add personal flow group:', error);
      throw error;
    }
  }
  
  /**
   * 删除个人创作流组
   */
  async function removePersonalFlowGroup(id: string) {
    try {
      // TODO: await deletePersonalFlowGroup(id);
      store.removePersonalFlowGroup(id);
    } catch (error) {
      console.error('Failed to remove personal flow group:', error);
      throw error;
    }
  }
  
  /**
   * 添加项目创作流组
   */
  async function addProjectFlowGroup(name: string) {
    try {
      // TODO: await createProjectFlowGroup(name);
      // 临时添加到列表
      const newGroup: ProjectFlowGroup = {
        id: `project-${Date.now()}`,
        name,
        count: 0,
      };
      store.addProjectFlowGroup(newGroup);
    } catch (error) {
      console.error('Failed to add project flow group:', error);
      throw error;
    }
  }
  
  /**
   * 删除项目创作流组
   */
  async function removeProjectFlowGroup(id: string) {
    try {
      // TODO: await deleteProjectFlowGroup(id);
      store.removeProjectFlowGroup(id);
    } catch (error) {
      console.error('Failed to remove project flow group:', error);
      throw error;
    }
  }
  
  // 组件挂载时加载数据
  onMounted(() => {
    loadAllData();
  });
  
  return {
    loadAllData,
    refreshCounts,
    refreshPersonalFlowGroups,
    refreshProjectFlowGroups,
    addPersonalFlowGroup,
    removePersonalFlowGroup,
    addProjectFlowGroup,
    removeProjectFlowGroup,
  };
}

