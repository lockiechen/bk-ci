import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useModeStore } from '@/stores/flowMode'
import ModeSwitch from '@/components/ModeSwitch'
import EmptyPage from '@/components/EmptyPage/index'
import TriggerContent from './TriggerContent'
import styles from './TriggerTab.module.css'

export default defineComponent({
  name: 'TriggerTab',
  components: {
    ModeSwitch,
    TriggerContent,
    EmptyPage,
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const modeStore = useModeStore()

    return () => (
      <div class={styles.triggerTab}>
        <ModeSwitch></ModeSwitch>

        <div class={styles.content}>
          {modeStore.isCodeMode ? (
            <div>{t('flow.content.codeMode')}</div>
          ) : (
            <div>{true ? <TriggerContent /> : <EmptyPage />}</div>
          )}
        </div>
      </div>
    )
  },
})
