import { useExecuteDetail } from '@/hooks/useExecuteDetail'
import { Loading } from 'bkui-vue'
import { computed, defineComponent, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import DetailHeader from './DetailHeader'
import ExecutionStatusBar from './ExecutionStatusBar'
import ExecutionTab from './ExecutionTab'
import styles from './FlowExecuteDetail.module.css'

export default defineComponent({
  name: 'ExecutionDetail',
  setup() {
    const route = useRoute()
    // 获取执行历史详情数据（从 store 中获取，全局唯一）
    const { executeDetail, loading, executeInfo, initExecuteDetail } = useExecuteDetail()

    const showContent = computed(() => !loading.value && !!executeDetail.value)

    // 监听 buildNo 变化（切换到不同的构建详情时）重新加载数据
    watch(
      () => route.params.buildNo,
      async (newBuildNo, oldBuildNo) => {
        // 只有 buildNo 真正变化时才重新加载（避免初始化时重复加载）
        if (newBuildNo !== oldBuildNo && oldBuildNo !== undefined) {
          await initExecuteDetail()
        }
      },
      { immediate: false },
    )

    // 监听 executeCount 变化（轮询或手动刷新）
    watch(
      () => route.query.executeCount,
      async (newCount, oldCount) => {
        // executeCount 变化时重新加载数据
        if (newCount !== oldCount && oldCount !== undefined) {
          await initExecuteDetail()
        }
      },
      { immediate: false },
    )

    onMounted(async () => {
      await initExecuteDetail()
    })

    return () => (
      <Loading loading={loading.value} class={styles.executionDetail}>
        {showContent.value && <DetailHeader executeInfo={executeInfo.value} />}

        {/* 执行状态栏 - 仅在数据加载完成后渲染 */}
        {showContent.value && executeDetail.value && <ExecutionStatusBar />}

        {showContent.value && (
          <div class={styles.contentWrapper}>
            <ExecutionTab />
          </div>
        )}
      </Loading>
    )
  },
})
