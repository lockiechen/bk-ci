import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useModeStore } from '@/stores/flowMode'
import ModeSwitch from '@/components/ModeSwitch'
import EmptyPage from '@/components/EmptyPage/index'
import styles from './FlowModel.module.css'

export default defineComponent({
  name: 'FlowModel',
  components: {
    ModeSwitch,
    EmptyPage,
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const modeStore = useModeStore()

    return () => (
      <div class={styles.flowModel}>
        <ModeSwitch></ModeSwitch>

        <div class={styles.modelContent}>
          {modeStore.isCodeMode ? (
            <div>{t('flow.content.codeMode')}</div>
          ) : (
            <div>
              {!true ? (
                <div>{t('flow.content.pipeline')}</div>
              ) : (
                <EmptyPage
                  title={t('flow.content.blankTemplateNoOrchestration')}
                  desc={t('flow.content.createToAddFirstStage')}
                />
              )}
            </div>
          )}
        </div>
      </div>
    )
  },
})
