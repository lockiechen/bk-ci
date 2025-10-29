import { defineComponent, computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Tab } from "bkui-vue";
import styles from "./App.module.css";

const { TabPanel } = Tab;

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const activeTab = computed(() => (route.name ?? 'flow') as string);

    const handleTabChange = (name: string) => {
      if (name === activeTab.value) return;
      console.log(name);
      router.push({ name });
    };

    return () => (
      <div class={styles.app}>
        <div class={styles.header}>
          <div class={styles.headerLeft}>
            <img src="/devops-flow-logo.svg" alt="flow" class={styles.logo} />
            <span class={styles.title}>创作流</span>
          </div>
          <Tab 
            active={activeTab.value}
            type="unborder-card"
            class={styles.navTabs}
            onChange={handleTabChange}
          >
            <TabPanel name="flow" label="创作流"></TabPanel>
            <TabPanel name="template" label="模板"></TabPanel>
          </Tab>
        </div>
        <div class={styles.tabContent}>
          <router-view />
        </div>
      </div>
    );
  },
});