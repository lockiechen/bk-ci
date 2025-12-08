import { computed, defineComponent, ref, watch, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Sideslider,
  Form,
  Input,
  Select,
  Checkbox,
  Collapse,
  Radio,
  Button,
  InfoBox,
  Switcher,
} from 'bkui-vue'
import { SvgIcon } from '@/components/SvgIcon'
import KeyValueMap from './AtomForm/components/KeyValueMap'
import styles from './JobPropertyPanel.module.css'
import sharedStyles from './shared.module.css'
import { getJobRunConditionList, getJobDependOnOptions } from '@/constants/flowOptionConfig'
import type { Container, CustomVariable } from '@/api/flowModel'
import { JobRunCondition } from '@/utils/flowDefaults'
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'

const { FormItem } = Form

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
    editable: {
      type: Boolean,
      default: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'change', 'confirm'],
  setup(props, { emit }) {
    // ========== Hooks ==========
    const { t } = useI18n()
    const uiStore = useUIStore()
    const { isVariablePanelOpen } = storeToRefs(uiStore)

    // ========== Refs ==========
    const formRef = ref()
    const formData = ref(props.editingContainer)
    const nameEditing = ref(false)

    // ========== Computed ==========
    const title = computed(() => {
      return props.isNew ? t('flow.orchestration.addJob') : t('flow.orchestration.editJob')
    })

    // 判断是否显示自定义变量输入框
    const showCustomVariables = computed(() => {
      const runCondition = formData.value?.jobControlOption?.runCondition
      return (
        runCondition === JobRunCondition.CUSTOM_VARIABLE_MATCH ||
        runCondition === JobRunCondition.CUSTOM_VARIABLE_MATCH_NOT_RUN
      )
    })

    // 判断是否显示自定义条件表达式输入框
    const showCustomCondition = computed(() => {
      return formData.value?.jobControlOption?.runCondition === 'CUSTOM_CONDITION_MATCH'
    })

    // ========== Lifecycle Hooks ==========
    watch(
      () => props.editingContainer,
      (newContainer) => {
        formData.value = newContainer
      },
    )

    // 监听runCondition变化，清理不需要的字段
    watch(
      () => formData.value?.jobControlOption?.runCondition,
      (newCondition) => {
        if (!formData.value || !formData.value.jobControlOption) return

        // 如果切换到非变量匹配选项，清空customVariables
        if (
          newCondition !== JobRunCondition.CUSTOM_VARIABLE_MATCH &&
          newCondition !== JobRunCondition.CUSTOM_VARIABLE_MATCH_NOT_RUN
        ) {
          formData.value.jobControlOption.customVariables = []
        } else if (
          !formData.value.jobControlOption.customVariables ||
          formData.value.jobControlOption.customVariables.length === 0
        ) {
          // 如果切换到变量匹配选项且没有customVariables，初始化默认值
          formData.value.jobControlOption.customVariables = [{ key: 'param1', value: '' }]
        }

        // 如果切换到非表达式选项，清空customCondition
        if (newCondition !== 'CUSTOM_CONDITION_MATCH') {
          formData.value.jobControlOption.customCondition = ''
        }
      },
    )

    // ========== Functions ==========
    const matrixJobPanel = t('flow.orchestration.matrixJob')
    const flowControlPanel = t('flow.orchestration.flowControlOptions')
    const mutexGroupPanel = t('flow.orchestration.mutexGroup')
    const runConditionOptions = getJobRunConditionList(t)
    const dependOnOptions = getJobDependOnOptions(t)
    const matrixJobDocLink = 'https://docs.bkci.net/'

    function toggleEditName(show: boolean) {
      if (!props.editable) return
      nameEditing.value = show
    }

    function handleEditName(value: string) {
      if (formData.value) {
        formData.value.name = value
        if (!props.isNew) {
          emit('change', formData.value)
        }
      }
    }

    function handleBlur() {
      toggleEditName(false)
    }

    function handleEnter() {
      toggleEditName(false)
    }

    function handleNameChange(val: string) {
      handleEditName(val)
    }

    function handleEditIconClick() {
      toggleEditName(true)
    }

    function handleSwitcherClick(e: Event) {
      e.stopPropagation()
    }

    function handleDocLinkClick(e: Event) {
      e.stopPropagation()
    }

    function handleVisibleChange(val: boolean) {
      emit('update:modelValue', val)
    }

    async function validateForm() {
      try {
        return await formRef.value?.validate()
      } catch (error) {
        InfoBox({
          title: t('flow.common.failed'),
          subTitle: t('flow.orchestration.jobIdRequired'),
          theme: 'danger',
        })
        return false
      }
    }

    async function handleConfirm() {
      const isValid = await validateForm()
      if (!isValid) {
        return
      }

      if (!formData.value) return

      emit('confirm', formData.value)
      emit('update:modelValue', false)
    }

    function handleCancel() {
      emit('update:modelValue', false)
    }

    function handleMatrixJobChange(val: boolean) {
      formData.value!.matrixGroupFlag = val
    }

    function handleMutexGroupChange(val: boolean) {
      formData.value!.mutexGroup!.enable = val
    }

    function handleCustomVariablesChange(name: string, value: CustomVariable[]) {
      if (formData.value?.jobControlOption) {
        formData.value.jobControlOption.customVariables = value
        if (!props.isNew) {
          emit('change', formData.value)
        }
      }
    }

    return () => (
      <Sideslider
        isShow={props.modelValue}
        width={640}
        quick-close={true}
        onUpdate:isShow={handleVisibleChange}
        class={['bkci-property-panel', isVariablePanelOpen.value && 'with-variable-open']}
      >
        {{
          header: () => (
            <div class={sharedStyles.propertyPanelHeader}>
              <div class={sharedStyles.nameEdit}>
                {nameEditing.value ? (
                  <Input
                    modelValue={formData.value?.name || ''}
                    maxlength={30}
                    placeholder={t('flow.orchestration.jobNamePlaceholder')}
                    onBlur={handleBlur}
                    onEnter={handleEnter}
                    onChange={handleNameChange}
                    class={sharedStyles.nameInput}
                    autoFocus
                  />
                ) : (
                  <>
                    <p class={sharedStyles.nameText} title={formData.value?.name}>
                      {formData.value?.name}
                    </p>
                    {props.editable && (
                      <span class={sharedStyles.editIcon} onClick={handleEditIconClick}>
                        <SvgIcon name="edit" size={16} />
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          ),
          default: () =>
            formData.value ? (
              <div class={styles.jobPanelContent}>
                <Form ref={formRef} form-type="vertical" model={formData.value}>
                  <FormItem label={t('flow.orchestration.jobId')} property="jobId" required>
                    <Input
                      v-model={formData.value!.jobId}
                      placeholder={t('flow.orchestration.jobIdPlaceholder')}
                      disabled={!props.editable}
                    />
                  </FormItem>

                  <div class={sharedStyles.flowControlSection}>
                    <Collapse useBlockTheme>
                      <Collapse.CollapsePanel>
                        {{
                          default: () => (
                            <div class={sharedStyles.collapseHeader}>
                              <div class={sharedStyles.collapseHeaderLeft}>
                                <span>{matrixJobPanel}</span>
                                <Switcher
                                  v-model={formData.value!.matrixGroupFlag}
                                  size="small"
                                  theme="primary"
                                  disabled={!props.editable}
                                  onChange={handleMatrixJobChange}
                                  onClick={handleSwitcherClick}
                                />
                              </div>
                              <a
                                href={matrixJobDocLink}
                                target="_blank"
                                class={sharedStyles.docLink}
                                onClick={handleDocLinkClick}
                              >
                                {t('flow.orchestration.viewDocumentation')}
                              </a>
                            </div>
                          ),
                          content: () =>
                            formData.value!.matrixGroupFlag ? (
                              <div class={sharedStyles.collapseContent}>
                                <FormItem label={t('flow.orchestration.strategy')} required>
                                  <Input
                                    v-model={formData.value!.matrixControlOption!.strategyStr}
                                    type="textarea"
                                    rows={4}
                                    placeholder={t('flow.orchestration.strategyPlaceholder')}
                                    disabled={!props.editable}
                                  />
                                </FormItem>

                                <FormItem label={t('flow.orchestration.includeCase')}>
                                  <Input
                                    v-model={formData.value!.matrixControlOption!.includeCaseStr}
                                    type="textarea"
                                    rows={4}
                                    placeholder={t('flow.orchestration.includeCasePlaceholder')}
                                    disabled={!props.editable}
                                  />
                                </FormItem>

                                <FormItem label={t('flow.orchestration.excludeCase')}>
                                  <Input
                                    v-model={formData.value!.matrixControlOption!.excludeCaseStr}
                                    type="textarea"
                                    rows={4}
                                    placeholder={t('flow.orchestration.excludeCasePlaceholder')}
                                    disabled={!props.editable}
                                  />
                                </FormItem>

                                <FormItem>
                                  <Checkbox
                                    v-model={formData.value!.matrixControlOption!.fastKill}
                                    disabled={!props.editable}
                                  >
                                    {t('flow.orchestration.fastKill')}
                                  </Checkbox>
                                </FormItem>

                                <FormItem label={t('flow.orchestration.maxConcurrency')} required>
                                  <Input
                                    v-model={formData.value!.matrixControlOption!.maxConcurrency}
                                    type="number"
                                    placeholder={t('flow.orchestration.maxConcurrencyPlaceholder')}
                                    disabled={!props.editable}
                                  />
                                </FormItem>
                              </div>
                            ) : null,
                        }}
                      </Collapse.CollapsePanel>
                    </Collapse>
                  </div>

                  <div class={sharedStyles.flowControlSection}>
                    <Collapse useBlockTheme>
                      <Collapse.CollapsePanel>
                        {{
                          default: () => (
                            <div class={sharedStyles.collapseHeader}>
                              <span class={styles.collapseTitle}>{flowControlPanel}</span>
                            </div>
                          ),
                          content: () => (
                            <div class={sharedStyles.collapseContent}>
                              <FormItem>
                                <Checkbox
                                  v-model={formData.value!.jobControlOption!.enable}
                                  disabled={!props.editable}
                                >
                                  {t('flow.orchestration.enableJob')}
                                </Checkbox>
                              </FormItem>

                              <FormItem label={t('flow.orchestration.dependOnPrevJob')}>
                                <Radio.Group>
                                  {dependOnOptions.map((option) => (
                                    <Radio
                                      key={option.id}
                                      v-model={formData.value!.jobControlOption!.dependOnType}
                                      label={option.id}
                                      disabled={!props.editable}
                                    >
                                      {option.name}
                                    </Radio>
                                  ))}
                                </Radio.Group>
                                {formData.value!.jobControlOption!.dependOnType === 'select' ? (
                                  <Select
                                    placeholder={t('flow.orchestration.selectPlaceholder')}
                                    disabled={!props.editable}
                                    list={[]}
                                  />
                                ) : (
                                  <Input
                                    v-model={formData.value!.jobControlOption!.dependOnType}
                                    placeholder={t('flow.orchestration.dependOnJobIdPlaceholder')}
                                    disabled={!props.editable}
                                  />
                                )}
                              </FormItem>

                              <FormItem label={t('flow.orchestration.jobTimeout')} required>
                                <Input
                                  v-model={formData.value!.maxRunningMinutes}
                                  type="number"
                                  placeholder={t('flow.orchestration.jobTimeoutPlaceholder')}
                                  disabled={!props.editable}
                                />
                              </FormItem>

                              <FormItem label={t('flow.orchestration.whenToRunJob')} required>
                                <Select
                                  v-model={formData.value!.jobControlOption!.runCondition}
                                  disabled={!props.editable}
                                  list={runConditionOptions.map((option) => ({
                                    label: option.name,
                                    value: option.id,
                                  }))}
                                />
                              </FormItem>

                              {/* 自定义变量输入框 - 当选择满足变量或不满足变量时显示 */}
                              {showCustomVariables.value && (
                                <FormItem>
                                  {{
                                    label: () => (
                                      <div class={sharedStyles.labelWithIcon}>
                                        <span>{t('flow.orchestration.customVar')}</span>
                                      </div>
                                    ),
                                    default: () => (
                                      <KeyValueMap
                                        value={
                                          formData.value!.jobControlOption!.customVariables || []
                                        }
                                        name="customVariables"
                                        handleChange={handleCustomVariablesChange}
                                        addBtnText={t('flow.orchestration.addVariable')}
                                        keyPlaceholder={t('flow.orchestration.envKeyPlaceholder')}
                                        valuePlaceholder={t(
                                          'flow.orchestration.envValuePlaceholder',
                                        )}
                                        allowNull={false}
                                        disabled={!props.editable}
                                      />
                                    ),
                                  }}
                                </FormItem>
                              )}

                              {/* 自定义条件表达式输入框 - 当选择表达式时显示 */}
                              {showCustomCondition.value && (
                                <FormItem>
                                  {{
                                    label: () => (
                                      <div class={sharedStyles.labelWithIcon}>
                                        <span>{t('flow.orchestration.customConditionExp')}</span>
                                      </div>
                                    ),
                                    default: () => (
                                      <Input
                                        v-model={formData.value!.jobControlOption!.customCondition}
                                        placeholder={t(
                                          'flow.orchestration.customConditionExpPlaceholder',
                                        )}
                                        disabled={!props.editable}
                                      />
                                    ),
                                  }}
                                </FormItem>
                              )}
                            </div>
                          ),
                        }}
                      </Collapse.CollapsePanel>
                    </Collapse>
                  </div>

                  <div class={sharedStyles.flowControlSection}>
                    <Collapse useBlockTheme>
                      <Collapse.CollapsePanel>
                        {{
                          default: () => (
                            <div class={sharedStyles.collapseHeader}>
                              <div class={sharedStyles.collapseHeaderLeft}>
                                <span>{mutexGroupPanel}</span>
                                <Switcher
                                  v-model={formData.value!.mutexGroup!.enable}
                                  size="small"
                                  theme="primary"
                                  disabled={!props.editable}
                                  onChange={handleMutexGroupChange}
                                  onClick={handleSwitcherClick}
                                />
                              </div>
                            </div>
                          ),
                          content: () =>
                            formData.value!.mutexGroup!.enable ? (
                              <div class={sharedStyles.collapseContent}>
                                <FormItem label={t('flow.orchestration.mutexGroupName')} required>
                                  <Input
                                    v-model={formData.value!.mutexGroup!.mutexGroupName}
                                    placeholder={t('flow.orchestration.mutexGroupNamePlaceholder')}
                                    disabled={!props.editable}
                                  />
                                </FormItem>

                                <FormItem>
                                  <Checkbox
                                    v-model={formData.value!.mutexGroup!.queueEnable}
                                    disabled={!props.editable}
                                  >
                                    {t('flow.orchestration.queueEnable')}
                                  </Checkbox>
                                </FormItem>

                                {formData.value!.mutexGroup!.queueEnable && (
                                  <FormItem label={t('flow.orchestration.mutexTimeout')} required>
                                    <Input
                                      v-model={formData.value!.mutexGroup!.timeoutVar}
                                      type="number"
                                      placeholder={t('flow.orchestration.mutexTimeoutPlaceholder')}
                                      disabled={!props.editable}
                                    />
                                  </FormItem>
                                )}

                                {formData.value!.mutexGroup!.queueEnable && (
                                  <FormItem label={t('flow.orchestration.queueSize')} required>
                                    <Input
                                      v-model={formData.value!.mutexGroup!.queue}
                                      type="number"
                                      placeholder={t('flow.orchestration.queueSizePlaceholder')}
                                      disabled={!props.editable}
                                    />
                                  </FormItem>
                                )}
                              </div>
                            ) : null,
                        }}
                      </Collapse.CollapsePanel>
                    </Collapse>
                  </div>
                </Form>
              </div>
            ) : null,
          footer: () => (
            <div class={styles.jobPanelFooter}>
              <Button theme="primary" onClick={handleConfirm} disabled={!props.editable}>
                {t('flow.orchestration.add')}
              </Button>
              <Button onClick={handleCancel}>{t('flow.common.cancel')}</Button>
            </div>
          ),
        }}
      </Sideslider>
    )
  },
})
