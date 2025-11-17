import { defineComponent, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Collapse, Switcher } from 'bkui-vue'
import styles from './NoticeTab.module.css'

export default defineComponent({
  name: 'SettingContent',
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n()

    return () => <div>{t('flow.content.basicSettings')}</div>
  },
})
