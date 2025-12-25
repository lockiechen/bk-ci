import {
  fetchAuthoringEnvList as apiFetchEnvList,
  fetchAuthoringNodeList as apiFetchNodeList,
  type AuthoringNodeItem,
  type EnvSelectItem
} from '@/api/authoringEnvironmentApi';
import {
  apiGetProjectTemplates,
  apiGetStoreTemplates,
  createContent,
  type CreateContentFormData,
  type CreateContentParams,
  type GetStoreTemplatesParams,
  type StoreTemplateItem,
  type TemplateObject
} from '@/api/flowContentList';
import { templateTypeEnum } from "@/utils/flowConst";
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { Message } from 'bkui-vue';

/**
 * 创作流创建流程状态管理
 *
 * 注意：不要在 store 中导入 hooks，避免循环依赖
 * 直接调用 API 方法
 */
export const useNewFlowStore = defineStore('newFlow', () => {
  const { t } = useI18n()
  const route = useRoute()

  // 状态定义
  const currentStep = ref(1)
  const formData = ref<CreateContentFormData>({
    baseInfo: {
      pipelineName: '',
      pipelineDesc: '',
      envName: '',
    },
    templateInfo: {
      activeTemplate: { name: '', logoUrl: '', desc: '' },
      currentModel: templateTypeEnum.FREEDOM,
      cloneTemplateSet: [],
      activeMenuItem: 'flowModel',
    },
  })
  const isLoading = ref(false)

  // 创作环境相关状态
  const authoringEnvList = ref<EnvSelectItem[]>([])
  const authoringNodeList = ref<AuthoringNodeItem[]>([])
  const envListLoading = ref(false)
  const nodeListLoading = ref(false)

  // 模板相关状态
  const projectModelList = ref<TemplateObject[]>([])
  const storeModelList = ref<StoreTemplateItem[]>([])
  const projectModelLoading = ref(false)
  const storeModelLoading = ref(false)

  /**
   * 获取项目模板列表
   */
  async function fetchProjectTemplates(projectId: string) {
    try {
      projectModelLoading.value = true
      const response = await apiGetProjectTemplates(projectId)

      // 将模板数据转换为列表格式
      if (response && response.templates) {
        projectModelList.value = Object.values(response.templates).map((template: any) => ({
          ...template,
          id: template.templateId,
          name: template.name,
          logoUrl: template.logoUrl,
          desc: template.desc,
          templateType: template.templateType,
        }))

        // 如果有模板数据，设置第一个为激活模板
        const firstTemplate = projectModelList.value[0]
        if (firstTemplate) {
          formData.value.templateInfo.activeTemplate = firstTemplate
        }
      } else {
        projectModelList.value = []
      }
    } catch (error) {
      console.error('获取项目模板列表失败:', error)
      projectModelList.value = []
    } finally {
      projectModelLoading.value = false
    }
  }

  /**
   * 获取商店模板列表
   */
  async function fetchStoreTemplates() {
    try {
      storeModelLoading.value = true
      // TODO: 分页和搜索参数
      const param: GetStoreTemplatesParams = {
        page: 1,
        pageSize: 50,
        projectCode: route.params.projectId as string,
        keyword: '',
      }
      const res = await apiGetStoreTemplates(param)

      if (res) {
        storeModelList.value = res.records
      }
    } catch (error: any) {
      console.error('获取商店模板列表失败:', error)
      Message({ theme: 'error', message: error.message || error })
      storeModelList.value = []
    } finally {
      storeModelLoading.value = false
    }
  }

  /**
   * 获取创作环境列表
   * Uses the centralized authoringEnvironmentApi
   */
  async function fetchAuthoringEnvList() {
    try {
      envListLoading.value = true
      const projectId = route.params.projectId as string
      const envList = await apiFetchEnvList({ projectId, envType: 'CREATE' })
    } catch (error) {
      console.error('Failed to fetch authoring environment list:', error)
      authoringEnvList.value = []
    } finally {
      envListLoading.value = false
    }
  }

  /**
   * 获取创作节点列表
   * Uses the centralized authoringEnvironmentApi
   */
  async function fetchAuthoringNodeList(envName: string) {
    if (!envName) {
      authoringNodeList.value = []
      return
    }

    try {
      nodeListLoading.value = true
      const projectId = route.params.projectId as string
      const res = await apiFetchNodeList({ projectId, envName })
      authoringNodeList.value = res.records || []
    } catch (error) {
      console.error('Failed to fetch authoring node list:', error)
      authoringNodeList.value = []
    } finally {
      nodeListLoading.value = false
    }
  }

  /**
   * 初始化表单数据
   */
  function initFormData(): CreateContentFormData {
    return {
      baseInfo: {
        pipelineName: '',
        pipelineDesc: '',
        envName: '',
      },
      templateInfo: {
        activeTemplate: { name: '', logoUrl: '', desc: '' },
        currentModel: templateTypeEnum.FREEDOM,
        cloneTemplateSet: [],
        activeMenuItem: 'flowModel',
      },
    }
  }

  /**
   * 重置表单状态
   */
  function resetForm() {
    formData.value = initFormData()
    currentStep.value = 1
    isLoading.value = false
    authoringEnvList.value = []
    authoringNodeList.value = []
    projectModelList.value = []
    storeModelList.value = []
  }

  /**
   * 更新基础信息
   */
  function updateBaseInfo(data: { pipelineName: string; pipelineDesc: string; envName: string }) {
    formData.value.baseInfo = { ...formData.value.baseInfo, ...data }
  }

  /**
   * 更新模板信息
   */
  function updateTemplateInfo(data: any) {
    formData.value.templateInfo = { ...formData.value.templateInfo, ...data }
  }

  /**
   * 创建创作流
   * 直接调用 API，避免循环依赖
   */
  async function createNewFlow(params: CreateContentParams) {
    projectModelLoading.value = true
    try {
      const result = await createContent(params)
      return result
    } catch (error) {
      console.error('Failed to create new flow:', error)
      throw error
    } finally {
      projectModelLoading.value = false
    }
  }

  return {
    // State
    currentStep,
    formData,
    isLoading,
    authoringEnvList,
    authoringNodeList,
    envListLoading,
    nodeListLoading,
    projectModelList,
    storeModelList,
    projectModelLoading,
    storeModelLoading,

    // Actions
    resetForm,
    updateBaseInfo,
    updateTemplateInfo,
    createNewFlow,
    fetchAuthoringEnvList,
    fetchAuthoringNodeList,
    fetchProjectTemplates,
    fetchStoreTemplates,
  }
})
