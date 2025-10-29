import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { Button, Input } from "bkui-vue";
import styles from "./Content.module.css";

export const Content = defineComponent({
  name: "Content",
  setup() {
    const { t } = useI18n();

    return () => (
      <div class={styles.content}>
        <div class={styles.toolbar}>
          <h2 class={styles.title}>{t('flow.content.allFlows')}</h2>
          <Button theme="primary">{t('flow.content.newFlow')}</Button>
          <Button>{t('flow.content.batchManage')}</Button>
          <div class={styles.searchBox}>
            <Input 
              placeholder={t('flow.content.searchPlaceholder')}
              left-icon="search"
            />
          </div>
        </div>
        <div class={styles.tableContainer}>
          <div class={styles.emptyState}>
            {t('flow.content.emptyState')}
          </div>
        </div>
      </div>
    );
  },
});
