import { defineComponent, computed } from 'vue'
import { statusIconMap, statusAlias, statusColorMap } from '@/utils/flowStatus'
import { SvgIcon } from '@/components/SvgIcon'
import { type StatusType } from "@/api/flowContentList";
import styles from './StatusIcon.module.css'

type StatusKey = keyof typeof statusIconMap
function isValidStatus(status: string): status is StatusKey {
  return status in statusIconMap
}

export default defineComponent({
  name: 'StatusIcon',
  components: {
    SvgIcon,
  },
  props: {
    status: {
      type: String as () => StatusType,
      default: '',
    },
    size: {
      type: [Number, String],
      default: 16,
    }
  },
  setup(props) {
    const logoName = computed(() => {
      const status = props.status || statusAlias.UNEXEC
      return isValidStatus(status) ? statusIconMap[status] : statusIconMap.UNKNOWN
    })
    const isRunning = computed(() => logoName.value === 'circle-2-1')
    const isEnqueue = computed(() => logoName.value === 'hourglass')

    return () => (
      <span
        class={[
          styles.statusIcon,
          isRunning.value ? 'spinIcon' : '',
          isEnqueue.value ? styles.hourglassQueue : '',
        ]}
        style={{color: statusColorMap[props.status || statusAlias.UNEXEC]}}
      >
        <SvgIcon name={logoName.value} size={props.size} />
      </span>
    )
  },
})
