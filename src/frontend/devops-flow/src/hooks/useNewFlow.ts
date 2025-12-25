import { type CreateContentParams } from '@/api/flowContentList';
import { templateTypeEnum } from "@/utils/flowConst";
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { ROUTE_NAMES } from '@/constants/routes';
import { useNewFlowStore } from '@/stores/createFlowStore';
import { Message } from 'bkui-vue';
import { useRoute, useRouter } from "vue-router";

/**
 * NewFlowPopup组件业务逻辑 Hook
 */
export function useNewFlow() {
  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const store = useNewFlowStore()
  const {
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
  } = storeToRefs(store)

  // 本地状态
  const baseInfoRef = ref<any>()

  /**
   * 清除表单验证
   */
  function clearFormValidation() {
    baseInfoRef.value?.formRef?.clearValidate?.()
  }

  /**
   * 验证当前步骤
   */
  async function validateCurrentStep(): Promise<boolean> {
    if (currentStep.value === 1) {
      try {
        await baseInfoRef.value?.formRef?.validate?.()
        return true
      } catch (error) {
        console.error('表单验证失败:', error)
        return false
      }
    }
    return true
  }

  /**
   * 切换步骤
   */
  async function handleStepChange(targetStep: number): Promise<void> {
    if (targetStep === currentStep.value) return

    // 验证当前步骤
    const isValid = await validateCurrentStep()
    if (!isValid) return

    currentStep.value = targetStep
  }

  /**
   * 下一步
   */
  async function handleNextStep(): Promise<void> {
    const isValid = await validateCurrentStep()
    if (!isValid) return

    currentStep.value++
  }

  /**
   * 上一步
   */
  function handlePrevStep(): void {
    currentStep.value--
  }

  /**
   * 确认创建
   */
  async function handleConfirm(): Promise<void> {
    const isValid = await validateCurrentStep()
    if (!isValid) return
    try {
      const params: CreateContentParams = {
        projectId: route.params.projectId as string,
        ...formData.value.baseInfo,
        templateId: formData.value.templateInfo.activeTemplate.templateId!,
        templateVersion: formData.value.templateInfo.activeTemplate.version!,
        ...formData.value.templateInfo.cloneTemplateSet.reduce((result, item) => {
          result[item] = true
          return result
        }, {} as Record<string, boolean>),
        instanceType: formData.value.templateInfo.currentModel,
        emptyTemplate: formData.value.templateInfo.activeTemplate.templateType === templateTypeEnum.PUBLIC,
      }
  
      const res = await store.createNewFlow(params)
      if (res) {
        router.push({
          name: ROUTE_NAMES.FLOW_EDIT_WORKFLOW_ORCHESTRATION,
          params: { ...route.params, flowId: res.pipelineId, version: res.version },
        })
        store.resetForm()
      }
    } catch (error: any) {
       Message({
        message: error || error.message || t('flow.content.createFailed'),
        theme: 'error',
      })
    }
  }

  return {
    // Store状态
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

    // 本地状态
    baseInfoRef,

    // 方法
    clearFormValidation,
    validateCurrentStep,
    handleStepChange,
    handleNextStep,
    handlePrevStep,
    handleConfirm,
    resetForm: store.resetForm,
    updateBaseInfo: store.updateBaseInfo,
    updateTemplateInfo: store.updateTemplateInfo,
    fetchAuthoringEnvList: store.fetchAuthoringEnvList,
    fetchAuthoringNodeList: store.fetchAuthoringNodeList,
    fetchProjectTemplates: store.fetchProjectTemplates,
    fetchStoreTemplates: store.fetchStoreTemplates,
  }
}
