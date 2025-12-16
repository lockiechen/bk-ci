import { defineComponent, ref, computed } from 'vue'
import styles from './index.module.css'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { FlowHeader } from '@/components/FlowHeader'
import { EditHeader } from '@/components/EditHeader'
import layoutStyles from '@/styles/layout.module.css'
import { ROUTE_NAMES } from '@/constants/routes'
import { useFlowInfo } from '@/hooks/useFlowInfo'
import type { FlowInfo, FlowVersion } from '@/types/flow'

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
      // TODO: 处理执行逻辑
      console.log('执行')
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
