import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Input, Button, Table } from 'bkui-vue'
import styles from './ExecutionTab.module.css'

export default defineComponent({
  name: 'ExecutionTab',
  setup() {
    const route = useRoute()
    const flowId = route.params.flowId as string
    const buildNo = route.params.buildNo as string

    const tabs = [
      { key: 'detail', label: '执行详情' },
      { key: 'artifact', label: '产出物', badge: 2 },
      { key: 'report', label: '产出报告' },
      { key: 'params', label: '启动参数' },
    ]

    return () => (
      <div class={styles.executionTab}>
        执行详情的tab区： 执行详情、产出制品、产出报告、启动参数
        
      </div>
    )
  },
})
