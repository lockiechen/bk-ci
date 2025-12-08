import { defineComponent, ref, computed } from 'vue'
import styles from './index.module.css'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { FlowHeader } from '@/components/FlowHeader'
import { EditHeader } from '@/components/EditHeader'
import type { FlowInfo } from '@/components/FlowHeader'
import layoutStyles from '@/styles/layout.module.css'
import { ROUTE_NAMES } from '@/constants/routes'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const flowId = route.params.flowId as string

    const flowInfo = ref<FlowInfo>({
      name: 'stream-ci-demo',
      versions: [
        { value: 'v5-p2-t3-3', label: 'V5 (P2.T3.3)', isLatest: true },
        { value: 'v5-p2-t3-2', label: 'V5 (P2.T3.2)' },
        { value: 'v5-p2-t3-1', label: 'V5 (P2.T3.1)' },
      ],
      currentVersion: 'v5-p2-t3-3',
    })

    // Check if current route is in edit mode
    const isEditMode = computed(() => {
      const routeName = route.name as string
      return routeName?.startsWith('edit')
    })

    const handleVersionChange = (version: string) => {
      flowInfo.value.currentVersion = version
      // TODO: 处理版本切换逻辑
      console.log('版本切换:', version)
    }

    const handleEdit = () => {
      router.push({
        name: ROUTE_NAMES.FLOW_EDIT_WORKFLOW_ORCHESTRATION,
        params: { flowId },
      })
    }

    const handleExecute = () => {
      // TODO: 处理执行逻辑
      console.log('执行')
    }

    return () => (
      <div class={layoutStyles.page}>
        {isEditMode.value ? (
          <EditHeader />
        ) : (
          <FlowHeader
            flowInfo={flowInfo.value}
            onVersionChange={handleVersionChange}
            onEdit={handleEdit}
            onExecute={handleExecute}
          />
        )}
        <div class={styles.content}>
          <RouterView />
        </div>
      </div>
    )
  },
})
