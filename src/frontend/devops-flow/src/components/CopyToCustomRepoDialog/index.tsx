import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import styles from './CopyToCustomRepoDialog.module.css'

export default defineComponent({
  name: 'CopyToCustomRepoDialog',
  props: {
    artifact: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n()

    return () => <div class={styles.container}>CopyToCustomRepoDialog</div>
  },
})
