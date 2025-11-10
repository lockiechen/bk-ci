import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Message } from 'bkui-vue';
import styles from "./BuildHistory.module.css";

export default defineComponent({
  name: 'BuildHistory',
  props: {
    
  },
  emits: [''],
  setup(props, { emit }) {
    const { t } = useI18n();
    const router = useRouter();

    return () => (
      <>
        <div class={styles.buildHistory}>
          <h3>构建历史</h3>
          <p>BuildHistory组件内容</p>
        </div>
      </>
    );
  },
});