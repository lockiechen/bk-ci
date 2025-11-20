import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useNewFlowStore } from '@/stores/createFlowStore'

/**
 * NewFlowPopup组件业务逻辑 Hook
 */
export function useNewFlow() {
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

    // 如果是下一步且当前是第一步，保存基础设置
    if (targetStep > currentStep.value && currentStep.value === 1) {
      const saveSuccess = await store.saveBaseInfoData()
      if (!saveSuccess) return
    }

    currentStep.value = targetStep
  }

  /**
   * 下一步
   */
  async function handleNextStep(): Promise<void> {
    const isValid = await validateCurrentStep()
    if (!isValid) return

    // 保存基础设置
    const saveSuccess = await store.saveBaseInfoData()
    if (!saveSuccess) return

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

    await store.createNewFlow()
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
