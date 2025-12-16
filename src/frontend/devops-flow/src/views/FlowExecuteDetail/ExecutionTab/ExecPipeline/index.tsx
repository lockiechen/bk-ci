import { defineComponent } from 'vue'
import type { ExecuteDetailData } from '@/api/executeDetail'

export default defineComponent({
  name: 'ExecPipeline',
  props: {
    execDetail: {
      type: Object as () => ExecuteDetailData | null,
      default: null,
    },
    isLatestBuild: {
      type: Boolean,
      default: false,
    },
    matchRules: {
      type: Array,
      default: () => [],
    },
    isRunning: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    return () => (
      <div>
        <h3>执行详情</h3>
      </div>
    )
  },
})
