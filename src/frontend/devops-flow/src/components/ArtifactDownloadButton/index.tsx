import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import styles from './ArtifactDownloadButton.module.css'

export default defineComponent({
  name: 'ArtifactDownloadButton',
  props: {
    downloadIcon: Boolean,
    hasPermission: Boolean,
    artifactoryType: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    output: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n()

    return () => <div class={styles.container}>ArtifactDownloadButton</div>
  },
})
