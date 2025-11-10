import { ref } from 'vue';
import { defineStore } from 'pinia';
import { type CreateContentParams } from '@/api/flowContentList';
import { useContentData } from '@/hooks/useContentData'

/**
 * 创作流创建流程状态管理
 */
export interface NewFlowState {
  currentStep: number;
  formData: CreateContentParams;
  isLoading: boolean;
  validationErrors: Record<string, string>;
}

export const useNewFlowStore = defineStore('newFlow', () => {
  const { createNewContent } = useContentData();
  // 状态定义
  const currentStep = ref(1);
  const formData = ref<CreateContentParams>(initFormData());
  const isLoading = ref(false);
  const validationErrors = ref<Record<string, string>>({});

  /**
   * 初始化表单数据
   */
  function initFormData(): CreateContentParams {
    return {
      baseInfo: {
        flowName: '',
        desc: '',
        authoringEnv: ''
      },
      templateInfo: {
        activeTemplate: { name: '空白模板', logoUrl: '', desc: '' },
        currentModel: 'freedomMode',
        cloneTemplateSet: [],
        activeMenuItem: 'flowModel'
      }
    };
  }

  /**
   * 重置表单状态
   */
  function resetForm() {
    formData.value = initFormData();
    currentStep.value = 1;
    validationErrors.value = {};
    isLoading.value = false;
  }

  /**
   * 更新基础信息
   */
  function updateBaseInfo(data: { flowName: string; desc: string; authoringEnv: string }) {
    formData.value.baseInfo = { ...formData.value.baseInfo, ...data };
  }

  /**
   * 更新模板信息
   */
  function updateTemplateInfo(data: any) {
    formData.value.templateInfo = { ...formData.value.templateInfo, ...data };
  }

  /**
   * 切换步骤
   */
  function setCurrentStep(step: number) {
    currentStep.value = step;
  }

  /**
   * 下一步
   */
  function nextStep() {
    if (currentStep.value < 2) {
      currentStep.value++;
    }
  }

  /**
   * 上一步
   */
  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  }

  /**
   * 设置验证错误
   */
  function setValidationErrors(errors: Record<string, string>) {
    validationErrors.value = errors;
  }

  /**
   * 清除验证错误
   */
  function clearValidationErrors() {
    validationErrors.value = {};
  }

  /**
   * 创建创作流
   */
  async function createNewFlow(): Promise<void> {
    isLoading.value = true;
    try {
      await createNewContent(formData.value);
      resetForm();
    } catch (error) {
      console.error('Failed to create new flow:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    currentStep,
    formData,
    isLoading,
    validationErrors,
    
    // Actions
    resetForm,
    updateBaseInfo,
    updateTemplateInfo,
    setCurrentStep,
    nextStep,
    prevStep,
    setValidationErrors,
    clearValidationErrors,
    createNewFlow
  };
});