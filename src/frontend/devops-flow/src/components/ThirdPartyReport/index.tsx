import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import styles from './ThirdPartyReport.module.css'

export default defineComponent({
  name: 'ThirdPartyReport',
  props: {
    reportList: Array,
  },
  setup(props, { emit }) {
    const { t } = useI18n()

    return () => <div class={styles.container}>ThirdPartyReport</div>
  },
})
