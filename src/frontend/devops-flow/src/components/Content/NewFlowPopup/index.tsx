import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Dialog, Button, Steps, Message } from 'bkui-vue';
import styles from "./Index.module.css";
import BaseInfo from './BaseInfo';
import SelectTemplate from './SelectTemplate';

export default defineComponent({
  name: 'NewFlowPopup',
  props: {
    modelValue: {
      type: Boolean
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const isShow = ref(false);
    const isFormLoading = ref(false);
    const curStep = ref(1);
    const steps = ref([
      { title: t('flow.content.basicSettings'), icon: 1, description: t('flow.content.chooseEnvironment') },
      { title: t('flow.content.selectTemplate'), icon: 2, description: t('flow.content.startFromBlankOrTemplate') }
    ]);

    watch(() => props.modelValue, (show) => {
      isShow.value = show
    });

    function handleBerforeChangeStep(index: number) {
      return true
    }

    function stepChanged(index: number) {
      curStep.value = index;
    }

    function handleChangeStep() {
      curStep.value = curStep.value === 1 ? 2 : 1;
    }

    function handleConfirm() { }

    function handleCancel() {
      emit('update:modelValue', false)
    }

    return () => (
      <Dialog
        is-show={isShow.value}
        theme="primary"
        width={1200}
        quick-close={false}
        onClosed={handleCancel}
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
                  cur-step={curStep.value}
                  steps={steps.value}
                  onClick={stepChanged}
                  before-change={handleBerforeChangeStep}
                ></Steps>
              </div>
            </div>
          ),
          default: () => (
            <div class={styles.content}>
              {
                curStep.value === 1 ? (
                  <BaseInfo></BaseInfo>
                ) : (
                  <SelectTemplate></SelectTemplate>
                )
              }
            </div>
          ),
          footer: () => (
            <>
              <Button
                class={styles.btn}
                loading={isFormLoading.value}
                theme="primary"
                onClick={handleChangeStep}
              >
                {curStep.value === 1 ? t('flow.content.nextStep') : t('flow.content.previousStep')}
              </Button>
              {
                curStep.value === 2 ? (
                  <Button
                    class={styles.btn}
                    loading={isFormLoading.value}
                    theme="primary"
                    onClick={handleConfirm}
                  >
                    {t('flow.content.createAndStartOrchestrating')}
                  </Button>
                ) : null
              }
              <Button
                class={styles.btn}
                loading={isFormLoading.value}
                onClick={handleCancel}
              >
                {t('flow.common.cancel')}
              </Button>
            </>
          ),
        }}
      </Dialog>
    );
  },
});