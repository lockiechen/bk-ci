import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Message } from 'bkui-vue';
import styles from "./TriggerEvent.module.css";

export default defineComponent({
  name: 'TriggerEvent',
  props: {
    
  },
  emits: [''],
  setup(props, { emit }) {
    const { t } = useI18n();
    const router = useRouter();

    return () => (
      <>
        <div class={styles.triggerEvent}>
          <h3>触发事件</h3>
          <p>TriggerEvent组件内容</p>
        </div>
      </>
    );
  },
});