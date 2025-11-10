import { computed, defineComponent } from "vue";
import { FlowGroupAside } from "@/components/FlowGroupAside";
import { Content } from "@/components/Content";
import styles from "./index.module.css";
import layoutStyles from '@/styles/layout.module.css'
import { Tab } from "bkui-vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";


export default defineComponent({
  name: "Flow",
  props: {
    groupId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();
    
    const activeTab = computed(() => {
      // 如果是 flowGroup 路由，返回 'flow' 作为 tab 的激活状态
      return (route.name ?? 'flowList') as string;
    });

    const handleTabChange = (name: string) => {
      if (name === activeTab.value) return;
      router.push({ name });
    };
    return () => (
      <div class={layoutStyles.page}>
        <div class={styles.header}>
            <div class={styles.headerLeft}>
              <img src="/devops-flow-logo.svg" alt="flow" class={styles.logo} />
              <span class={styles.title}>{t('flow.title')}</span>
            </div>
            <Tab 
              active={activeTab.value}
              type="unborder-card"
              class={styles.navTabs}
              onChange={handleTabChange}
            >
              <Tab.TabPanel name="flowList" label={t('flow.tabs.flow')}></Tab.TabPanel>
              <Tab.TabPanel name="template" label={t('flow.tabs.template')}></Tab.TabPanel>
            </Tab>
        </div>
        <div class={layoutStyles.content}>
            <div class={styles.sidebar}>
                <FlowGroupAside />
              </div>
              <div class={styles.content}>
                <Content groupId={props.groupId} />
              </div>
          </div>
      </div>
    );
  },
});