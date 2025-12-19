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

    // 监听路由参数变化，特别是 executeCount，重新加载数据
    watch(
      () => [route.query.executeCount, route.params.buildNo],
      async () => {
        await initExecuteDetail()
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
