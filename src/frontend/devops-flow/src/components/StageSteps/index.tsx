import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SvgIcon } from '@/components/SvgIcon'
import styles from './StageSteps.module.css'

export default defineComponent({
  name: 'StageSteps',
  components: {
    SvgIcon,
  },
  props: {
    steps: {
      type: Array,
      default: () => [],
    },
    buildId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const getRunningCls = (statusCls: string) => {
      return statusCls === 'RUNNING' ? styles.spinIcon : ''
    }
    // TODO RUNNING时的tooltips

    return () => (
      <div class={styles.stageSteps}>
        {props.steps.map((step: any) => {
          const stepClassNames = [styles.stageStep, styles[step.statusCls]]
            .filter(Boolean)
            .join(' ')

          const logoClassNames = [
            styles.stepIcon,
            styles[step.statusCls],
            getRunningCls(step.statusCls),
          ]
            .filter(Boolean)
            .join(' ')

          const logoProps = {
            class: logoClassNames,
            name: step.icon,
            size: 16,
          }

          if (step.tooltip) {
            return (
              <span v-bk-tooltips={step.tooltip} class={stepClassNames} key={step.stageId}>
                <SvgIcon {...logoProps} />
              </span>
            )
          } else if (step.status === 'RUNNING') {
            return (
              <span data-stageId={step.stageId} class={stepClassNames} key={step.stageId}>
                <SvgIcon {...logoProps} />
              </span>
            )
          } else {
            return (
              <span class={stepClassNames} key={step.stageId}>
                <SvgIcon {...logoProps} />
              </span>
            )
          }
        })}
      </div>
    )
  },
})
