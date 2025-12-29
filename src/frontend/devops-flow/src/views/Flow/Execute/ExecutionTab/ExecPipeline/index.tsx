import { SvgIcon } from '@/components/SvgIcon'
import { useExecuteDetail } from '@/hooks/useExecuteDetail'
import { STATUS, type ExecutionRecord, type FlowModel } from '@/types/flow'
import { isSkip } from '@/utils/flowStatus'
import { convertMillSec, convertTime } from '@/utils/util'
import 'bkui-pipeline/dist/bk-pipeline.css'
import BkPipeline from 'bkui-pipeline/vue3'
import { Button, Checkbox, Popover, Select } from 'bkui-vue'
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import styles from './ExecPipeline.module.css'

interface TimeStep {
  title: string
  description: string
  hasPopup: boolean
  popupContent?: 'queue' | 'time'
}

interface TimeDetailRow {
  field: string
  label: string
  value: string
}

interface ExecuteCountOption {
  id: number
  name: string
  user: string
  timeCost?: string
}

export default defineComponent({
  name: 'ExecPipeline',
  props: {
    matchRules: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    
    // 从 store 获取执行详情数据（全局唯一）
    const { executeDetail, isRunning } = useExecuteDetail()

    // ==================== State ====================
    const hideSkipExecTask = ref(false)
    const isExpandAllMatrix = ref(true)
    const showLog = ref(false)
    const showErrors = ref(false)
    const activeErrorAtom = ref<any>(null)
    const bkPipelineRef = ref<any>(null)
    const scrollBoxRef = ref<HTMLElement | null>(null)
    const errorPopupRef = ref<HTMLElement | null>(null)

    // ==================== Computed: Pipeline Data ====================
    const curPipeline = computed<FlowModel | null>(() => {
      return executeDetail.value?.model || null
    })

    // 根据 hideSkipExecTask 过滤跳过的步骤，同时过滤掉第一个stage
    const filteredPipeline = computed<FlowModel | null>(() => {
      if (!curPipeline.value) {
        return null
      }

      // 过滤掉第一个stage
      const stagesWithoutFirst = curPipeline.value.stages?.slice(1) || []

      if (!hideSkipExecTask.value) {
        return {
          ...curPipeline.value,
          stages: stagesWithoutFirst,
        }
      }

      const stages = stagesWithoutFirst
        .filter((stage) => !isSkip(stage.status))
        .map((stage) => {
          const containers = stage.containers
            ?.filter((container) => !isSkip(container.status))
            .map((container) => {
              const elements = container.elements?.filter(
                (element) => !isSkip(element.status),
              )

              // 处理矩阵组容器
              if (container.matrixGroupFlag && Array.isArray(container.groupContainers)) {
                return {
                  ...container,
                  elements,
                  groupContainers: container.groupContainers
                    .filter((groupContainer) => !isSkip(groupContainer.status))
                    .map((groupContainer) => {
                      const subElements = groupContainer.elements?.filter(
                        (element: any, index: number) =>
                          !isSkip(element.status ?? elements?.[index]?.status),
                      )
                      return {
                        ...groupContainer,
                        elements: subElements,
                      }
                    }),
                }
              }

              return {
                ...container,
                elements,
              }
            })

          return {
            ...stage,
            containers,
          }
        })

      return {
        ...curPipeline.value,
        stages,
      }
    })

    const executeCount = computed(() => {
      return route.query.executeCount ? Number(route.query.executeCount) : executeDetail.value?.executeCount ?? 1
    })

    const cancelUserId = computed(() => {
      return executeDetail.value?.cancelUserId ?? '--'
    })

    // ==================== Computed: Execute Count Options ====================
    const executeCounts = computed<ExecuteCountOption[]>(() => {
      const len = executeDetail.value?.recordList?.length ?? 0
      return (
        executeDetail.value?.recordList
          ?.map((record: ExecutionRecord, index: number) => ({
            id: len - index,
            name: `${len - index} / ${len}`,
            user: record.startUser,
            timeCost: convertMillSec(
              (record.timeCost?.totalCost || 0) + (record.timeCost?.queueCost || 0),
              true,
            ),
          }))
          .reverse() ?? []
      )
    })

    // ==================== Computed: Status & Labels ====================
    const statusLabel = computed(() => {
      return executeDetail.value?.status
        ? t(`flow.statusMap.${executeDetail.value.status}`)
        : ''
    })

    // ==================== Computed: Time Information ====================
    const timeSteps = computed<TimeStep[]>(() => {
      return [
        {
          title: t('flow.execute.triggerTime'),
          description: convertTime(executeDetail.value?.queueTime || 0),
          hasPopup: true,
          popupContent: 'queue',
        },
        {
          title: t('flow.execute.startTime'),
          description: convertTime(executeDetail.value?.startTime || 0),
          hasPopup: true,
          popupContent: 'time',
        },
        {
          title: t('flow.execute.endTime'),
          description: convertTime(executeDetail.value?.endTime || 0),
          hasPopup: false,
        },
      ]
    })

    const sumCost = computed(() => {
      const timeCost = executeDetail.value?.model?.timeCost
      return convertMillSec(timeCost?.totalCost, true)
    })

    const queueCost = computed(() => {
      return convertMillSec(executeDetail.value?.model?.timeCost?.queueCost)
    })

    const totalCost = computed(() => {
      return convertMillSec(executeDetail.value?.model?.timeCost?.totalCost)
    })

    const timeDetailRows = computed<TimeDetailRow[]>(() => {
      return ['executeCost', 'systemCost', 'waitCost'].map((key) => ({
        field: key,
        label: t(`flow.execute.${key}`),
          value: convertMillSec(
            executeDetail.value?.model?.timeCost?.[key as keyof typeof executeDetail.value.model.timeCost],
          ),
      }))
    })

    // ==================== Computed: Error Information ====================
    const errorList = computed(() => {
      return executeDetail.value?.errorInfoList || []
    })

    const showErrorPopup = computed(() => {
      return Array.isArray(errorList.value) && errorList.value.length > 0
    })

    // ==================== Methods: Event Handlers ====================
    const handleExecuteCountChange = (executeCount: number) => {
      router.push({
        name: route.name || undefined,
        params: route.params,
        query: {
          ...route.query,
          executeCount: String(executeCount),
        },
      })
    }

    const toggleErrorPopup = () => {
      showErrors.value = !showErrors.value
    }

    const showCompleteLog = () => {
      showLog.value = true
    }

    const hideCompleteLog = () => {
      showLog.value = false
    }

    // ==================== Methods: Pipeline Operations ====================
    const expandAllMatrix = async (expand: boolean) => {
    
      try {
        // 使用 filteredPipeline 而不是 executeDetail.value.model，因为已经过滤了第一个stage
        const stages = filteredPipeline.value?.stages || []
        
        for (let i = 0; i < stages.length; i++) {
          const stage = stages[i]
          if (!stage) continue
          for (let j = 0; j < (stage.containers?.length || 0); j++) {
            const matrix = stage.containers[j]
            if (!matrix) continue
            if (matrix.matrixGroupFlag && matrix.groupContainers) {
              for (let k = 0; k < matrix.groupContainers.length; k++) {
                const container = matrix.groupContainers[k]
                if (container) {
                  bkPipelineRef.value?.expandMatrix?.(
                    stage.id,
                    matrix.id,
                    container.id,
                    expand,
                  )
                }
              }
            } else {
              bkPipelineRef.value?.expandJob?.(stage.id, matrix.id, expand)
            }
          }
        }
      } catch (error) {
        console.error('expandAllMatrix error', error)
      }
    }

    const handlePipelineClick = (args: any) => {
      // TODO: 打开属性面板
      console.log('Pipeline click:', args)
    }

    const handleStageCheck = (args: any) => {
      // TODO: 处理Stage审核
      console.log('Stage check:', args)
    }

    const handleRetry = (args: any) => {
      // TODO: 处理重试
      console.log('Retry:', args)
    }

    const handlePipelineChange = (changedObject: any) => {
      // TODO: 处理流水线变更
      console.log('Pipeline change:', changedObject)
    }

    const setShowErrorPopup = () => {
      showErrors.value = true
    }

    // 动态更新错误弹窗高度，用于调整底部 padding
    const updateErrorPopupHeight = () => {
      nextTick(() => {
        if (errorPopupRef.value && showErrorPopup.value) {
          const height = showErrors.value ? errorPopupRef.value.offsetHeight : 42
          const root = document.documentElement
          root.style.setProperty('--error-popup-height', `${height}px`)
        } else {
          const root = document.documentElement
          root.style.setProperty('--error-popup-height', '0px')
        }
      })
    }

    // ==================== Render Helpers ====================
    const renderTimeStepPopover = (step: TimeStep) => {
      if (!step.hasPopup) return null

      return (
        <Popover theme="light" placement="bottom" trigger="hover" boundary="window">
          {{
            default: () => (
              <span class={styles.timeStepDivider}>
                <p></p>
              </span>
            ),
            content: () =>
              step.popupContent === 'queue' ? (
                <div class={styles.queueTimeDetailPopup}>
                  <div class={styles.pipelineTimeDetailSum}>
                    <span>{t('flow.execute.queueCost')}</span>
                    <span class={styles.constantWidthNum}>{queueCost.value}</span>
                  </div>
                </div>
              ) : (
                <div class={styles.timeDetailPopup}>
                  <div class={styles.pipelineTimeDetailSum}>
                    <span>{t('flow.execute.totalCost')}</span>
                    <span class={styles.constantWidthNum}>
                      {isRunning.value ? `${t('flow.execute.running')}...` : totalCost.value}
                    </span>
                  </div>
                  <ul class={styles.pipelineTimeDetailSumList}>
                    {timeDetailRows.value.map((cost) => (
                      <li key={cost.field}>
                        <span>{cost.label}</span>
                        <span class={styles.constantWidthNum}>{cost.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
          }}
        </Popover>
      )
    }

    const renderExecuteCountSelect = () => {
      return (
        <Select
          modelValue={executeCount.value}
          popoverMinWidth={300}
          clearable={false}
          onChange={handleExecuteCountChange}
          class={styles.pipelineExecCountSelect}
        >
          {executeCounts.value.map((item) => (
            <Select.Option key={item.id} id={item.id} name={item.name}>
              <div class={styles.execCountSelectOption}>
                <span>{item.name}</span>
                {item.timeCost && (
                  <span class={styles.execCountTimeCost}>{item.timeCost}</span>
                )}
                <span class={styles.execCountSelectOptionUser}>{item.user}</span>
              </div>
            </Select.Option>
          ))}
        </Select>
      )
    }

    const renderTimeLine = () => {
      return (
        <ul class={styles.pipelineExecTimeline}>
          {timeSteps.value.map((step) => (
            <li key={step.title} class={styles.pipelineExecTimelineItem}>
              <span class={styles.titleItem}>
                <p>{step.title}</p>
                {renderTimeStepPopover(step)}
              </span>
              <p class={styles.constantWidthNum}>{step.description}</p>
            </li>
          ))}
        </ul>
      )
    }

    const renderPipelineControls = () => {
      return (
        <header class={styles.pipelineStyleSettingHeader}>
          <Checkbox
            v-model={hideSkipExecTask.value}
            class={styles.hideSkipPipelineTask}
          >
            {t('flow.execute.hideSkipStep')}
          </Checkbox>
          <Checkbox
            v-model={isExpandAllMatrix.value}
            onChange={expandAllMatrix}
            class={styles.expandJobCheckbox}
          >
            {t('flow.execute.isExpandJob')}
          </Checkbox>
          <Button text theme="primary" onClick={showCompleteLog}>
            <SvgIcon name="txt" size={16} />
            {t('flow.execute.viewLog')}
          </Button>
        </header>
      )
    }

    const renderErrorPopup = () => {
      if (!showErrorPopup.value) return null

      return (
        <footer
          ref={errorPopupRef}
          class={[styles.execErrorsPopup, showErrors.value && styles.visible]}
        >
          <Button text theme="normal" class={styles.dragDot} onClick={toggleErrorPopup}>
            <SvgIcon
              name="arrows-up"
              size={30}
              class={[styles.toggleErrorPopupIcon, showErrors.value && styles.rotated]}
            />
          </Button>
          <div class={styles.errorContent}>
            {t('flow.execute.errorInfo')}: {errorList.value.length} {t('flow.execute.errors')}
          </div>
        </footer>
      )
    }

    const renderCompleteLog = () => {
      if (!showLog.value || !executeDetail.value) return null

      return (
        <div class={styles.completeLogWrapper}>
          <div class={styles.completeLogHeader}>
            <span>{t('flow.execute.completeLog')}</span>
            <Button text onClick={hideCompleteLog}>
              <SvgIcon name="close" size={16} />
            </Button>
          </div>
          <div class={styles.completeLogContent}>
            {/* TODO: 实现完整日志内容 */}
            {t('flow.execute.logContent')}
          </div>
        </div>
      )
    }

    // ==================== Watchers ====================
    watch(executeCount, () => {
      nextTick(() => {
        if (errorList.value.length > 0) {
          setShowErrorPopup()
        }
        updateErrorPopupHeight()
      })
    })

    watch(showErrors, () => {
      nextTick(() => {
        updateErrorPopupHeight()
      })
    })

    watch(showErrorPopup, () => {
      nextTick(() => {
        updateErrorPopupHeight()
      })
    })

    // ==================== Lifecycle ====================
    onMounted(() => {
      nextTick(() => {
        // 延迟展开，确保组件完全渲染
        setTimeout(() => {
          if (isExpandAllMatrix.value && bkPipelineRef.value && filteredPipeline.value) {
            expandAllMatrix(true)
          }
          updateErrorPopupHeight()
        }, 500)
      })
    })

    onUnmounted(() => {
      const root = document.documentElement
      root.style.removeProperty('--error-popup-height')
    })

    // ==================== Render ====================
    return () => {
      if (!executeDetail.value || !curPipeline.value) {
        return <div class={styles.emptyState}>{t('flow.execute.noData')}</div>
      }

      return (
        <div class={styles.execPipelineWrapper}>
          {/* 滚动视口占位 */}
          <div class={styles.pipelineModelScrollViewport}>
            <p></p>
          </div>

          {/* 执行摘要 */}
          <div class={styles.pipelineExecSummary}>
            <div class={styles.pipelineExecCount}>
              <span>{t('flow.execute.num')}</span>
              {renderExecuteCountSelect()}
              <span class={styles.execStatusLabel}>
                {t('flow.execute.times', [executeCount.value])}
                {executeDetail.value.status === STATUS.CANCELED && (
                  <SvgIcon
                    name="info-circle"
                    size={16}
                    v-bk-tooltips={`${t('flow.execute.canceller')}：${cancelUserId.value}`}
                  />
                )}
              </span>
              {!isRunning.value && (
                <span>
                  {' '}
                  {t('flow.execute.totalCost')}：{sumCost.value}{' '}
                </span>
              )}
            </div>
            {renderTimeLine()}
          </div>

          {/* 执行内容 */}
          <section class={styles.pipelineExecContent}>
            {renderPipelineControls()}
            <div ref={scrollBoxRef} class={styles.execPipelineScrollBox}>
              <div class={styles.execPipelineUiWrapper}>
                {filteredPipeline.value && (
                  <BkPipeline
                    ref={bkPipelineRef}
                    editable={false}
                    isExecDetail={true}
                    currentExecCount={executeCount.value}
                    cancelUserId={cancelUserId.value as string}
                    pipeline={filteredPipeline.value}
                    matchRules={props.matchRules as any}
                    onClick={handlePipelineClick}
                    onStageCheck={handleStageCheck}
                    onStageRetry={handleRetry}
                    onChange={handlePipelineChange}
                  />
                )}
              </div>
            </div>
            {/* {renderErrorPopup()} */}
          </section>

          {renderCompleteLog()}
        </div>
      )
    }
  },
})
