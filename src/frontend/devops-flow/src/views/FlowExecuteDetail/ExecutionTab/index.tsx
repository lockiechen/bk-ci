import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Input, Button, Table } from 'bkui-vue'
import styles from './ExecutionTab.module.css'

export default defineComponent({
  name: 'ExecutionTab',
  setup() {
    const route = useRoute()
    const { t } = useI18n()
    const flowId = route.params.flowId as string
    const buildNo = route.params.buildNo as string

    const tabs = [
      { key: 'detail', label: t('flow.content.executionDetail') },
      { key: 'artifact', label: t('flow.content.artifact'), badge: 2 },
      { key: 'report', label: t('flow.content.report') },
      { key: 'params', label: t('flow.content.startParams') },
    ]

    return () => (
      <div class={styles.executionTab}>
        {t('flow.content.executionDetail')}的tab区： {t('flow.content.executionDetail')}、
        {t('flow.content.artifact')}、{t('flow.content.report')}、{t('flow.content.startParams')}
      </div>
    )
  },
})
