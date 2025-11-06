import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Message } from 'bkui-vue';
import styles from "./ChangeLog.module.css";

export default defineComponent({
  name: 'ChangeLog',
  props: {
    
  },
  emits: [''],
  setup(props, { emit }) {
    const { t } = useI18n();
    const router = useRouter();

    return () => (
      <>
        <div class={styles.changeLog}>
          <h3>变更日志</h3>
          <p>ChangeLog组件内容</p>
        </div>
      </>
    );
  },
});