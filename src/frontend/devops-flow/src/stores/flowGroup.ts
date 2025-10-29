import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { FlowGroupItem, ProjectFlowGroup, FlowGroupCounts } from '../api/flowGroup';

export const useFlowGroupStore = defineStore('flowGroup', () => {
  // 数量统计
  const counts = ref<FlowGroupCounts>({
    allFlows: 0,
    myFavorites: 0,
    myCreated: 0,
    myFlowGroups: 0,
  });
  
  // 个人创作流组列表
  const personalFlowGroups = ref<FlowGroupItem[]>([]);
  
  // 项目创作流组列表
  const projectFlowGroups = ref<ProjectFlowGroup[]>([]);
  
  // 项目创作流组总数
  const projectFlowGroupsTotal = ref<number>(0);
  
  // 加载状态
  const loading = ref(false);
  
  // 计算属性：我的创作流组总数
  const myFlowGroupsTotal = computed(() => {
    // 收藏 + 我创建的 + 个人组
    return counts.value.myFavorites + counts.value.myCreated + personalFlowGroups.value.length;
  });
  
  // Actions
  function setCounts(newCounts: FlowGroupCounts) {
    counts.value = newCounts;
  }
  
  function setPersonalFlowGroups(groups: FlowGroupItem[]) {
    personalFlowGroups.value = groups;
  }
  
  function setProjectFlowGroups(groups: ProjectFlowGroup[]) {
    projectFlowGroups.value = groups;
  }
  
  function setProjectFlowGroupsTotal(total: number) {
    projectFlowGroupsTotal.value = total;
  }
  
  function setLoading(value: boolean) {
    loading.value = value;
  }
  
  function addPersonalFlowGroup(group: FlowGroupItem) {
    personalFlowGroups.value.push(group);
  }
  
  function removePersonalFlowGroup(id: string) {
    const index = personalFlowGroups.value.findIndex(g => g.id === id);
    if (index > -1) {
      personalFlowGroups.value.splice(index, 1);
    }
  }
  
  function addProjectFlowGroup(group: ProjectFlowGroup) {
    projectFlowGroups.value.push(group);
  }
  
  function removeProjectFlowGroup(id: string) {
    const index = projectFlowGroups.value.findIndex(g => g.id === id);
    if (index > -1) {
      projectFlowGroups.value.splice(index, 1);
    }
  }
  
  function reset() {
    counts.value = {
      allFlows: 0,
      myFavorites: 0,
      myCreated: 0,
      myFlowGroups: 0,
    };
    personalFlowGroups.value = [];
    projectFlowGroups.value = [];
    projectFlowGroupsTotal.value = 0;
    loading.value = false;
  }
  
  return {
    // State
    counts,
    personalFlowGroups,
    projectFlowGroups,
    projectFlowGroupsTotal,
    loading,
    // Computed
    myFlowGroupsTotal,
    // Actions
    setCounts,
    setPersonalFlowGroups,
    setProjectFlowGroups,
    setProjectFlowGroupsTotal,
    setLoading,
    addPersonalFlowGroup,
    removePersonalFlowGroup,
    addProjectFlowGroup,
    removeProjectFlowGroup,
    reset,
  };
});

