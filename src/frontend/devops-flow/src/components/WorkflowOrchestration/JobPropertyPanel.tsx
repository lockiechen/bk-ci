import type { Container, CustomVariable, Stage } from '@/api/flowModel'
import KeyValueMap from '@/components/AtomForm/KeyValueMap'
import { SvgIcon } from '@/components/SvgIcon'
import { getJobRunConditionList } from '@/constants/flowOptionConfig'
import { useUIStore } from '@/stores/ui'
import { JobRunCondition } from '@/utils/flowDefaults'
import {
  Button,
  Checkbox,
  Collapse,
  Form,
  InfoBox,
  Input,
  Radio,
  Select,
  Sideslider,
  Switcher,
} from 'bkui-vue'
import { storeToRefs } from 'pinia'
import { computed, defineComponent, ref, watch, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import styles from './JobPropertyPanel.module.css'
import sharedStyles from './shared.module.css'

const { FormItem } = Form

// 依赖类型枚举
enum DependOnType {
  ID = 'ID',
  NAME = 'NAME',
}

// 验证规则
const RULES = {
  MUTEX_QUEUE: { min: 1, max: 50 },
  MATRIX_CONCURRENCY: { min: 1, max: 20 },
}

export default defineComponent({
  name: 'JobPropertyPanel',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    editingContainer: {
      type: Object as PropType<Container | null>,
      default: null,
    },
    /** 当前 Job 所属的 Stage，用于获取依赖 Job 列表 */
    stage: {
      type: Object as PropType<Stage | null>,
      default: null,
    },
    /** 当前 Job 在 Stage 中的索引 */
    containerIndex: {
      type: Number,
      default: -1,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    /** 是否是 Finally Stage */
    isFinally: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'confirm'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const { isVariablePanelOpen } = storeToRefs(useUIStore())

    // ========== State ==========
    const formRef = ref()
    const formData = ref<Container | null>(null)
    const nameEditing = ref(false)

    // ========== Computed ==========
    // 根据 Job 类型显示不同的标题
    const title = computed(() => {
      if (!props.isNew) {
        return t('flow.orchestration.editJob')
      }
      // 新建模式下，根据 container 的 @type 显示不同标题
      const containerType = formData.value?.['@type']
      if (containerType === 'devCloud') {
        return t('flow.orchestration.addCloudJob')
      }
      return t('flow.orchestration.addCreateJob')
    })

    // 运行条件选项（区分普通阶段和 Finally 阶段）
    const runConditionOptions = computed(() =>
      getJobRunConditionList(t, props.isFinally).map((opt) => ({
        label: opt.name,
        value: opt.id,
      })),
    )

    // 依赖类型选项
    const dependOnTypeOptions = [
      { label: t('flow.orchestration.dependOnById'), value: DependOnType.ID },
      { label: t('flow.orchestration.dependOnByName'), value: DependOnType.NAME },
    ]

    // 可依赖的 Job 列表（排除当前 Job）
    const dependOnJobList = computed(() => {
      if (!props.stage?.containers) return []
      return props.stage.containers
      .filter((container, index) => index !== props.containerIndex && container.jobId)
        .map((container, index) => ({
          value: container.jobId,
          label: `${container.name} (${container.jobId})`,
          disabled: !container.jobId
        }))
        
    })

    // 条件显示计算
    const jobCtrl = computed(() => formData.value?.jobControlOption)
    const showCustomVariables = computed(() =>
      [JobRunCondition.CUSTOM_VARIABLE_MATCH, JobRunCondition.CUSTOM_VARIABLE_MATCH_NOT_RUN].includes(
        jobCtrl.value?.runCondition as JobRunCondition,
      ),
    )
    const showCustomCondition = computed(
      () => jobCtrl.value?.runCondition === JobRunCondition.CUSTOM_CONDITION_MATCH,
    )
    const showDependOnId = computed(
      () => jobCtrl.value?.dependOnType === DependOnType.ID || !jobCtrl.value?.dependOnType,
    )
    const showDependOnName = computed(() => jobCtrl.value?.dependOnType === DependOnType.NAME)

    // ========== Watchers ==========
    // 同步 props.editingContainer 到 formData
    watch(
      () => props.editingContainer,
      (container) => {
        formData.value = container ? { ...container } : null
      },
      { immediate: true },
    )

    // 清理 runCondition 相关的条件字段
    watch(
      () => jobCtrl.value?.runCondition,
      (condition) => {
        if (!formData.value?.jobControlOption) return

        const isVarMatch = [
          JobRunCondition.CUSTOM_VARIABLE_MATCH,
          JobRunCondition.CUSTOM_VARIABLE_MATCH_NOT_RUN,
        ].includes(condition as JobRunCondition)

        if (!isVarMatch) {
          formData.value.jobControlOption.customVariables = []
        } else if (!formData.value.jobControlOption.customVariables?.length) {
          formData.value.jobControlOption.customVariables = [{ key: 'param1', value: '' }]
        }

        if (condition !== JobRunCondition.CUSTOM_CONDITION_MATCH) {
          formData.value.jobControlOption.customCondition = ''
        }
      },
    )

    // ========== Helpers ==========
    function closePanel() {
      emit('update:modelValue', false)
    }

    function exitNameEdit() {
      if (props.editable) nameEditing.value = false
    }

    function stopPropagation(e: Event) {
      e.stopPropagation()
    }

    // ========== Handlers ==========
    async function handleConfirm() {
      try {
        await formRef.value?.validate()
      } catch {
        InfoBox({
          title: t('flow.common.failed'),
          subTitle: t('flow.orchestration.jobIdRequired'),
          theme: 'danger',
        })
        return
      }

      if (formData.value) {
        debugger
        emit('confirm', formData.value)
        closePanel()
      }
    }

    // ========== Render Helpers ==========
    const renderMatrixSection = () => {
      if (!formData.value?.matrixControlOption) return null
      const matrix = formData.value.matrixControlOption

      return (
        <div class={sharedStyles.flowControlSection}>
          <Collapse useBlockTheme>
            <Collapse.CollapsePanel>
              {{
                default: () => (
                  <div class={sharedStyles.collapseHeader}>
                    <div class={sharedStyles.collapseHeaderLeft}>
                      <span>{t('flow.orchestration.matrixJob')}</span>
                      <Switcher
                        v-model={formData.value!.matrixGroupFlag}
                        size="small"
                        theme="primary"
                        disabled={!props.editable}
                        onClick={stopPropagation}
                      />
                    </div>
                    <a
                      href="https://docs.bkci.net/"
                      target="_blank"
                      class={sharedStyles.docLink}
                      onClick={stopPropagation}
                    >
                      {t('flow.orchestration.viewDocumentation')}
                    </a>
                  </div>
                ),
                content: () =>
                  formData.value!.matrixGroupFlag && (
                    <div class={sharedStyles.collapseContent}>
                      <FormItem label={t('flow.orchestration.strategy')} required>
                        <Input
                          v-model={matrix.strategyStr}
                          type="textarea"
                          rows={4}
                          placeholder={t('flow.orchestration.strategyPlaceholder')}
                          disabled={!props.editable}
                        />
                        <p class={sharedStyles.fieldDesc}>{t('flow.orchestration.strategyDesc')}</p>
                      </FormItem>

                      <FormItem label={t('flow.orchestration.includeCase')}>
                        <Input
                          v-model={matrix.includeCaseStr}
                          type="textarea"
                          rows={4}
                          placeholder={t('flow.orchestration.includeCasePlaceholder')}
                          disabled={!props.editable}
                        />
                        <p class={sharedStyles.fieldDesc}>{t('flow.orchestration.includeCaseDesc')}</p>
                      </FormItem>

                      <FormItem label={t('flow.orchestration.excludeCase')}>
                        <Input
                          v-model={matrix.excludeCaseStr}
                          type="textarea"
                          rows={4}
                          placeholder={t('flow.orchestration.excludeCasePlaceholder')}
                          disabled={!props.editable}
                        />
                        <p class={sharedStyles.fieldDesc}>{t('flow.orchestration.excludeCaseDesc')}</p>
                      </FormItem>

                      <FormItem>
                        <Checkbox v-model={matrix.fastKill} disabled={!props.editable}>
                          {t('flow.orchestration.fastKill')}
                        </Checkbox>
                      </FormItem>

                      <FormItem label={t('flow.orchestration.maxConcurrency')} required>
                        <Input
                          v-model={matrix.maxConcurrency}
                          type="number"
                          min={RULES.MATRIX_CONCURRENCY.min}
                          max={RULES.MATRIX_CONCURRENCY.max}
                          placeholder={t('flow.orchestration.maxConcurrencyPlaceholder')}
                          disabled={!props.editable}
                        />
                      </FormItem>
                    </div>
                  ),
              }}
            </Collapse.CollapsePanel>
          </Collapse>
        </div>
      )
    }

    const renderFlowControlSection = () => {
      if (!formData.value?.jobControlOption) return null
      const ctrl = formData.value.jobControlOption

      return (
        <div class={sharedStyles.flowControlSection}>
          <Collapse useBlockTheme>
            <Collapse.CollapsePanel>
              {{
                default: () => (
                  <div class={sharedStyles.collapseHeader}>
                    <span class={styles.collapseTitle}>{t('flow.orchestration.flowControlOptions')}</span>
                  </div>
                ),
                content: () => (
                  <div class={sharedStyles.collapseContent}>
                    {/* 启用 Job */}
                    <FormItem>
                      <Checkbox v-model={ctrl.enable} disabled={!props.editable}>
                        {t('flow.orchestration.enableJob')}
                      </Checkbox>
                    </FormItem>

                    {/* 依赖前置 Job */}
                    <FormItem label={t('flow.orchestration.dependOn')}>
                      <p class={sharedStyles.fieldDesc}>{t('flow.orchestration.dependOnDesc')}</p>
                      <Radio.Group v-model={ctrl.dependOnType} class={styles.dependOnTypeGroup}>
                        {dependOnTypeOptions.map((opt) => (
                          <Radio key={opt.value} label={opt.value} disabled={!props.editable}>
                            {opt.label}
                          </Radio>
                        ))}
                      </Radio.Group>

                      {showDependOnId.value && (
                        <Select
                          v-model={ctrl.dependOnId}
                          multiple
                          placeholder={t('flow.orchestration.selectDependOnJob')}
                          disabled={!props.editable}
                          list={dependOnJobList.value}
                        />
                      )}

                      {showDependOnName.value && (
                        <Input
                          v-model={ctrl.dependOnName}
                          placeholder={t('flow.orchestration.dependOnNamePlaceholder')}
                          disabled={!props.editable}
                        />
                      )}
                    </FormItem>

                    {/* Job 超时时间 */}
                    <FormItem label={t('flow.orchestration.jobTimeout')} required>
                      <Input
                        v-model={ctrl.timeout}
                        type="number"
                        placeholder={t('flow.orchestration.jobTimeoutPlaceholder')}
                        disabled={!props.editable}
                      />
                      <p class={sharedStyles.fieldDesc}>{t('flow.orchestration.jobTimeoutDesc')}</p>
                    </FormItem>

                    {/* 运行条件 */}
                    <FormItem label={t('flow.orchestration.whenToRunJob')} required>
                      <Select
                        v-model={ctrl.runCondition}
                        disabled={!props.editable}
                        list={runConditionOptions.value}
                      />
                    </FormItem>

                    {/* 自定义变量 */}
                    {showCustomVariables.value && (
                      <FormItem
                        v-slots={{
                          label: () => (
                            <div class={sharedStyles.labelWithIcon}>
                              <span>{t('flow.orchestration.customVar')}</span>
                            </div>
                          ),
                        }}
                      >
                        <KeyValueMap
                          value={ctrl.customVariables || []}
                          name="customVariables"
                          handleChange={(_: string, val: CustomVariable[]) => (ctrl.customVariables = val)}
                          addBtnText={t('flow.orchestration.addVariable')}
                          keyPlaceholder={t('flow.orchestration.envKeyPlaceholder')}
                          valuePlaceholder={t('flow.orchestration.envValuePlaceholder')}
                          allowNull={false}
                          disabled={!props.editable}
                        />
                      </FormItem>
                    )}

                    {/* 自定义条件表达式 */}
                    {showCustomCondition.value && (
                      <FormItem
                        label={t('flow.orchestration.customConditionExp')}
                        required
                        v-slots={{
                          label: () => (
                            <div class={sharedStyles.labelWithIcon}>
                              <span>{t('flow.orchestration.customConditionExp')}</span>
                              <a
                                href="https://docs.bkci.net/"
                                target="_blank"
                                class={sharedStyles.docLink}
                              >
                                {t('flow.orchestration.viewDocumentation')}
                              </a>
                            </div>
                          ),
                        }}
                      >
                        <Input
                          v-model={ctrl.customCondition}
                          placeholder={t('flow.orchestration.customConditionExpPlaceholder')}
                          disabled={!props.editable}
                        />
                      </FormItem>
                    )}
                  </div>
                ),
              }}
            </Collapse.CollapsePanel>
          </Collapse>
        </div>
      )
    }

    const renderMutexSection = () => {
      if (!formData.value?.mutexGroup) return null
      const mutex = formData.value.mutexGroup

      return (
        <div class={sharedStyles.flowControlSection}>
          <Collapse useBlockTheme>
            <Collapse.CollapsePanel>
              {{
                default: () => (
                  <div class={sharedStyles.collapseHeader}>
                    <div class={sharedStyles.collapseHeaderLeft}>
                      <span>{t('flow.orchestration.mutexGroup')}</span>
                      <Switcher
                        v-model={mutex.enable}
                        size="small"
                        theme="primary"
                        disabled={!props.editable}
                        onClick={stopPropagation}
                      />
                    </div>
                  </div>
                ),
                content: () =>
                  mutex.enable && (
                    <div class={sharedStyles.collapseContent}>
                      <FormItem label={t('flow.orchestration.mutexGroupName')} required>
                        <Input
                          v-model={mutex.mutexGroupName}
                          placeholder={t('flow.orchestration.mutexGroupNamePlaceholder')}
                          disabled={!props.editable}
                        />
                      </FormItem>

                      <FormItem>
                        <Checkbox v-model={mutex.queueEnable} disabled={!props.editable}>
                          {t('flow.orchestration.queueEnable')}
                        </Checkbox>
                      </FormItem>

                      {mutex.queueEnable && (
                        <>
                          <FormItem label={t('flow.orchestration.mutexTimeout')} required>
                            <Input
                              v-model={mutex.timeoutVar}
                              type="number"
                              placeholder={t('flow.orchestration.mutexTimeoutPlaceholder')}
                              disabled={!props.editable}
                            />
                            <p class={sharedStyles.fieldDesc}>{t('flow.orchestration.mutexTimeoutDesc')}</p>
                          </FormItem>

                          <FormItem label={t('flow.orchestration.queueSize')} required>
                            <Input
                              v-model={mutex.queue}
                              type="number"
                              min={RULES.MUTEX_QUEUE.min}
                              max={RULES.MUTEX_QUEUE.max}
                              placeholder={t('flow.orchestration.queueSizePlaceholder')}
                              disabled={!props.editable}
                            />
                          </FormItem>
                        </>
                      )}
                    </div>
                  ),
              }}
            </Collapse.CollapsePanel>
          </Collapse>
        </div>
      )
    }

    function beforeClose() {
      if (!props.isNew) {
        emit('confirm', formData.value)
      }
      return true
    }

    // ========== Render ==========
    return () => (
      <Sideslider
        isShow={props.modelValue}
        width={640}
        quick-close
        onUpdate:isShow={(val: boolean) => emit('update:modelValue', val)}
        class={['bkci-property-panel', isVariablePanelOpen.value && 'with-variable-open']}
        beforeClose={beforeClose}
      >
        {{
          header: () => (
            <div class={sharedStyles.propertyPanelHeader}>
              {props.isNew ? (
                <span>{title.value}</span>
              ) : (
                <div class={sharedStyles.nameEdit}>
                  {nameEditing.value ? (
                    <Input
                      modelValue={formData.value?.name || ''}
                      maxlength={30}
                      placeholder={t('flow.orchestration.jobNamePlaceholder')}
                      onBlur={exitNameEdit}
                      onEnter={exitNameEdit}
                      onChange={(val: string) => formData.value && (formData.value.name = val)}
                      class={sharedStyles.nameInput}
                      autoFocus
                    />
                  ) : (
                    <>
                      <p class={sharedStyles.nameText} title={formData.value?.name}>
                        {formData.value?.name}
                      </p>
                      {props.editable && (
                        <span class={sharedStyles.editIcon} onClick={() => (nameEditing.value = true)}>
                          <SvgIcon name="edit" size={16} />
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ),

          default: () =>
            formData.value && (
              <div class={styles.jobPanelContent}>
                <Form ref={formRef} form-type="vertical" model={formData.value}>
                  {/* Job Name - 仅在新建模式下显示 */}
                  {props.isNew && (
                    <FormItem label={t('flow.orchestration.jobName')} required>
                      <Input
                        v-model={formData.value.name}
                        maxlength={30}
                        placeholder={t('flow.orchestration.jobNamePlaceholder')}
                        disabled={!props.editable}
                      />
                    </FormItem>
                  )}

                  {/* Job ID */}
                  <FormItem label={t('flow.orchestration.jobId')} property="jobId" required>
                    <Input
                      v-model={formData.value.jobId}
                      placeholder={t('flow.orchestration.jobIdPlaceholder')}
                      disabled={!props.editable}
                    />
                  </FormItem>

                  {/* Matrix Job */}
                  {renderMatrixSection()}

                  {/* Flow Control */}
                  {renderFlowControlSection()}

                  {/* Mutex Group */}
                  {renderMutexSection()}
                </Form>
              </div>
            ),

          footer: () =>
            props.isNew && (
              <div class={styles.jobPanelFooter}>
                <Button theme="primary" onClick={handleConfirm} disabled={!props.editable}>
                  {t('flow.orchestration.add')}
                </Button>
                <Button onClick={closePanel}>{t('flow.common.cancel')}</Button>
              </div>
            ),
        }}
      </Sideslider>
    )
  },
})
