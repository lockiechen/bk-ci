import { EditHeader } from '@/components/EditHeader'
import { FlowHeader } from '@/components/FlowHeader'
import { ROUTE_NAMES } from '@/constants/routes'
import { useFlowInfo } from '@/hooks/useFlowInfo'
import layoutStyles from '@/styles/layout.module.css'
import type { FlowInfo, FlowVersion } from '@/types/flow'
import { computed, defineComponent } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import styles from './index.module.css'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const flowId = route.params.flowId as string
    const { flowInfo, flowVersionList } = useFlowInfo()

    // Check if current route is in edit mode
    const isEditMode = computed(() => {
      const routeName = route.name as string
      return routeName?.startsWith('edit')
    })

    const handleVersionChange = (version: number) => {
      router.push({
        name: ROUTE_NAMES.FLOW_DETAIL_EXECUTION_RECORD,
        params: { flowId, version },
      })
    }

    const handleEdit = () => {
      router.push({
        name: ROUTE_NAMES.FLOW_EDIT_WORKFLOW_ORCHESTRATION,
        params: { flowId },
      })
    }

    const handleExecute = () => {
      router.push({
        name: ROUTE_NAMES.FLOW_PREVIEW,
        params: { flowId, version: flowInfo.value?.releaseVersion },
      })
    }

    return () => (
      <div class={layoutStyles.page}>
        {isEditMode.value ? (
          <EditHeader />
        ) : (
          <FlowHeader
            flowInfo={flowInfo.value as FlowInfo}
            versionList={flowVersionList.value as FlowVersion[]}
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
