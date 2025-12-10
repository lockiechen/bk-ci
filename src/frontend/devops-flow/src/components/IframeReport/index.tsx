import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import styles from './IframeReport.module.css'

export default defineComponent({
  name: 'IframeReport',
  props: {
    reportIcon: {
      type: String,
      default: 'order',
    },
    reportName: {
      type: String,
      default: '',
    },
    indexFileUrl: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n()

    return () => <div class={styles.container}>IframeReport</div>
  },
})
