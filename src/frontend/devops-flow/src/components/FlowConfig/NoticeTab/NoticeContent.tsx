import { defineComponent, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Collapse, Switcher } from 'bkui-vue';
import styles from './NoticeTab.module.css';

export default defineComponent({
  name: 'TriggerContent',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const activeIndex = ref([0]);
    const list = ref([
      {
        type: 'successSubscriptionList',
        name: '运行成功时'
      },
      {
        type: 'failSubscriptionList',
        name: '运行失败时'
      },
      {
        type: 'successSubscriptionList',
        name: '运行取消时'
      },
      {
        type: 'failSubscriptionList',
        name: '发布新版本时'
      }
    ]);

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
            content: () => (
              <div class={styles.collapseContent}>content</div>
            )
          }}
        </Collapse>
      </div>
    );
  }
});