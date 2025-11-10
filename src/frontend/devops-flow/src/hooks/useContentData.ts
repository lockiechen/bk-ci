import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useFlowHomeContentStore } from '../stores/flowContentList';
import { ORDER_ENUM, FLOW_SORT_FILED } from '../utils/flowConst';

/**
 * Content组件数据 Hook
 */
export function useContentData() {
  const store = useFlowHomeContentStore();
  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();

  const { 
    flowTableList, 
    pagination, 
    tableLoading,
    isShowEnableDialog,
    isShowAddToDialog,
    isShowCopyDialog,
    isShowSaveAsTemplateDialog,
    isShowDeleteDialog,
    currentActionData
  } = storeToRefs(store);
  
  // 本地状态管理
  const sortShow = ref(false);
  const currentSortType = ref((route.query.sortType as string) || localStorage.getItem('flowSortType') || FLOW_SORT_FILED.flowName);
  const currentCollation = ref((route.query.collation as string) || localStorage.getItem('flowSortCollation') || ORDER_ENUM.ascending);

  const newFromTemplatePopupShow = ref(false);
  const importFlowPopupShow = ref(false);

  const currentSortIconName = computed(() => getSortIconName(currentSortType.value));
  const newFlowList = computed(() => [
    {
      text: t('flow.content.newFromTemplate'),
      handler: handleNewFromTemplate
    },
    {
      text: t('flow.content.importFlow'),
      handler: handleImportFlow
    }
  ]);
  const sortList = computed(() => {
    return [
      {
        id: FLOW_SORT_FILED.flowName,
        name: t('flow.content.orderByAlpha')
      }, {
        id: FLOW_SORT_FILED.createTime,
        name: t('flow.content.orderByCreateTime')
      }, {
        id: FLOW_SORT_FILED.updateTime,
        name: t('flow.content.orderByUpdateTime')
      }, {
        id: FLOW_SORT_FILED.latestBuildStartDate,
        name: t('flow.content.orderByExecuteTime')
      }
    ].map(sort => ({
      ...sort,
      active: isActiveSort(sort.id),
      sortIcon: getSortIconName(sort.id)
    }));
  });

  watch([currentSortType, currentCollation], () => {
    loadContentData();
    updateQuery();
  });

  watch(() => route.params.groupId, () => {
    loadContentData();
  });

  onMounted(() => {
    loadContentData();
    updateQuery();
  });
  
  /**
   * 加载表格数据
   */
  async function loadContentData() {
    const params = {
      page: pagination.value.current,
      pageSize: pagination.value.limit,
      sortType: currentSortType.value,
      collation: currentCollation.value,
      groupId: route.params.groupId as string
    };
    await store.fetchFlowList(params);
  }
  
  /**
   * 从模板新建创作流
   */
  function handleNewFromTemplate() {
    newFromTemplatePopupShow.value = !newFromTemplatePopupShow.value;
  }
  
  /**
   * 导入创作流
   */
  function handleImportFlow() {
    importFlowPopupShow.value = !importFlowPopupShow.value;
  }
  
  /**
   * 更新路由查询参数
   */
  function updateQuery() {
    const queryParams: any = {
      ...route.query,
      sortType: currentSortType.value,
      ...(currentCollation.value ? { collation: currentCollation.value } : {})
    };
    router.push({
      query: queryParams
    });
  }
  
  /**
   * 检查是否为当前激活的排序类型
   */
  function isActiveSort(sortType: string) {
    return currentSortType.value === sortType;
  }
  
  /**
   * 获取排序图标名称
   */
  function getSortIconName(sortType: string) {
    if (isActiveSort(sortType) && currentCollation.value && currentCollation.value !== 'null') {
      return `sort-${currentCollation.value.toLowerCase()}`;
    }
    return 'sort';
  }
  
  /**
   * 改变排序类型
   */
  function changeSortType(sortType: string) {
    if (sortType === currentSortType.value) {
      currentCollation.value = currentCollation.value === ORDER_ENUM.descending ? ORDER_ENUM.ascending : ORDER_ENUM.descending;
    } else {
      switch (sortType) {
        case FLOW_SORT_FILED.flowName:
          currentCollation.value = ORDER_ENUM.ascending;
          break;
        case FLOW_SORT_FILED.createTime:
        case FLOW_SORT_FILED.updateTime:
        case FLOW_SORT_FILED.latestBuildStartDate:
          currentCollation.value = ORDER_ENUM.descending;
          break;
      }
      currentSortType.value = sortType;
      sortShow.value = false;
    }

    localStorage.setItem('flowSortType', currentSortType.value);
    localStorage.setItem('flowSortCollation', currentCollation.value);

    updateQuery();
  }
  
  /**
   * 表格排序变化处理
   */
  function handleTableSortChange({ sortType, collation }: { sortType: string, collation: string }) {
    currentSortType.value = sortType;
    currentCollation.value = collation;

    localStorage.setItem('flowSortType', sortType);
    localStorage.setItem('flowSortCollation', collation);
    updateQuery();
  }
  
  /**
   * 分页变化处理
   */
  function handlePageChange(current: number) {
    pagination.value.current = current;
    loadContentData();
  }
  
  /**
   * 每页大小变化处理
   */
  function handleLimitChange(limit: number) {
    pagination.value.limit = limit;
    pagination.value.current = 1;
    loadContentData();
  }
  
  /**
   * 清空搜索条件
   */
  function handleClearSearch() {
    console.log('清空搜索条件');
  }
  
  return {
    // 原始数据（使用 storeToRefs 确保响应式）
    flowTableList,
    pagination,
    tableLoading,
    isShowEnableDialog,
    isShowAddToDialog,
    isShowCopyDialog,
    isShowSaveAsTemplateDialog,
    isShowDeleteDialog,
    currentActionData,

    // 本地状态
    sortList,
    newFlowList,
    sortShow,
    currentSortType,
    currentCollation,
    currentSortIconName,
    newFromTemplatePopupShow,
    importFlowPopupShow,
    
    // 表格操作方法
    loadContentData,
    changeSortType,
    handleTableSortChange,
    handlePageChange,
    handleLimitChange,
    handleClearSearch,
    
    // 操作方法（直接暴露 store 的方法）
    closeAllDialogs: store.closeAllDialogs,
    createNewContent: store.createNewContent,
    importNewContent: store.importNewContent,
    removeContent: store.removeContent,
    confirmEnableAction: store.confirmEnableAction,
    copyContentItem: store.copyContentItem,
    saveContentAsTemplate: store.saveContentAsTemplate,
    addContentToFlowGroup: store.addContentToFlowGroup,
  };
}