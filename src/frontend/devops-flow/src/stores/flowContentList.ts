import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getContentTableData,
  createContent,
  deleteContent,
  disableContent,
  copyContent,
  saveAsTemplate,
  addToFlowGroup,
  importContent,
  getContentDetail,
  type ContentTableItem,
  type ContentTableParams,
  type CreateContentParams,
  type ImportContentParams,
} from '@/api/flowContentList'

// 操作列弹窗类型枚举
export enum DialogType {
  ADD_TO = 'addTo',
  COPY = 'copy',
  SAVE_AS_TEMPLATE = 'saveAsTemplate',
}

export const useFlowHomeContentStore = defineStore('flowContentList', () => {
  const { t } = useI18n()
  const flowTableList = ref<ContentTableItem[]>([])
  const tableLoading = ref(false)
  const pagination = ref({
    current: 1,
    count: 0,
    limit: 20,
  })

  const currentActionData = ref<any>(null)

  const isShowAddToDialog = ref(false)
  const isShowCopyDialog = ref(false)
  const isShowSaveAsTemplateDialog = ref(false)

  // 删除和启用/禁用操作的回调函数
  let deleteActionCallback: ((data: ContentTableItem) => void) | null = null
  let enableActionCallback: ((data: ContentTableItem) => void) | null = null

  /**
   * 设置删除操作回调
   */
  function setDeleteActionCallback(callback: (data: ContentTableItem) => void) {
    deleteActionCallback = callback
  }

  /**
   * 设置启用/禁用操作回调
   */
  function setEnableActionCallback(callback: (data: ContentTableItem) => void) {
    enableActionCallback = callback
  }

  /**
   * 添加操作按钮配置
   */
  function processContentItem(content: ContentTableItem): ContentTableItem {
    return {
      ...content,
      handleExecute: (row: ContentTableItem) => handleExecute(row),
      flowAction: [
        {
          text: content.status === 'enable' ? t('flow.content.enable') : t('flow.content.disable'),
          handler: (data: ContentTableItem) => {
            if (enableActionCallback) {
              enableActionCallback(data)
            } else {
              openActionDialog(data, DialogType.ADD_TO) // fallback
            }
          },
        },
        {
          text: t('flow.content.addTo'),
          tooltips: t('flow.content.addToTooltip'),
          handler: (data: ContentTableItem) => openActionDialog(data, DialogType.ADD_TO),
        },
        {
          text: t('flow.content.copyCreationFlow'),
          handler: (data: ContentTableItem) => openActionDialog(data, DialogType.COPY),
        },
        {
          text: t('flow.content.saveAsTemplate'),
          handler: (data: ContentTableItem) => openActionDialog(data, DialogType.SAVE_AS_TEMPLATE),
        },
        {
          text: t('flow.actions.delete'),
          handler: (data: ContentTableItem) => {
            if (deleteActionCallback) {
              deleteActionCallback(data)
            } else {
              openActionDialog(data, DialogType.ADD_TO) // fallback
            }
          },
        },
      ],
    }
  }

  /**
   * 打开列操作弹窗
   */
  function openActionDialog(data: ContentTableItem, dialogType: DialogType) {
    currentActionData.value = data

    // 根据弹窗类型设置对应的显示状态
    switch (dialogType) {
      case DialogType.ADD_TO:
        isShowAddToDialog.value = true
        break
      case DialogType.COPY:
        isShowCopyDialog.value = true
        break
      case DialogType.SAVE_AS_TEMPLATE:
        isShowSaveAsTemplateDialog.value = true
        break
    }
  }

  /**
   * 关闭列操作弹窗
   */
  function closeAllDialogs() {
    isShowAddToDialog.value = false
    isShowCopyDialog.value = false
    isShowSaveAsTemplateDialog.value = false
    currentActionData.value = null
  }

  /**
   * 加载内容表格数据
   */
  async function fetchFlowList(params: ContentTableParams) {
    tableLoading.value = true
    try {
      const response = await getContentTableData(params)

      flowTableList.value = response.records.map(processContentItem)
      pagination.value = {
        count: response.count,
        current: response.page,
        limit: response.pageSize,
      }

      return response
    } catch (error) {
      console.error('Failed to load content table data:', error)
      throw error
    } finally {
      tableLoading.value = false
    }
  }

  /**
   * 获取内容详情
   */
  async function loadContentDetail(id: string) {
    try {
      const detail = await getContentDetail(id)
      return detail
    } catch (error) {
      console.error('Failed to load content detail:', error)
      throw error
    }
  }

  /**
   * 新建创作流
   */
  async function createNewContent(params: CreateContentParams) {
    try {
      const newContent = await createContent(params)
      const processedContent = processContentItem(newContent)
      flowTableList.value.unshift(processedContent)
      return processedContent
    } catch (error) {
      console.error('Failed to create content:', error)
      throw error
    }
  }

  /**
   * 导入创作流
   */
  async function importNewContent(params: ImportContentParams) {
    try {
      const importedContent = await importContent(params)
      const processedContent = processContentItem(importedContent)
      flowTableList.value.unshift(processedContent)
      return processedContent
    } catch (error) {
      console.error('Failed to import content:', error)
      throw error
    }
  }

  /**
   * 执行创作流
   */
  function handleExecute(row: ContentTableItem) {
    console.log('执行创作流', row)
  }

  /**
   * 删除创作流
   */
  async function removeContent(id: string) {
    try {
      await deleteContent(id)
      const index = flowTableList.value.findIndex((content) => content.id === id)
      if (index > -1) {
        flowTableList.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Failed to remove content:', error)
      throw error
    }
  }

  /**
   * 禁用创作流
   */
  async function confirmEnableAction(id: string) {
    try {
      await disableContent(id)
      const index = flowTableList.value.findIndex((content) => content.id === id)
      if (index > -1) {
        const currentItem = flowTableList.value[index]
        if (currentItem) {
          const updatedItem: ContentTableItem = {
            ...currentItem,
            status: 'enable',
          }
          flowTableList.value[index] = processContentItem(updatedItem)
        }
      }
    } catch (error) {
      console.error('Failed to disable content:', error)
      throw error
    }
  }

  /**
   * 复制创作流
   */
  async function copyContentItem(id: string, newName?: string) {
    try {
      const copiedContent = await copyContent(id, newName)
      const processedContent = processContentItem(copiedContent)
      flowTableList.value.unshift(processedContent)
      return processedContent
    } catch (error) {
      console.error('Failed to copy content:', error)
      throw error
    }
  }

  /**
   * 另存为模板
   */
  async function saveContentAsTemplate(id: string, templateName?: string) {
    try {
      const result = await saveAsTemplate(id, templateName)
      return result
    } catch (error) {
      console.error('Failed to save content as template:', error)
      throw error
    }
  }

  /**
   * 添加至创作流组
   */
  async function addContentToFlowGroup(contentId: string, groupId: string) {
    try {
      await addToFlowGroup(contentId, groupId)
      const index = flowTableList.value.findIndex((content) => content.id === contentId)
      if (index > -1) {
        const currentItem = flowTableList.value[index]
        if (currentItem) {
          const currentViewNames = currentItem.viewNames || []
          if (!currentViewNames.includes(groupId)) {
            const updatedItem: ContentTableItem = {
              ...currentItem,
              viewNames: [...currentViewNames, groupId],
            }
            flowTableList.value[index] = processContentItem(updatedItem)
          }
        }
      }
    } catch (error) {
      console.error('Failed to add content to flow group:', error)
      throw error
    }
  }

  return {
    // State
    flowTableList,
    pagination,
    tableLoading,
    isShowAddToDialog,
    isShowCopyDialog,
    isShowSaveAsTemplateDialog,
    currentActionData,
    // Actions
    closeAllDialogs,
    fetchFlowList,
    loadContentDetail,
    createNewContent,
    importNewContent,
    removeContent,
    confirmEnableAction,
    copyContentItem,
    saveContentAsTemplate,
    addContentToFlowGroup,
    setDeleteActionCallback,
    setEnableActionCallback,
  }
})
