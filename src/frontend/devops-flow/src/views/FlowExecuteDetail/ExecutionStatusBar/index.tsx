import { defineComponent, ref, computed, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { convertTime } from '@/utils/util'
import { Tag } from 'bkui-vue'
import Summary from '@/components/Summary'
import { SvgIcon } from '@/components/SvgIcon'
import { type ExecuteDetailData } from '@/types/flow'
import { mapThemeOfStatus } from '@/utils/flowStatus'
import styles from './ExecutionStatusBar.module.css'

export default defineComponent({
  name: 'ExecutionStatusBar',
  props: {
    execDetail: {
      type: Object as PropType<ExecuteDetailData>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const summaryVisible = ref(true)
    const show = ref(false)

    // 状态标签主题映射
    const statusTagTheme = computed(() => {
      return mapThemeOfStatus(props.execDetail.status) || ''
    })

    // 状态标签文本
    const statusLabel = computed(() => {
      return t(`flow.statusMap.${props.execDetail.status}`)
    })

    // 是否正在运行
    const isRunning = computed(() => {
      return ['RUNNING', 'QUEUE'].includes(props.execDetail.status)
    })

    // 格式化开始时间
    const execFormatStartTime = computed(() => {
      return convertTime(props.execDetail?.queueTime)
    })

    const recordList = computed(() => {
      const list = [...(props.execDetail.recordList || [])]
      return (
        list.reverse().map((record, index) => ({
          id: index + 1,
          user: record.startUser,
        })) ?? []
      )
    })

    const executeCount = computed(() => {
      return props.execDetail.executeCount || 0
    })

    // 触发用户
    const startUser = computed(() => {
      return recordList.value.find((i) => i.id === executeCount.value)?.user || ''
    })

    // 折叠/展开
    const collapseSummary = () => {
      summaryVisible.value = !summaryVisible.value
    }

    // 渲染状态图标
    const renderStatusIcon = () => {
      if (props.execDetail?.status === 'QUEUE') {
        return <SvgIcon class="hourglass-queue" name="hourglass" />
      }
      if (props.execDetail?.status === 'RUNNING') {
        return <SvgIcon class="spinIcon" name="circle-2-1" />
      }
      return null
    }

    const handlerScroll = (e: any) => {
      show.value = e.target.scrollTop > 88
    }

    return () => (
      <div class={styles.statusBarWrapper}>
        <div class={styles.execDetailSummaryHeader} onScroll={handlerScroll}>
          <span
            class={[
              styles.execDetailBuildSummaryAnchor,
              props.execDetail?.status ? styles[props.execDetail.status] : null,
            ]}
          ></span>
          <aside class={styles.execDetailSummaryHeaderTitle}>
            <Tag class={styles.execStatusTag} type="stroke" theme={statusTagTheme.value}>
              <span class={styles.execStatusLabel}>
                {isRunning.value ? renderStatusIcon() : null}

                {statusLabel.value}

                {props.execDetail?.status === 'CANCELED' && (
                  <SvgIcon
                    name="info-circle"
                    class={styles.infoIcon}
                    v-bk-tooltips={`${t('flow.execute.canceller')}：${props.execDetail?.cancelUserId || '--'}`}
                  />
                )}
              </span>
            </Tag>
            <span v-bk-overflow-tips class={styles.execDetailSummaryHeaderBuildMsg}>
              {props.execDetail?.buildMsg}
            </span>
          </aside>

          <aside class={styles.execDetailSummaryHeaderTrigger}>
            {props.execDetail?.triggerUserProfile ? (
              <img class={styles.execTriggerProfile} />
            ) : null}

            <SvgIcon class={styles.execTriggerProfile} name="default-user" size={24} />

            {startUser.value ? (
              <span>
                {t('flow.execute.executorInfo', [
                  startUser.value,
                  props.execDetail?.trigger,
                  execFormatStartTime.value,
                ])}
              </span>
            ) : null}
          </aside>
        </div>
        <p class={show.value ? styles.summaryHeaderShadow : ''}></p>

        <Summary visible={summaryVisible.value} execDetail={props.execDetail}></Summary>

        <p class={styles.pipelineExecGap}>
          <span
            onClick={collapseSummary}
            class={[
              styles.summaryCollapsedHandler,
              !summaryVisible.value ? styles.isCollapsed : '',
            ]}
          >
            <SvgIcon name="arrows-up" size={18} />
          </span>
        </p>
      </div>
    )
  },
})
