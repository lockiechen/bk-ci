import { defineComponent, computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { Tab } from "bkui-vue";
import styles from "./App.module.css";

const { TabPanel } = Tab;

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();
    
    const activeTab = computed(() => {
      // 如果是 flowGroup 路由，返回 'flow' 作为 tab 的激活状态
      return (route.name ?? 'flowGroup') as string;
    });

    const handleTabChange = (name: string) => {
      if (name === activeTab.value) return;
      router.push({ name });
    };

    return () => (
      <div class={styles.app}>
        <div class={styles.header}>
          <div class={styles.headerLeft}>
            <img src="/devops-flow-logo.svg" alt="flow" class={styles.logo} />
            <span class={styles.title}>{t('flow.title')}</span>
          </div>
          <Tab 
            active={activeTab.value}
            type="unborder-card"
            label-height={47}
            class={styles.navTabs}
            onChange={handleTabChange}
          >
            <TabPanel name="flowGroup" label={t('flow.tabs.flow')}></TabPanel>
            <TabPanel name="template" label={t('flow.tabs.template')}></TabPanel>
          </Tab>
        </div>
        <div class={styles.tabContent}>
          <router-view />
        </div>
      </div>
    );
  },
});