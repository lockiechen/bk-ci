import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { FLOW_DETAIL_TABS, isValidFlowDetailTab } from '@/constants/routes'
import styles from './Detail.module.css'
import layoutStyles from '@/styles/layout.module.css'

export default defineComponent({
  name: 'FlowDetail',
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const flowId = route.params.flowId as string

    // 从路由名称获取当前 tab（直接使用路由名称）
    const currentTab = computed(() => {
      const routeName = route.name as string
      // 如果路由名称在 FLOW_DETAIL_TABS 中，直接返回
      if (isValidFlowDetailTab(routeName as string)) {
        return routeName
      }
      return FLOW_DETAIL_TABS.EXECUTION_RECORD
    })

    // 菜单分组配置 - 根据 FLOW_DETAIL_TABS 自动生成

    // 根据 FLOW_DETAIL_TABS 生成菜单数据
    // key 和 label 都使用 routeName，label 通过国际化转换
    const menuItems = [
      {
        title: t('flow.content.executionInfo'),
        tabs: [FLOW_DETAIL_TABS.EXECUTION_RECORD, FLOW_DETAIL_TABS.TRIGGER_RECORD,],
      },
      {
        title: t('flow.content.workflowConfig'),
        tabs: [
          FLOW_DETAIL_TABS.WORKFLOW_ORCHESTRATION,
          FLOW_DETAIL_TABS.WORKFLOW_ENVIRONMENT,
          FLOW_DETAIL_TABS.TRIGGER_EVENTS,
          FLOW_DETAIL_TABS.NOTIFICATION_CONFIG,
          FLOW_DETAIL_TABS.BASIC_SETTINGS,
        ],
      },
      {
        title: t('flow.content.more'),
        tabs: [
          FLOW_DETAIL_TABS.PERMISSION_SETTINGS,
          FLOW_DETAIL_TABS.PERMISSION_DELEGATION,
          FLOW_DETAIL_TABS.OPERATION_LOG,
        ],
      },
    ]

    // 处理菜单点击 - 跳转到对应的子路由
    // 由于 FLOW_DETAIL_TABS 的值就是路由名称，所以可以直接使用
    const handleMenuClick = (key: string) => {
      if (!isValidFlowDetailTab(key)) {
        // 如果 tab 不合法，重定向到默认 tab
        router.push({
          name: FLOW_DETAIL_TABS.EXECUTION_RECORD,
          params: { flowId },
        })
        return
      }

      // key 就是路由名称，直接使用
      router.push({
        name: key,
        params: { flowId },
      })
    }

    return () => (
      <div class={layoutStyles.content}>
        <nav class={styles.sidebar}>
          {menuItems.map((item, index) => (
            <div key={index} class={styles.menuGroup}>
              {item.tabs.length > 0 && (
                <>
                  <div class={styles.menuCategory}>{item.title}</div>
                  <div class={styles.subMenu}>
                    {item.tabs.map((child) => (
                      <button
                        key={child}
                        class={[
                          styles.menuItem,
                          currentTab.value === child && styles.menuItemActive,
                        ]}
                        onClick={() => handleMenuClick(child)}
                      >
                        {t(`flow.content.${child}`)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>

        <div class={styles.content}>
          <RouterView />
        </div>
      </div>
    )
  },
})
