import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Tab } from 'bkui-vue'
import { useExecuteDetail } from '@/hooks/useExecuteDetail'
import ExecPipeline from './ExecPipeline'
import Outputs from './Outputs'
import StartParams from './StartParams'
import { ROUTE_NAMES } from '@/constants/routes'
import styles from './ExecutionTab.module.css'

export default defineComponent({
  name: 'ExecutionTab',
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const flowId = route.params.flowId as string
    const buildNo = route.params.buildNo as string
    const { executeDetail } = useExecuteDetail()
    const curItemTab = ref((route.params.type as string) || 'executeDetail')
    
    // 监听路由变化，同步更新当前 tab
    watch(
      () => route.params.type,
      (newType) => {
        curItemTab.value = (newType as string) || 'executeDetail'
      },
    )

    const isLatestBuild = computed(
      () =>
        executeDetail.value?.buildNum === executeDetail.value?.latestBuildNum &&
        executeDetail.value?.curVersion === executeDetail.value?.latestVersion,
    )
    const isRunning = computed(() =>
      ['RUNNING', 'QUEUE'].includes(executeDetail.value?.status as string),
    )

    const panels = computed(() => [
      {
        name: 'executeDetail',
        label: t('flow.execute.executeDetail'),
        component: ExecPipeline,
        bindData: {
          execDetail: executeDetail.value,
          isLatestBuild: isLatestBuild.value,
          matchRules: [],
          isRunning: isRunning.value,
        },
      },
      {
        name: 'outputs',
        label: t('flow.execute.outputArtifact'),
        component: Outputs,
        bindData: {
          currentTab: 'artifacts',
        },
      },
      {
        name: 'reports',
        label: t('flow.execute.outputReport'),
        component: Outputs,
        bindData: {
          currentTab: 'reports',
        },
      },
      {
        name: 'startupParams',
        label: t('flow.execute.startupParameters'),
        component: StartParams,
        bindData: {},
      },
    ])

    const changeTab = (panel: string) => {
      // 先更新本地状态，让切换更流畅
      curItemTab.value = panel
      
      // 更新路由
      router.push({
        name: ROUTE_NAMES.FLOW_DETAIL_EXECUTION_DETAIL,
        params: {
          ...route.params,
          type: panel,
        },
        query: route.query,
      })
    }

    return () => (
      <div class={styles.executionTab}>
        <Tab
          v-model:active={curItemTab.value}
          type="card-tab"
          class={styles.tabSwitcher}
          onChange={changeTab}
        >
          {panels.value.map((panel) => {
            const Component = panel.component
            return (
              <Tab.TabPanel name={panel.name} label={panel.label} key={panel.name}>
                {Component && <Component {...panel.bindData} />}
              </Tab.TabPanel>
            )
          })}
        </Tab>
      </div>
    )
  },
})
