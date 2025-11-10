import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Message } from 'bkui-vue';
import styles from "./permissionDelegation.module.css";

export default defineComponent({
  name: 'PermissionDelegation',
  props: {
    
  },
  emits: [''],
  setup(props, { emit }) {
    const { t } = useI18n();
    const router = useRouter();

    return () => (
      <>
        <div class={styles.permissionDelegation}>
          <h3>权限委托</h3>
          <p>PermissionDelegation组件内容</p>
        </div>
      </>
    );
  },
});