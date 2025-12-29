import type { CustomVariable, Stage } from '@/api/flowModel'
import KeyValueMap from '@/components/AtomForm/KeyValueMap'
import { SvgIcon } from '@/components/SvgIcon'
import { getStageRunConditionList } from '@/constants/flowOptionConfig'
import { useUIStore } from '@/stores/ui'
import { StageRunCondition } from '@/utils/flowDefaults'
import { Button, Checkbox, Collapse, Form, InfoBox, Input, Select, Sideslider } from 'bkui-vue'
import { storeToRefs } from 'pinia'
import { computed, defineComponent, type PropType, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import sharedStyles from './shared.module.css'
import styles from './StagePropertyPanel.module.css'

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
    const { t } = useI18n()
    const { isVariablePanelOpen } = storeToRefs(useUIStore())

    // ========== State ==========
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
    const isTriggerStage = computed(() => props.stage?.containers?.[0]?.['@type'] === 'trigger')
    const isFinallyStage = computed(() => props.stage?.finally === true)
    const showCustomVariables = computed(() =>
      [StageRunCondition.CUSTOM_VARIABLE_MATCH, StageRunCondition.CUSTOM_VARIABLE_MATCH_NOT_RUN].includes(
        formData.value.runCondition as StageRunCondition,
      ),
    )
    const showCustomCondition = computed(
      () => formData.value.runCondition === StageRunCondition.CUSTOM_CONDITION_MATCH,
    )

    const collapses = [t('flow.orchestration.flowControlOptions')]
    const runConditionOptions = getStageRunConditionList(t).map((opt) => ({
      label: opt.name,
      value: opt.id,
    }))

    // ========== Helpers ==========
    /** 根据 formData 构造完整的 Stage 对象 */
    function buildUpdatedStage() {
      if (!props.stage) return null
      return {
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
    }

    function closePanel() {
      emit('update:modelValue', false)
    }

    // ========== Watchers ==========
    // 同步 props.stage 到 formData
    watch(
      () => props.stage,
      (stage) => {
        if (!stage) return
        const ctrl = stage.stageControlOption
        formData.value = {
          name: stage.name || '',
          enable: ctrl?.enable ?? true,
          fastKill: stage.fastKill || false,
          runCondition: ctrl?.runCondition || 'AFTER_LAST_FINISHED',
          customVariables: ctrl?.customVariables || [],
          customCondition: ctrl?.customCondition || '',
        }
      },
      { immediate: true, deep: true },
    )

    // 清理 runCondition 相关的条件字段
    watch(
      () => formData.value.runCondition,
      (condition) => {
        const isVarMatch = [
          StageRunCondition.CUSTOM_VARIABLE_MATCH,
          StageRunCondition.CUSTOM_VARIABLE_MATCH_NOT_RUN,
        ].includes(condition as StageRunCondition)

        if (!isVarMatch) {
          formData.value.customVariables = []
        } else if (!formData.value.customVariables?.length) {
          formData.value.customVariables = [{ key: 'param1', value: '' }]
        }

        if (condition !== StageRunCondition.CUSTOM_CONDITION_MATCH) {
          formData.value.customCondition = ''
        }
      },
    )

    // 表单变化时同步到 flowModel（仅编辑模式）
    watch(
      formData,
      () => {
        if (!props.isNew && props.stage) {
          const updated = buildUpdatedStage()
          if (updated) emit('change', updated)
        }
      },
      { deep: true },
    )

    // ========== Handlers ==========
    function handleConfirm() {
      if (!formData.value.name?.trim()) {
        InfoBox({
          title: t('flow.common.failed'),
          subTitle: t('flow.orchestration.stageNameRequired'),
          theme: 'danger',
        })
        return
      }
      const updated = buildUpdatedStage()
      if (updated) {
        emit('confirm', updated)
        closePanel()
      }
    }

    function exitNameEdit() {
      if (props.editable) nameEditing.value = false
    }

    // ========== Render ==========
    return () => (
      <Sideslider
        isShow={props.modelValue}
        width={640}
        quick-close
        onUpdate:isShow={(val: boolean) => emit('update:modelValue', val)}
        class={['bkci-property-panel', isVariablePanelOpen.value && 'with-variable-open']}
      >
        {{
          header: () => (
            <div class={sharedStyles.propertyPanelHeader}>
              {props.isNew ? (
                <span>{t('flow.orchestration.addStage')}</span>
              ) : (
                <div class={sharedStyles.nameEdit}>
                  {nameEditing.value ? (
                    <Input
                      modelValue={formData.value.name}
                      maxlength={30}
                      placeholder={t('flow.orchestration.stageNamePlaceholder')}
                      onBlur={exitNameEdit}
                      onEnter={exitNameEdit}
                      onChange={(val: string) => (formData.value.name = val)}
                      class={sharedStyles.nameInput}
                      autoFocus
                    />
                  ) : (
                    <>
                      <p class={sharedStyles.nameText} title={formData.value.name}>
                        {formData.value.name || t('flow.orchestration.stageNamePlaceholder')}
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

          default: () => (
            <div class={styles.stagePanelContent}>
              <Form form-type="vertical" model={formData.value}>
                {/* Stage Name - 仅在新建模式下显示 */}
                {props.isNew && (
                  <FormItem label={t('flow.orchestration.stageName')} required>
                    <Input
                      v-model={formData.value.name}
                      maxlength={30}
                      placeholder={t('flow.orchestration.stageNamePlaceholder')}
                      disabled={!props.editable}
                    />
                  </FormItem>
                )}
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
                              <Checkbox v-model={formData.value.fastKill} disabled={!props.editable}>
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
                                list={runConditionOptions}
                              />
                            </FormItem>

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
                                  value={formData.value.customVariables}
                                  name="customVariables"
                                  handleChange={(_: string, val: CustomVariable[]) =>
                                    (formData.value.customVariables = val)
                                  }
                                  addBtnText={t('flow.orchestration.addVariable')}
                                  keyPlaceholder={t('flow.orchestration.envKeyPlaceholder')}
                                  valuePlaceholder={t('flow.orchestration.envValuePlaceholder')}
                                  allowNull={false}
                                  disabled={!props.editable}
                                />
                              </FormItem>
                            )}

                            {showCustomCondition.value && (
                              <FormItem
                                v-slots={{
                                  label: () => (
                                    <div class={sharedStyles.labelWithIcon}>
                                      <span>{t('flow.orchestration.customConditionExp')}</span>
                                    </div>
                                  ),
                                }}
                              >
                                <Input
                                  v-model={formData.value.customCondition}
                                  placeholder={t('flow.orchestration.customConditionExpPlaceholder')}
                                  disabled={!props.editable}
                                />
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

          footer: () =>
            props.isNew && (
              <div class={styles.stagePanelFooter}>
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
