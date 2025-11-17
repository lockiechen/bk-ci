import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Message } from 'bkui-vue';
import styles from "./permissionSettings.module.css";

export default defineComponent({
  name: 'PermissionSettings',
  props: {
    
  },
  emits: [''],
  setup(props, { emit }) {
    const { t } = useI18n();
    const router = useRouter();

    return () => (
      <>
        <div class={styles.permissionSettings}>
          <h3>权限设置</h3>
          <p>PermissionSettings组件内容</p>
        </div>
      </>
    );
  },
});