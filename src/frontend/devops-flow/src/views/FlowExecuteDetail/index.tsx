import { defineComponent, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Loading } from 'bkui-vue'
import DetailHeader from './DetailHeader'
import ExecutionStatusBar from './ExecutionStatusBar'
import ExecutionTab from './ExecutionTab'
import { useExecuteDetail } from '@/hooks/useExecuteDetail'
import styles from './FlowExecuteDetail.module.css'

export default defineComponent({
  name: 'ExecutionDetail',
  setup() {
    const route = useRoute()
    // 获取执行历史详情数据
    const { executeDetail, loading, executeInfo, initExecuteDetail } = useExecuteDetail()

    const showContent = computed(() => !loading.value && !!executeDetail.value)

    onMounted(async () => {
      await initExecuteDetail()
    })

    return () => (
      <Loading loading={loading.value} class={styles.executionDetail}>
        {showContent.value && <DetailHeader executeInfo={executeInfo.value} />}

        {/* 执行状态栏 - 仅在数据加载完成后渲染 */}
        {(showContent.value && executeDetail.value) && <ExecutionStatusBar execDetail={executeDetail.value} />}

        {showContent.value && (
          <div class={styles.contentWrapper}>
            <ExecutionTab />
          </div>
        )}
      </Loading>
    )
  },
})
