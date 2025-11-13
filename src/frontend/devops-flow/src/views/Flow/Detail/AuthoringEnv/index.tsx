import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useModeStore } from '@/stores/flowMode.ts'
import ModeSwitch from '@/components/ModeSwitch'
import EmptyPage from '@/components/EmptyPage/index'
import AuthoringContent from './AuthoringContent.tsx'
import styles from './AuthoringEnv.module.css'

export default defineComponent({
  name: 'AuthoringEnv',
  components: {
    ModeSwitch,
    AuthoringContent,
    EmptyPage,
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const modeStore = useModeStore()

    return () => (
      <div class={styles.authoringEnv}>
        <ModeSwitch></ModeSwitch>

        <div class={styles.content}>
          {modeStore.isCodeMode ? (
            <div>{t('flow.content.codeMode')}</div>
          ) : (
            <div>{true ? <AuthoringContent /> : <EmptyPage />}</div>
          )}
        </div>
      </div>
    )
  },
})
