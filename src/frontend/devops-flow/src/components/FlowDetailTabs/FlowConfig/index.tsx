import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Message } from 'bkui-vue';
import styles from "./FlowConfig.module.css";

export default defineComponent({
  name: 'FlowConfig',
  props: {
    
  },
  emits: [''],
  setup(props, { emit }) {
    const { t } = useI18n();
    const router = useRouter();

    return () => (
      <>
        <div class={styles.flowConfig}>
          <h3>流程配置</h3>
          <p>FlowConfig组件内容</p>
        </div>
      </>
    );
  },
});