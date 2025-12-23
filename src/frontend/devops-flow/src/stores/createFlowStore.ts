import {
    apiGetAuthoringEnvList,
    apiGetAuthoringNodeList,
    apiGetProjectTemplates,
    apiGetStoreTemplates,
    createContent,
    type AuthoringEnvItem,
    type AuthoringNodeItem,
    type CreateContentParams,
    type CreateContentFormData,
} from '@/api/flowContentList'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { templateTypeEnum } from "@/utils/flowConst";
import { useI18n } from 'vue-i18n'

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
  const authoringEnvList = ref<AuthoringEnvItem[]>([])
  const authoringNodeList = ref<AuthoringNodeItem[]>([])
  const envListLoading = ref(false)
  const nodeListLoading = ref(false)

  // 模板相关状态
  const projectModelList = ref<any[]>([])
  const storeModelList = ref<any[]>([])
  const projectModelLoading = ref(false)
  const storeModelLoading = ref(false)

  /**
   * 获取项目模板列表
   */
  async function fetchProjectTemplates(projectId: string): Promise<void> {
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
        formData.value.templateInfo.activeTemplate = projectModelList.value[0]
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
  async function fetchStoreTemplates(projectId: string): Promise<void> {
    try {
      storeModelLoading.value = true
      const res = await apiGetStoreTemplates(projectId)

      // 将模板数据转换为列表格式
      if (res) {
        storeModelList.value = res.records
      } else {
        storeModelList.value = []
      }
    } catch (error) {
      console.error('获取商店模板列表失败:', error)
      storeModelList.value = []
    } finally {
      storeModelLoading.value = false
    }
  }

  /**
   * 获取创作环境列表
   */
  async function fetchAuthoringEnvList(): Promise<void> {
    try {
      envListLoading.value = true
      const params = {
        projectId: route.params.projectId as string,
        envType: 'CREATE',
      }
      const envList = await apiGetAuthoringEnvList(params)
      authoringEnvList.value = envList.map((item) => ({
        ...item,
        value: item.envHashId,
        label: item.name,
      }))
    } catch (error) {
      console.error('获取创作环境列表失败:', error)
      authoringEnvList.value = []
    } finally {
      envListLoading.value = false
    }
  }

  /**
   * 获取创作节点列表
   */
  async function fetchAuthoringNodeList(envName: string): Promise<void> {
    if (!envName) {
      authoringNodeList.value = []
      return
    }

    try {
      nodeListLoading.value = true
      const params = {
        projectId: route.params.projectId as string,
        envName: 'CREATE',
      }
      const res = await apiGetAuthoringNodeList(params)
      authoringNodeList.value = res.records
    } catch (error) {
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
  async function createNewFlow(params: CreateContentParams): Promise<any> {
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
