import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { FLOW_GROUP_TYPES } from '@/constants/flowGroup'
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm'
import { useFlowGroupData } from '@/hooks/useFlowGroupData'
import { useFlowHomeContentStore } from '../stores/flowContentList'
import { ORDER_ENUM, FLOW_SORT_FILED } from '../utils/flowConst'
import { type SortType, type Collation, type ContentTableItem } from '@/api/flowContentList'

export interface Styles {
  iconStarBtn: string
  [key: string]: string
}

/**
 * 创作流列表数据 Hook
 * 用于管理创作流列表表格的数据获取、排序、分页等操作
 */
export function useFlowListData(styles?: Styles) {
  const { showDeleteConfirm } = useDeleteConfirm()
  const { myFlowGroupMenuItems, projectFlowGroups } = useFlowGroupData()
  const store = useFlowHomeContentStore()
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const {
    flowTableList,
    pagination,
    tableLoading,
    isShowAddToDialog,
    isShowCopyDialog,
    isShowSaveAsTemplateDialog,
    currentActionData,
  } = storeToRefs(store)

  // 本地状态管理
  const sortShow = ref(false)
  const currentSortType = ref(
    (route.query.sortType as string) ||
      localStorage.getItem('flowSortType') ||
      FLOW_SORT_FILED.flowName,
  )
  const currentCollation = ref(
    (route.query.collation as string) ||
      localStorage.getItem('flowSortCollation') ||
      ORDER_ENUM.ascending,
  )
  const allGroups = computed(() => {
    return [
      {
        id: FLOW_GROUP_TYPES.ALL_FLOWS,
        name: t('flow.common.allFlows'),
      },
      ...myFlowGroupMenuItems.value,
      ...projectFlowGroups.value,
      {
        id: FLOW_GROUP_TYPES.RECYCLE_BIN,
        name: t('flow.sidebar.recycleBin'),
      }
    ]
  })

  const currentGroup = computed(() => {
    return allGroups.value.find(item => item.id === route.params.groupId)
  })
  
  // 搜索选择器的值
  const searchValue = ref<
    Array<{ id: string; name: string; values?: Array<{ id: string; name: string }> }>
  >([])

  // 搜索选择器的数据配置
  const searchData = computed(() => [
    {
      id: 'name',
      name: t('flow.content.name'),
    },
    {
      id: 'viewNames',
      name: t('flow.content.searchFieldGroupName'),
    },
    {
      id: 'latestBuildStatus',
      name: t('flow.content.searchFieldExecutionStatus'),
      children: [
        { id: 'success', name: t('flow.common.success') },
        { id: 'failed', name: t('flow.common.failed') },
        { id: 'running', name: t('flow.content.executionStatusRunning') },
        { id: 'pending', name: t('flow.content.executionStatusPending') },
      ],
    },
  ])

  const searchPlaceHolder = computed(() => {
    return searchData.value.map((item) => item.name).join('/')
  })

  const newFromTemplatePopupShow = ref(false)
  const importFlowPopupShow = ref(false)

  const isRecycleBin = computed(() => {
    return route.params.groupId === FLOW_GROUP_TYPES.RECYCLE_BIN
  })
  const latestExecIsStageProgress = ref(
    localStorage.getItem('latestExecIsStageProgress') === 'true' || false,
  )

  const currentSortIconName = computed(() => getSortIconName(currentSortType.value))
  const newFlowList = computed(() => [
    {
      text: t('flow.content.newFromTemplate'),
      handler: handleNewFromTemplate,
    },
    {
      text: t('flow.content.importFlow'),
      handler: handleImportFlow,
    },
  ])
  const sortList = computed(() => {
    return [
      {
        id: FLOW_SORT_FILED.flowName,
        name: t('flow.content.orderByAlpha'),
      },
      {
        id: FLOW_SORT_FILED.createDate,
        name: t('flow.content.orderByCreateTime'),
      },
      {
        id: FLOW_SORT_FILED.updateTime,
        name: t('flow.content.orderByUpdateTime'),
      },
      {
        id: FLOW_SORT_FILED.latestBuildStartDate,
        name: t('flow.content.orderByExecuteTime'),
      },
    ].map((sort) => ({
      ...sort,
      active: isActiveSort(sort.id),
      sortIcon: getSortIconName(sort.id),
    }))
  })

  onMounted(() => {
    updateQuery()
  })

  /**
   * 使用指定的 groupId 加载数据
   */
  function loadContentDataWithGroupId(groupId: string) {
    loadContentData(groupId)
  }

  /**
   * 加载表格数据
   */
  async function loadContentData(groupId?: string) {
    const params = {
      page: pagination.value.current,
      pageSize: pagination.value.limit,
      sortType: currentSortType.value as SortType,
      collation: currentCollation.value as Collation,
      groupId: groupId || (route.params.groupId as string) || '',
    }
    await store.fetchFlowList(params)
  }

  /**
   * 从模板新建创作流
   */
  function handleNewFromTemplate() {
    newFromTemplatePopupShow.value = !newFromTemplatePopupShow.value
  }

  /**
   * 导入创作流
   */
  function handleImportFlow() {
    importFlowPopupShow.value = !importFlowPopupShow.value
  }

  /**
   * 更新路由查询参数
   */
  function updateQuery() {
    const queryParams: any = {
      ...route.query,
      sortType: currentSortType.value,
      ...(currentCollation.value ? { collation: currentCollation.value } : {}),
    }
    router.push({
      query: queryParams,
    })
  }

  /**
   * 检查是否为当前激活的排序类型
   */
  function isActiveSort(sortType: string) {
    return currentSortType.value === sortType
  }

  /**
   * 获取排序图标名称
   */
  function getSortIconName(sortType: string) {
    if (isActiveSort(sortType) && currentCollation.value && currentCollation.value !== 'null') {
      return `sort-${currentCollation.value.toLowerCase()}`
    }
    return 'sort'
  }

  /**
   * 改变排序类型
   */
  function changeSortType(sortType: string) {
    if (sortType === currentSortType.value) {
      currentCollation.value =
        currentCollation.value === ORDER_ENUM.descending
          ? ORDER_ENUM.ascending
          : ORDER_ENUM.descending
    } else {
      switch (sortType) {
        case FLOW_SORT_FILED.flowName:
          currentCollation.value = ORDER_ENUM.ascending
          break
        case FLOW_SORT_FILED.createDate:
        case FLOW_SORT_FILED.updateTime:
        case FLOW_SORT_FILED.latestBuildStartDate:
          currentCollation.value = ORDER_ENUM.descending
          break
      }
      currentSortType.value = sortType
      sortShow.value = false
    }

    localStorage.setItem('flowSortType', currentSortType.value)
    localStorage.setItem('flowSortCollation', currentCollation.value)

    updateQuery()
  }

  /**
   * 表格排序变化处理
   */
  function handleTableSortChange({ sortType, collation }: { sortType: string; collation: string }) {
    currentSortType.value = sortType
    currentCollation.value = collation

    localStorage.setItem('flowSortType', sortType)
    localStorage.setItem('flowSortCollation', collation)
    updateQuery()
  }

  /**
   * 获取当前行的收藏按钮元素
   */
  function getStarButtonFromEvent(e: MouseEvent): HTMLElement | null {
    const target = e.target as HTMLElement
    const trElement = target.closest('tr.hover-highlight')
    return trElement ? trElement.querySelector(`.${styles?.iconStarBtn}`) : null
  }

  /**
   * 设置收藏按钮的显示状态
   */
  function setStarButtonVisibility(starBtn: HTMLElement | null, isVisible: boolean): void {
    if (starBtn) {
      starBtn.style.display = isVisible ? 'block' : 'none'
    }
  }

  function rowMouseEnter(e: MouseEvent, row: ContentTableItem): void {
    const starBtn = getStarButtonFromEvent(e)
    setStarButtonVisibility(starBtn, true)
  }

  function rowMouseLeave(e: MouseEvent, row: ContentTableItem): void {
    const starBtn = getStarButtonFromEvent(e)
    if (starBtn && !row.hasCollect) {
      setStarButtonVisibility(starBtn, false)
    }
  }

  async function collectHandler(hasCollect: boolean, flowId: string) {
    try {
      const res = await store.updateCollect(!hasCollect, flowId)
      if (res) {
        // TODO
        // loadContentData()
        const currentRow = flowTableList.value.find(i=>i.id === flowId)
        currentRow ? currentRow.hasCollect = !hasCollect : null
      }
    } catch (error) {
      console.log("error:", error)
    }
  }

  /**
   * 分页变化处理
   */
  function handlePageChange(current: number) {
    pagination.value.current = current
  }

  /**
   * 每页大小变化处理
   */
  function handleLimitChange(limit: number) {
    pagination.value.limit = limit
    pagination.value.current = 1
  }

  // 处理搜索选择器变化
  const handleSearchChange = (
    value: Array<{ id: string; name: string; values?: Array<{ id: string; name: string }> }>,
  ) => {
    searchValue.value = value
    // TODO: 实现搜索逻辑
    console.log('Search changed:', value)
  }

  // 处理搜索按钮点击
  const handleSearch = () => {
    // TODO: 触发搜索，重新加载数据
    console.log('Search triggered:', searchValue.value)
  }

  /**
   * 清空搜索条件
   */
  function handleClearSearch() {
    searchValue.value = []
    // TODO: 清空搜索条件

  }

  function switchExecView() {
    latestExecIsStageProgress.value = !latestExecIsStageProgress.value
    localStorage.setItem('latestExecIsStageProgress', latestExecIsStageProgress.value.toString())
  }

  async function handleRestore(row: ContentTableItem) {
    showDeleteConfirm({
      message: t('flow.restore.restoreFlowConfirm', [row.name]),
      cancelText: t('flow.common.cancel'),
      theme: 'primary',
      confirmText: t('flow.common.confirm'),
      onConfirm: async () => {
        // TODO 恢复创作流
      },
    })
  }

  return {
    // 原始数据（使用 storeToRefs 确保响应式）
    flowTableList,
    pagination,
    tableLoading,
    isShowAddToDialog,
    isShowCopyDialog,
    isShowSaveAsTemplateDialog,
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
    isRecycleBin,
    latestExecIsStageProgress,
    searchValue,
    searchData,
    searchPlaceHolder,
    currentGroup,

    // 表格操作方法
    loadContentData,
    loadContentDataWithGroupId,
    changeSortType,
    handleTableSortChange,
    handlePageChange,
    handleLimitChange,
    handleSearchChange,
    handleSearch,
    handleClearSearch,
    updateQuery,
    switchExecView,
    handleRestore,
    collectHandler,
    rowMouseEnter,
    rowMouseLeave,
    
    // 操作方法（直接暴露 store 的方法）
    closeAllDialogs: store.closeAllDialogs,
    createNewContent: store.createNewContent,
    importNewContent: store.importNewContent,
    removeContent: store.removeContent,
    confirmEnableAction: store.confirmEnableAction,
    copyContentItem: store.copyContentItem,
    saveContentAsTemplate: store.saveContentAsTemplate,
    addContentToFlowGroup: store.addContentToFlowGroup,
    setDeleteActionCallback: store.setDeleteActionCallback,
    setEnableActionCallback: store.setEnableActionCallback,
    getMatchDynamicData: store.getMatchDynamicData,
    getProjectTagList: store.getProjectTagList,
  }
}
