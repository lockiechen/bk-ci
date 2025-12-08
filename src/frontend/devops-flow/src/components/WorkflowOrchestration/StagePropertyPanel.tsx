import { computed, defineComponent, type PropType, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Sideslider, Form, Input, Checkbox, Collapse, Button, InfoBox, Select } from 'bkui-vue'
import type { Stage, CustomVariable } from '@/api/flowModel'
import { SvgIcon } from '@/components/SvgIcon'
import KeyValueMap from '@/components/AtomForm/KeyValueMap'
import styles from './StagePropertyPanel.module.css'
import sharedStyles from './shared.module.css'
import { getStageRunConditionList } from '@/constants/flowOptionConfig'
import { StageRunCondition } from '@/utils/flowDefaults'
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'

const { FormItem } = Form

export interface StagePropertyPanelProps {
  stage: Stage | null
  modelValue: boolean
  editable: boolean
  isNew?: boolean
}

export default defineComponent({
  name: 'StagePropertyPanel',
  props: {
    stage: {
      type: Object as PropType<Stage | null>,
      default: null,
    },
    modelValue: {
      type: Boolean,
      default: false,
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
    const formData = ref({
      name: '',
      enable: true,
      fastKill: false,
      runCondition: 'AFTER_LAST_FINISHED' as string,
      customVariables: [] as CustomVariable[],
      customCondition: '',
    })
    const nameEditing = ref(false)

    // ========== Computed ==========
    const stageTitle = computed(() => {
      return props.isNew ? t('flow.orchestration.addStage') : t('flow.orchestration.editStage')
    })

    const isTriggerStage = computed(() => {
      return props.stage?.containers?.[0]?.['@type'] === 'trigger'
    })

    const isFinallyStage = computed(() => {
      return props.stage?.finally === true
    })

    // 判断是否显示自定义变量输入框
    const showCustomVariables = computed(() => {
      const runCondition = formData.value.runCondition
      return (
        runCondition === StageRunCondition.CUSTOM_VARIABLE_MATCH ||
        runCondition === StageRunCondition.CUSTOM_VARIABLE_MATCH_NOT_RUN
      )
    })

    // 判断是否显示自定义条件表达式输入框
    const showCustomCondition = computed(() => {
      return formData.value.runCondition === 'CUSTOM_CONDITION_MATCH'
    })

    // ========== Lifecycle Hooks ==========
    watch(
      () => props.stage,
      (newStage) => {
        if (newStage) {
          const stageControl = newStage.stageControlOption
          formData.value = {
            name: newStage.name || '',
            enable: stageControl?.enable ?? true,
            fastKill: newStage.fastKill || false,
            runCondition: stageControl?.runCondition || 'AFTER_LAST_FINISHED',
            customVariables: stageControl?.customVariables || [],
            customCondition: stageControl?.customCondition || '',
          }
        }
      },
      { immediate: true, deep: true },
    )

    // 监听runCondition变化，清理不需要的字段
    watch(
      () => formData.value.runCondition,
      (newCondition) => {
        // 如果切换到非变量匹配选项，清空customVariables
        if (
          newCondition !== StageRunCondition.CUSTOM_VARIABLE_MATCH &&
          newCondition !== StageRunCondition.CUSTOM_VARIABLE_MATCH_NOT_RUN
        ) {
          formData.value.customVariables = []
        } else if (!formData.value.customVariables || formData.value.customVariables.length === 0) {
          // 如果切换到变量匹配选项且没有customVariables，初始化默认值
          formData.value.customVariables = [{ key: 'param1', value: '' }]
        }

        // 如果切换到非表达式选项，清空customCondition
        if (newCondition !== StageRunCondition.CUSTOM_CONDITION_MATCH) {
          formData.value.customCondition = ''
        }
      },
    )

    // ========== Functions ==========
    const collapses = [t('flow.orchestration.flowControlOptions')]
    const runConditionOptions = getStageRunConditionList(t)

    function toggleEditName(show: boolean) {
      if (!props.editable) return
      nameEditing.value = show
    }

    function handleEditName(value: string) {
      formData.value.name = value
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

    function handleVisibleChange(val: boolean) {
      emit('update:modelValue', val)
    }

    function validateForm() {
      if (!formData.value.name || formData.value.name.trim() === '') {
        InfoBox({
          title: t('flow.common.failed'),
          subTitle: t('flow.orchestration.stageNameRequired'),
          theme: 'danger',
        })
        return false
      }
      return true
    }

    function handleConfirm() {
      if (!validateForm()) {
        return
      }

      if (!props.stage) return

      const updatedStage = {
        ...props.stage,
        name: formData.value.name,
        fastKill: formData.value.fastKill,
        stageControlOption: {
          ...(props.stage.stageControlOption || {}),
          enable: formData.value.enable,
          runCondition: formData.value.runCondition,
          customVariables: formData.value.customVariables,
          customCondition: formData.value.customCondition,
        },
      }

      emit('confirm', updatedStage)
      emit('update:modelValue', false)
    }

    function handleCancel() {
      emit('update:modelValue', false)
    }

    function handleCustomVariablesChange(name: string, value: CustomVariable[]) {
      formData.value.customVariables = value
    }

    function handleCustomConditionChange(value: string) {
      formData.value.customCondition = value
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
                    modelValue={formData.value.name}
                    maxlength={30}
                    placeholder={t('flow.orchestration.stageNamePlaceholder')}
                    onBlur={handleBlur}
                    onEnter={handleEnter}
                    onChange={handleNameChange}
                    class={sharedStyles.nameInput}
                    autoFocus
                  />
                ) : (
                  <>
                    <p class={sharedStyles.nameText} title={formData.value.name}>
                      {formData.value.name || t('flow.orchestration.stageNamePlaceholder')}
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
          default: () => (
            <div class={styles.stagePanelContent}>
              <Form ref={formRef} form-type="vertical" model={formData.value}>
                {!isTriggerStage.value && !isFinallyStage.value && (
                  <div class={sharedStyles.flowControlSection}>
                    <Collapse useBlockTheme list={collapses}>
                      {{
                        content: () => (
                          <div class={sharedStyles.collapseContent}>
                            <FormItem>
                              <Checkbox v-model={formData.value.enable} disabled={!props.editable}>
                                {t('flow.orchestration.enableStage')}
                              </Checkbox>
                            </FormItem>

                            <FormItem>
                              <Checkbox
                                v-model={formData.value.fastKill}
                                disabled={!props.editable}
                              >
                                {t('flow.orchestration.stageFastKill')}
                              </Checkbox>
                              <span
                                class={sharedStyles.infoIcon}
                                title={t('flow.orchestration.stageFastKillDesc')}
                              >
                                <SvgIcon name="info-circle" size={14} />
                              </span>
                            </FormItem>

                            <FormItem label={t('flow.orchestration.whenToRunStage')} required>
                              <Select
                                v-model={formData.value.runCondition}
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
                                      value={formData.value.customVariables}
                                      name="customVariables"
                                      handleChange={handleCustomVariablesChange}
                                      addBtnText={t('flow.orchestration.addVariable')}
                                      keyPlaceholder={t('flow.orchestration.envKeyPlaceholder')}
                                      valuePlaceholder={t('flow.orchestration.envValuePlaceholder')}
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
                                      v-model={formData.value.customCondition}
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
                    </Collapse>
                  </div>
                )}
              </Form>
            </div>
          ),
          footer: () => (
            <div class={styles.stagePanelFooter}>
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
