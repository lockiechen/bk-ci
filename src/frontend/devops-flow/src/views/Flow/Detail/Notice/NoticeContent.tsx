import { defineComponent, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Collapse, Switcher } from 'bkui-vue'
import styles from './NoticeTab.module.css'

export default defineComponent({
  name: 'TriggerContent',
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const activeIndex = ref([0])
    const list = ref([
      {
        type: 'successSubscriptionList',
        name: t('flow.content.runSuccess'),
      },
      {
        type: 'failSubscriptionList',
        name: t('flow.content.runFailed'),
      },
      {
        type: 'successSubscriptionList',
        name: t('flow.content.runCanceled'),
      },
      {
        type: 'failSubscriptionList',
        name: t('flow.content.newVersionPublished'),
      },
    ])

    return () => (
      <div>
        <Collapse
          v-model={activeIndex.value}
          list={list.value}
          header-icon="right-shape"
          use-card-theme
          class={styles.collapse}
        >
          {{
            content: () => <div class={styles.collapseContent}>content</div>,
          }}
        </Collapse>
      </div>
    )
  },
})
