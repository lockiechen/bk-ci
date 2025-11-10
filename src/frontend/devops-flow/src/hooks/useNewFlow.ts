import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useNewFlowStore } from '@/stores/useNewFlowStore';

/**
 * NewFlowPopup组件业务逻辑 Hook
 */
interface UseNewFlowProps {
  isShow: boolean;
}

export function useNewFlow(props: UseNewFlowProps) {
  const store = useNewFlowStore();
  const { 
    currentStep, 
    formData, 
    isLoading, 
    validationErrors 
  } = storeToRefs(store);

  // 本地状态
  const baseInfoRef = ref<any>();

  /**
   * 监听弹窗显示状态变化
   */
  watch(() => props.isShow, (newVal) => {
    if (newVal) {
      store.resetForm();
      clearFormValidation();
    }
  });

  /**
   * 清除表单验证
   */
  function clearFormValidation() {
    baseInfoRef.value?.formRef?.clearValidate?.();
    store.clearValidationErrors();
  }

  /**
   * 验证当前步骤
   */
  async function validateCurrentStep(): Promise<boolean> {
    if (currentStep.value === 1) {
      try {
        await baseInfoRef.value?.formRef?.validate?.();
        return true;
      } catch (error) {
        console.error('表单验证失败:', error);
        return false;
      }
    }
    return true;
  }

  /**
   * 切换步骤
   */
  async function handleStepChange(targetStep: number): Promise<void> {
    if (targetStep === currentStep.value) return;

    // 验证当前步骤
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    store.setCurrentStep(targetStep);
  }

  /**
   * 下一步
   */
  async function handleNextStep(): Promise<void> {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    store.nextStep();
  }

  /**
   * 上一步
   */
  function handlePrevStep(): void {
    store.prevStep();
  }

  /**
   * 更新基础信息
   */
  function handleUpdateBaseInfo(data: { flowName: string; desc: string; authoringEnv: string }) {
    store.updateBaseInfo(data);
  }

  /**
   * 更新模板信息
   */
  function handleUpdateTemplateInfo(data: any) {
    store.updateTemplateInfo(data);
  }

  /**
   * 确认创建
   */
  async function handleConfirm(): Promise<void> {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    await store.createNewFlow();
  }

  /**
   * 关闭弹窗
   */
  function handleClose(): void {
    store.resetForm();
  }

  return {
    // Store状态
    currentStep,
    formData,
    isLoading,
    validationErrors,
    
    // 本地引用
    baseInfoRef,
    
    // 方法
    clearFormValidation,
    validateCurrentStep,
    handleStepChange,
    handleNextStep,
    handlePrevStep,
    handleUpdateBaseInfo,
    handleUpdateTemplateInfo,
    handleConfirm,
    handleClose
  };
}