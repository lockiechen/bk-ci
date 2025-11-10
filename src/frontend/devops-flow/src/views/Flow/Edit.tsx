import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Button } from 'bkui-vue'
import styles from './index.module.css'

export default defineComponent({
  name: 'FlowEdit',
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const flowId = route.params.flowId as string

    return () => (
      <div class={styles.pageContent}>
        <div class={styles.pagePlaceholder}>
          <h2>
            {t('flow.content.edit')} {t('flow.title')}
          </h2>
          <p>
            {t('flow.content.edit')} {t('flow.content.workflowConfig')}{' '}
            {t('flow.content.toBeImplemented')}
          </p>
          <p>Flow ID: {flowId}</p>
          <Button theme="primary">{t('flow.common.confirm')}</Button>
        </div>
      </div>
    )
  },
})
