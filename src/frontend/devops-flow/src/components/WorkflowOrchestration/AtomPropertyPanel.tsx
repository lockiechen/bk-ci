import { defineComponent, computed, type PropType, watch, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Button, Form, Input, Sideslider, Loading, Select, Popover, Collapse } from 'bkui-vue'
const { FormItem } = Form
const { Option } = Select
const { CollapsePanel } = Collapse
import type { AdditionalOptions, CustomVariable, Element } from '@/api/flowModel'
import type { AtomModal, AtomVersion } from '@/api/atom'
import { useAtomStore } from '@/stores/atom'
import { useAtomVersion } from '@/hooks/useAtomVersion'
import styles from './AtomPropertyPanel.module.css'
import sharedStyles from './shared.module.css'
import AtomForm from '@/components/AtomForm/AtomForm'
import KeyValueMap from '@/components/AtomForm/KeyValueMap'
import AtomCheckbox from '@/components/AtomForm/AtomCheckbox'
import AtomCheckboxList from '@/components/AtomForm/AtomCheckboxList'
import { SvgIcon } from '@/components/SvgIcon'
import { getAtomFailControlList, getAtomRunConditionList } from '@/constants/flowOptionConfig'
import { AtomRunCondition } from '@/utils/flowDefaults'
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'AtomPropertyPanel',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    currentElement: {
      type: Object as PropType<Element | null>,
      default: null,
    },
  },
  emits: ['update:visible', 'chooseAtom', 'updateAtom'],
  setup(props, { emit }) {
    // ========== Hooks ==========
    const { t } = useI18n()
    const route = useRoute()
    const atomStore = useAtomStore()
    const projectCode = (route.params.projectId as string) || 'lockie'
    const atomVersion = useAtomVersion({ projectCode })
    const uiStore = useUIStore()
    const { isVariablePanelOpen } = storeToRefs(uiStore)

    // ========== Refs ==========
    const editingElement = ref<Element | null>(null)
    const versionList = ref<AtomVersion[]>([])
    const isLoadingVersion = ref(false)
    const nameEditing = ref(false)

    // ========== Computed ==========
    const atomCode = computed(() => {
      const element = props.currentElement
      if (!element) return ''
      // 如果是第三方插件，使用 atomCode，否则使用 @type
      const isThird = element.atomCode && element['@type'] !== element.atomCode
      return isThird ? element.atomCode : element['@type'] || ''
    })

    const atomVersionValue = computed(() => {
      return props.currentElement?.version || '1.*'
    })

    const atomModal = computed<AtomModal | null>(() => {
      const code = atomCode.value
      const version = atomVersionValue.value
      if (!code || !version) return null
      // 直接从 Pinia store 缓存中读取
      return atomStore.getCachedAtomModal(code, version)
    })

    const isLoadingModal = computed(() => {
      const code = atomCode.value
      const version = atomVersionValue.value
      if (!code || !version) return false
      return atomStore.isLoadingAtomModal(code, version)
    })

    const isAtomSelected = computed(() => {
      return !!atomCode.value && !!props.currentElement
    })

    const atomPropsModel = computed(() => {
      const modal = atomModal.value
      if (!modal) return {}

      const { htmlTemplateVersion, props } = modal

      // 1.1 及以上版本使用 props.input 作为配置定义
      // 如果 htmlTemplateVersion 存在且不为 '1.0'，则认为是新版结构
      if (htmlTemplateVersion && htmlTemplateVersion !== '1.0') {
        return (props?.input as Record<string, any>) || {}
      }

      // 1.0 版本直接使用 props
      return props || {}
    })

    const atomValue = computed(() => {
      const element = props.currentElement
      return element?.data?.input || {}
    })

    const customEnv = computed(() => {
      return props.currentElement?.customEnv || []
    })

    const additionalOptions = computed(() => {
      return props.currentElement?.additionalOptions || ({} as AdditionalOptions)
    })

    const failControlValue = computed(() => {
      const options = additionalOptions.value
      const control: string[] = []
      if (options.continueWhenFailed) control.push('continueWhenFailed')
      if (options.retryWhenFailed) control.push('retryWhenFailed')
      if (options.manualRetry) control.push('MANUAL_RETRY')
      return control
    })

    // 判断是否显示自定义变量输入框
    const showCustomVariables = computed(() => {
      const runCondition = additionalOptions.value.runCondition
      return (
        runCondition === AtomRunCondition.CUSTOM_VARIABLE_MATCH ||
        runCondition === AtomRunCondition.CUSTOM_VARIABLE_MATCH_NOT_RUN
      )
    })

    // 判断是否显示自定义条件表达式输入框
    const showCustomCondition = computed(() => {
      return additionalOptions.value.runCondition === AtomRunCondition.CUSTOM_CONDITION_MATCH
    })

    // 获取自定义变量列表
    const customVariables = computed(() => {
      return additionalOptions.value.customVariables || []
    })

    // 获取自定义条件表达式
    const customCondition = computed(() => {
      return additionalOptions.value.customCondition || ''
    })

    const computedVersionList = computed(() => {
      const currentVersion = atomVersionValue.value
      const list = versionList.value.map((v) => ({
        value: v.versionValue,
        label: v.versionName,
      }))

      // 如果当前版本不在列表中，添加到列表
      if (currentVersion && !list.find((v) => v.value === currentVersion)) {
        list.push({
          value: currentVersion,
          label: currentVersion.replace('.*', '.latest'),
        })
      }
      return list
    })

    const atomDisplayName = computed(() => {
      if (atomModal.value?.name) {
        return atomModal.value.name
      }
      return getAtomName()
    })

    const docsLink = computed(() => {
      // TODO: 如果 atomModal 中有 docsLink，从这里获取
      // 目前先返回空，后续可以从 atomStore 或其他地方获取
      return atomModal.value?.docsLink || ''
    })

    // ========== Lifecycle Hooks ==========
    watch(
      () => props.currentElement,
      (element) => {
        editingElement.value = element
      },
      { immediate: true },
    )

    watch(
      atomCode,
      (newCode) => {
        if (newCode) {
          loadVersionList()
        } else {
          versionList.value = []
        }
      },
      { immediate: true },
    )
    // ========== Functions ==========
    function getAtomName() {
      if (props.currentElement?.name) {
        return props.currentElement.name
      }
      if (atomCode.value) {
        return atomCode.value
      }
      return ''
    }

    function handleClose() {
      emit('update:visible', false)
    }

    function handleChooseAtom() {
      emit('chooseAtom')
    }

    function toggleEditName(show: boolean) {
      nameEditing.value = show
    }

    function handleEditName(value: string) {
      if (!props.currentElement) return
      const element = { ...props.currentElement, name: value }
      emit('updateAtom', element)
    }

    function handleConfigChange(key: string, value: any) {
      if (!props.currentElement) return

      const element = { ...props.currentElement }
      if (!element.data) {
        element.data = { input: {}, output: [] }
      }
      if (!element.data.input) {
        element.data.input = {}
      }

      element.data.input[key] = value

      emit('updateAtom', element)
    }

    function handleCustomEnvChange(value: CustomVariable[]) {
      if (!props.currentElement) return
      const element = { ...props.currentElement, customEnv: value }
      emit('updateAtom', element)
    }

    function handleAdditionalOptionsChange(key: string, value: any) {
      if (!props.currentElement) return
      const currentOptions = additionalOptions.value
      const newOptions = { ...currentOptions, [key]: value } as AdditionalOptions

      // 处理 failControl 的联动逻辑
      if (key === 'failControl') {
        const failControl = value as string[]
        newOptions.continueWhenFailed = failControl.includes('continueWhenFailed')
        newOptions.retryWhenFailed = failControl.includes('retryWhenFailed')
        newOptions.manualRetry = failControl.includes('MANUAL_RETRY')
        newOptions.failControl = failControl
      }

      const element = { ...props.currentElement, additionalOptions: newOptions }
      emit('updateAtom', element)
    }

    function handleStepIdChange(value: string) {
      if (!props.currentElement) return
      const element = { ...props.currentElement, stepId: value }
      emit('updateAtom', element)
    }

    async function handleVersionChange(version: string) {
      if (!props.currentElement || props.currentElement.version === version) return

      const element = { ...props.currentElement, version }

      // 加载新版本的配置
      const code = atomCode.value
      if (code) {
        try {
          await atomStore.getAtomModal(code, version, projectCode)
        } catch (error) {
          console.error('Failed to load atom modal:', error)
        }
      }

      emit('updateAtom', element)
    }

    async function loadVersionList() {
      const code = atomCode.value
      if (!code) return

      isLoadingVersion.value = true
      try {
        const versions = await atomVersion.loadVersionList(code)
        versionList.value = versions
      } catch (error) {
        console.error('Failed to load version list:', error)
        versionList.value = []
      } finally {
        isLoadingVersion.value = false
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

    function handleDocLinkClick(e: MouseEvent) {
      e.stopPropagation()
    }

    function handleCustomEnvChangeWrapper(name: string, value: CustomVariable[]) {
      handleCustomEnvChange(value)
    }

    function handleEnableChange(name: string, value: boolean) {
      handleAdditionalOptionsChange('enable', value)
    }

    function handleFailControlChange(name: string, value: string[]) {
      handleAdditionalOptionsChange('failControl', value)
    }

    function handleTimeoutChange(val: string) {
      handleAdditionalOptionsChange('timeoutVar', val)
    }

    function handleRunConditionChange(val: string) {
      const currentOptions = additionalOptions.value
      const newOptions = { ...currentOptions, runCondition: val } as AdditionalOptions

      // 根据新的runCondition清理不需要的字段
      // 如果切换到非变量匹配选项，清空customVariables
      if (
        val !== AtomRunCondition.CUSTOM_VARIABLE_MATCH &&
        val !== AtomRunCondition.CUSTOM_VARIABLE_MATCH_NOT_RUN
      ) {
        newOptions.customVariables = []
      } else if (!newOptions.customVariables || newOptions.customVariables.length === 0) {
        // 如果切换到变量匹配选项且没有customVariables，初始化默认值
        newOptions.customVariables = [{ key: 'param1', value: '' }]
      }

      // 如果切换到非表达式选项，清空customCondition
      if (val !== 'CUSTOM_CONDITION_MATCH') {
        newOptions.customCondition = ''
      }

      const element = { ...props.currentElement, additionalOptions: newOptions }
      emit('updateAtom', element)
    }

    function handleCustomVariablesChange(value: CustomVariable[]) {
      handleAdditionalOptionsChange('customVariables', value)
    }

    function handleCustomConditionChange(value: string) {
      handleAdditionalOptionsChange('customCondition', value)
    }

    return () => (
      <Sideslider
        isShow={props.visible}
        width={640}
        onClosed={handleClose}
        class={['bkci-property-panel', isVariablePanelOpen.value && 'with-variable-open']}
      >
        {{
          header: () => (
            <div class={sharedStyles.propertyPanelHeader}>
              <div class={sharedStyles.atomNameEdit}>
                {nameEditing.value ? (
                  <Input
                    value={getAtomName()}
                    maxlength={30}
                    placeholder={t('flow.orchestration.atomNamePlaceholder')}
                    onBlur={handleBlur}
                    onEnter={handleEnter}
                    onChange={handleNameChange}
                    class={sharedStyles.nameInput}
                  />
                ) : (
                  <>
                    <p class={sharedStyles.atomNameText} title={getAtomName()}>
                      {isAtomSelected.value
                        ? getAtomName()
                        : t('flow.orchestration.waitingSelectAtom')}
                    </p>
                    {isAtomSelected.value && (
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
            <div class={styles.atomPropertyPanel}>
              <Loading loading={isLoadingModal.value}>
                <div class={styles.content}>
                  <Form formType="vertical">
                    {/* Step ID 配置 */}
                    {isAtomSelected.value && (
                      <FormItem>
                        {{
                          label: () => (
                            <div class={styles.labelWithIcon}>
                              <span>{t('flow.orchestration.stepId')}</span>
                              <Popover content={t('flow.orchestration.stepIdDesc')} placement="top">
                                <span class={sharedStyles.infoIcon}>
                                  <SvgIcon name="info-circle" size={14} />
                                </span>
                              </Popover>
                            </div>
                          ),
                          default: () => (
                            <Input
                              value={props.currentElement?.stepId || ''}
                              placeholder={t('flow.orchestration.stepIdPlaceholder')}
                              onChange={handleStepIdChange}
                              class={styles.stepIdInput}
                            />
                          ),
                        }}
                      </FormItem>
                    )}

                    {/* 插件类型 和 版本 并排显示 */}
                    <div class={styles.flexRow}>
                      <FormItem>
                        {{
                          label: () => (
                            <div class={styles.labelWithIcon}>
                              <span>{t('flow.orchestration.atomLabel')}</span>
                              {isAtomSelected.value && docsLink.value && (
                                <a
                                  href={docsLink.value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class={sharedStyles.atomLink}
                                  onClick={handleDocLinkClick}
                                >
                                  {t('flow.orchestration.atomHelpDoc')}
                                  <SvgIcon name="tiaozhuan" size={14} />
                                </a>
                              )}
                            </div>
                          ),
                          default: () => (
                            <div class={styles.atomTypeSelector}>
                              {isAtomSelected.value ? (
                                <div class={styles.atomSelectEntry}>
                                  <Input
                                    value={atomDisplayName.value}
                                    readonly
                                    class={styles.atomNameInput}
                                  />
                                  <Button
                                    theme="primary"
                                    class={styles.reselectBtn}
                                    onClick={handleChooseAtom}
                                  >
                                    {t('flow.orchestration.reSelect')}
                                  </Button>
                                </div>
                              ) : (
                                <Button theme="primary" onClick={handleChooseAtom}>
                                  {t('flow.orchestration.choosePlugin')}
                                </Button>
                              )}
                            </div>
                          ),
                        }}
                      </FormItem>

                      {isAtomSelected.value && computedVersionList.value.length > 0 && (
                        <FormItem>
                          {{
                            label: () => (
                              <div class={styles.labelWithIcon}>
                                <span>{t('flow.orchestration.version')}</span>
                                <Popover
                                  content={t('flow.orchestration.atomVersionDesc')}
                                  placement="top"
                                >
                                  <span class={sharedStyles.infoIcon}>
                                    <SvgIcon name="info-circle" size={14} />
                                  </span>
                                </Popover>
                              </div>
                            ),
                            default: () => (
                              <Select
                                modelValue={atomVersionValue.value}
                                onChange={handleVersionChange}
                                loading={isLoadingVersion.value}
                                list={computedVersionList.value}
                                clearable={false}
                              ></Select>
                            ),
                          }}
                        </FormItem>
                      )}
                    </div>

                    {isAtomSelected.value && (
                      <>
                        {/* 插件配置表单 */}
                        {atomPropsModel.value && Object.keys(atomPropsModel.value).length > 0 && (
                          <AtomForm
                            atomPropsModel={atomPropsModel.value}
                            atomValue={atomValue.value}
                            element={props.currentElement!}
                            onChange={handleConfigChange}
                          />
                        )}

                        {atomModal.value &&
                          (!atomPropsModel.value ||
                            Object.keys(atomPropsModel.value).length === 0) && (
                            <div class={styles.noConfig}>{t('flow.orchestration.noConfig')}</div>
                          )}

                        {!atomModal.value && !isLoadingModal.value && (
                          <div class={styles.loadError}>
                            {t('flow.orchestration.loadConfigFailed')}
                          </div>
                        )}

                        {/* 自定义环境变量 */}
                        {isAtomSelected.value && (
                          <div class={styles.customEnvSection}>
                            <Collapse useBlockTheme>
                              <CollapsePanel>
                                {{
                                  default: () => (
                                    <div class={sharedStyles.collapseHeader}>
                                      <span>{t('flow.orchestration.customEnv')}</span>
                                    </div>
                                  ),
                                  content: () => (
                                    <div class={sharedStyles.collapseContent}>
                                      <KeyValueMap
                                        value={customEnv.value}
                                        name="customEnv"
                                        handleChange={handleCustomEnvChangeWrapper}
                                        addBtnText={t('flow.orchestration.addVariable')}
                                        keyPlaceholder={t('flow.orchestration.envKeyPlaceholder')}
                                        valuePlaceholder={t(
                                          'flow.orchestration.envValuePlaceholder',
                                        )}
                                      />
                                    </div>
                                  ),
                                }}
                              </CollapsePanel>
                            </Collapse>
                          </div>
                        )}

                        {/* 流程控制选项 */}
                        {isAtomSelected.value && (
                          <div class={styles.processControlSection}>
                            <Collapse useBlockTheme>
                              <CollapsePanel>
                                {{
                                  default: () => (
                                    <div class={sharedStyles.collapseHeader}>
                                      <span>{t('flow.orchestration.flowControlOptions')}</span>
                                    </div>
                                  ),
                                  content: () => (
                                    <div class={sharedStyles.collapseContent}>
                                      <Form labelWidth={120} formType="vertical">
                                        {/* 启用本插件 */}
                                        <FormItem>
                                          <AtomCheckbox
                                            value={additionalOptions.value.enable ?? true}
                                            name="enable"
                                            text={t('flow.orchestration.enableAtom')}
                                            handleChange={handleEnableChange}
                                          />
                                        </FormItem>

                                        {/* 本插件运行失败时 */}
                                        {additionalOptions.value.enable && (
                                          <FormItem>
                                            <div class={styles.failControlLabel}>
                                              {t('flow.orchestration.whenAtomFailed')}
                                            </div>
                                            <AtomCheckboxList
                                              value={failControlValue.value}
                                              name="failControl"
                                              list={getAtomFailControlList(t)}
                                              handleChange={handleFailControlChange}
                                            />
                                          </FormItem>
                                        )}

                                        {/* 插件执行超时时间 */}
                                        {additionalOptions.value.enable && (
                                          <FormItem>
                                            {{
                                              label: () => (
                                                <div class={sharedStyles.labelWithIcon}>
                                                  <span>{t('flow.orchestration.atomTimeout')}</span>
                                                  <Popover
                                                    content={t('flow.orchestration.timeoutDesc')}
                                                    placement="top"
                                                  >
                                                    <span class={sharedStyles.infoIcon}>
                                                      <SvgIcon name="info-circle" size={14} />
                                                    </span>
                                                  </Popover>
                                                </div>
                                              ),
                                              default: () => (
                                                <Input
                                                  value={
                                                    additionalOptions.value.timeoutVar || '900'
                                                  }
                                                  placeholder={t(
                                                    'flow.orchestration.timeoutPlaceholder',
                                                  )}
                                                  onChange={handleTimeoutChange}
                                                />
                                              ),
                                            }}
                                          </FormItem>
                                        )}

                                        {/* 何时运行本插件 */}
                                        {additionalOptions.value.enable && (
                                          <>
                                            <FormItem>
                                              {{
                                                label: () => (
                                                  <div class={sharedStyles.labelWithIcon}>
                                                    <span>
                                                      {t('flow.orchestration.atomRunCondition')}
                                                    </span>
                                                  </div>
                                                ),
                                                default: () => (
                                                  <Select
                                                    modelValue={
                                                      additionalOptions.value.runCondition ||
                                                      'PRE_TASK_SUCCESS'
                                                    }
                                                    onChange={handleRunConditionChange}
                                                    clearable={false}
                                                  >
                                                    {getAtomRunConditionList(t).map((item) => (
                                                      <Option
                                                        key={item.value}
                                                        value={item.value}
                                                        label={item.label}
                                                      />
                                                    ))}
                                                  </Select>
                                                ),
                                              }}
                                            </FormItem>

                                            {/* 自定义变量输入框 - 当选择满足变量或不满足变量时显示 */}
                                            {showCustomVariables.value && (
                                              <FormItem>
                                                {{
                                                  label: () => (
                                                    <div class={sharedStyles.labelWithIcon}>
                                                      <span>
                                                        {t('flow.orchestration.customVar')}
                                                      </span>
                                                    </div>
                                                  ),
                                                  default: () => (
                                                    <KeyValueMap
                                                      value={customVariables.value}
                                                      name="customVariables"
                                                      handleChange={handleCustomVariablesChange}
                                                      addBtnText={t(
                                                        'flow.orchestration.addVariable',
                                                      )}
                                                      keyPlaceholder={t(
                                                        'flow.orchestration.envKeyPlaceholder',
                                                      )}
                                                      valuePlaceholder={t(
                                                        'flow.orchestration.envValuePlaceholder',
                                                      )}
                                                      allowNull={false}
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
                                                      <span>
                                                        {t('flow.orchestration.customConditionExp')}
                                                      </span>
                                                    </div>
                                                  ),
                                                  default: () => (
                                                    <Input
                                                      value={customCondition.value}
                                                      placeholder={t(
                                                        'flow.orchestration.customConditionExpPlaceholder',
                                                      )}
                                                      onChange={handleCustomConditionChange}
                                                    />
                                                  ),
                                                }}
                                              </FormItem>
                                            )}
                                          </>
                                        )}
                                      </Form>
                                    </div>
                                  ),
                                }}
                              </CollapsePanel>
                            </Collapse>
                          </div>
                        )}
                      </>
                    )}
                  </Form>
                </div>
              </Loading>
            </div>
          ),
        }}
      </Sideslider>
    )
  },
})
