import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Dialog, Button, Steps, Message } from 'bkui-vue'
import styles from './Index.module.css'
import BaseInfo from './BaseInfo'
import SelectTemplate from './SelectTemplate'
import { useNewFlow } from '@/hooks/useNewFlow'

export default defineComponent({
  name: 'NewFlowPopup',
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:isShow', 'confirm'],
  setup(props, { emit }) {
    const { t } = useI18n()

    const {
      currentStep,
      formData,
      isLoading,
      baseInfoRef,
      handleStepChange,
      handleNextStep,
      handlePrevStep,
      handleUpdateBaseInfo,
      handleUpdateTemplateInfo,
      handleConfirm,
      handleClose,
    } = useNewFlow(props)

    // 步骤配置
    const steps = [
      {
        title: t('flow.content.basicSettings'),
        icon: 1,
        description: t('flow.content.chooseEnvironment'),
      },
      {
        title: t('flow.content.selectTemplate'),
        icon: 2,
        description: t('flow.content.startFromBlankOrTemplate'),
      },
    ]

    /**
     * 步骤切换前验证
     */
    async function handleBerforeChangeStep(index: number) {
      return true
    }

    /**
     * 步骤点击切换
     */
    async function stepChanged(index: number) {
      await handleStepChange(index)
    }

    /**
     * 切换步骤按钮
     */
    async function handleChangeStep() {
      if (currentStep.value === 1) {
        await handleNextStep()
      } else {
        handlePrevStep()
      }
    }

    /**
     * 确认创建
     */
    async function onConfirm() {
      try {
        await handleConfirm()
        onClose()
      } catch (error) {
        Message({
          message: t('flow.content.createFailed'),
          theme: 'error',
        })
      }
    }

    /**
     * 关闭弹窗
     */
    function onClose() {
      handleClose()
      emit('update:isShow', false)
    }

    return () => (
      <Dialog
        is-show={props.isShow}
        theme="primary"
        width={1200}
        quick-close={false}
        onClosed={onClose}
        class={styles.newFlowPopup}
      >
        {{
          header: () => (
            <div class={styles.header}>
              <span>{t('flow.content.newFlow')}</span>
              <div class={styles.stepContent}>
                <Steps
                  theme="primary"
                  controllable={true}
                  cur-step={currentStep.value}
                  steps={steps}
                  onClick={stepChanged}
                  before-change={handleBerforeChangeStep}
                ></Steps>
              </div>
            </div>
          ),
          default: () => (
            <div class={styles.content}>
              {currentStep.value === 1 ? (
                <BaseInfo
                  ref={baseInfoRef}
                  modelValue={formData.value.baseInfo}
                  onUpdate:modelValue={handleUpdateBaseInfo}
                />
              ) : (
                <SelectTemplate
                  modelValue={formData.value.templateInfo}
                  onUpdate:modelValue={handleUpdateTemplateInfo}
                />
              )}
            </div>
          ),
          footer: () => (
            <>
              <Button
                class={styles.btn}
                loading={isLoading.value}
                theme="primary"
                onClick={handleChangeStep}
              >
                {currentStep.value === 1
                  ? t('flow.content.nextStep')
                  : t('flow.content.previousStep')}
              </Button>
              {currentStep.value === 2 ? (
                <Button
                  class={styles.btn}
                  loading={isLoading.value}
                  theme="primary"
                  onClick={onConfirm}
                >
                  {t('flow.content.createAndStartOrchestrating')}
                </Button>
              ) : null}
              <Button class={styles.btn} loading={isLoading.value} onClick={onClose}>
                {t('flow.common.cancel')}
              </Button>
            </>
          ),
        }}
      </Dialog>
    )
  },
})
