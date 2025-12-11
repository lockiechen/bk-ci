import { defineComponent, computed, ref, watch, type PropType } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Sideslider,
  Form,
  Input,
  Select,
  Switcher,
  Checkbox,
  Radio,
  Button,
  Loading,
} from 'bkui-vue'
import CronTab from '@blueking/crontab'
import '@blueking/crontab/vue3/vue3.css'
import type { Element } from '@/api/flowModel'
import { createDefaultElement } from '@/utils/flowDefaults'
import { SvgIcon } from '@/components/SvgIcon'
import { useAtomStore } from '@/stores/atom'
import AtomForm from '@/components/AtomForm/AtomForm'
import styles from './TriggerPropertyPanel.module.css'

interface StartParam {
  key: string
  value: string
}

const cloneElement = (element: Element): Element => JSON.parse(JSON.stringify(element))

export default defineComponent({
  name: 'TriggerPropertyPanel',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    element: {
      type: Object as PropType<Element | null>,
      default: null,
    },
  },
  emits: ['update:visible', 'save'],
  setup(props, { emit }) {
    const route = useRoute()
    const projectCode = route.params.projectId as string
    const { t, locale } = useI18n()
    const { FormItem } = Form
    const atomStore = useAtomStore()
    const localElement = ref<Element | null>(null)
    const defaultAdditionalOptions = createDefaultElement(0).additionalOptions!

    const resetLocalElement = () => {
      localElement.value = props.element ? cloneElement(props.element) : null
    }

    watch(
      () => props.element,
      () => resetLocalElement(),
      { immediate: true },
    )

    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          resetLocalElement()
        }
      },
    )

    const ensureElementStructure = () => {
      if (!localElement.value) return
      if (!localElement.value.data) {
        localElement.value.data = { input: {}, output: [] }
      }
      if (!localElement.value.data.input) {
        localElement.value.data.input = {}
      }
      if (!localElement.value.additionalOptions) {
        localElement.value.additionalOptions = { ...defaultAdditionalOptions }
      }
    }

    const triggerType = computed(
      () => localElement.value?.atomCode || localElement.value?.['@type'] || '',
    )
    const triggerTitle = computed(() => {
      if (localElement.value?.name) return localElement.value.name
      if (triggerType.value === 'manualTrigger') return t('flow.content.manualTrigger')
      if (triggerType.value === 'timerTrigger') return t('flow.content.timerTrigger')
      return t('flow.content.triggerEvents')
    })

    const isManualTrigger = computed(() => triggerType.value === 'manualTrigger')
    const isTimerTrigger = computed(() => triggerType.value === 'timerTrigger')
    const isCloudDesktopTrigger = computed(() => triggerType.value.toLowerCase().includes('cloud'))

    const atomCode = computed(() => triggerType.value)
    const atomVersion = computed(() => localElement.value?.version || '1.latest')

    const triggerInputs = computed<Record<string, any>>(() => {
      return (localElement.value?.data?.input as Record<string, any>) || {}
    })

    const timerStartNodeType = computed(() => triggerInputs.value.startNodeType || 'assign')
    const timerStartNodeValue = computed(() => triggerInputs.value.startNode || '')
    const timerParams = computed<StartParam[]>(() => triggerInputs.value.startParams || [])

    const cronLocale = computed(() =>
      locale.value?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en',
    )
    const cronExpression = computed({
      get: () => triggerInputs.value.cronExpression || '',
      set: (val: string) => updateTimerInput('cronExpression', val),
    })

    const versionOptions = computed(() => {
      const version = localElement.value?.version || '1.latest'
      return [
        {
          label: version.replace('.*', '.latest'),
          value: version,
        },
      ]
    })

    const handleClose = () => {
      emit('update:visible', false)
    }

    const handleEnableChange = (value: boolean) => {
      ensureElementStructure()
      if (!localElement.value?.additionalOptions) return
      localElement.value.additionalOptions.enable = value
    }

    const handleVersionChange = (version: string) => {
      if (!localElement.value) return
      localElement.value.version = version
    }

    const handleManualFieldChange = (
      field: 'canElementSkip' | 'useLatestParameters',
      value: boolean,
    ) => {
      if (!localElement.value) return
      ;(localElement.value as any)[field] = value
    }

    const updateTimerInput = (key: string, value: any) => {
      ensureElementStructure()
      if (!localElement.value) return
      if (!localElement.value.data) return
      localElement.value.data.input[key] = value
    }

    const handleTimerStartNodeTypeChange = (value: string) => {
      updateTimerInput('startNodeType', value)
    }

    const handleTimerStartNodeChange = (value: string) => {
      updateTimerInput('startNode', value)
    }

    const handleTimerParamChange = (index: number, field: keyof StartParam, value: string) => {
      const params: StartParam[] = timerParams.value.map((item) => ({ ...item }))
      const target = params[index] || { key: '', value: '' }
      params[index] = {
        ...target,
        [field]: value,
      }
      updateTimerInput('startParams', params)
    }

    const handleAddTimerParam = () => {
      const params: StartParam[] = [...timerParams.value, { key: '', value: '' }]
      updateTimerInput('startParams', params)
    }

    const handleRemoveTimerParam = (index: number) => {
      const params: StartParam[] = [...timerParams.value]
      params.splice(index, 1)
      updateTimerInput('startParams', params)
    }

    const handleSave = () => {
      if (!localElement.value) {
        handleClose()
        return
      }
      emit('save', cloneElement(localElement.value))
      handleClose()
    }

    const renderManualSection = () => {
      if (!isManualTrigger.value) return null
      return (
        <div class={styles.section}>
          <Form form-type="vertical">
            <FormItem>
              <Checkbox
                modelValue={localElement.value?.canElementSkip ?? false}
                onChange={(val: boolean) => handleManualFieldChange('canElementSkip', val)}
              >
                {t('flow.triggerPanel.manualAllowSkip')}
              </Checkbox>
            </FormItem>
            <FormItem>
              <Checkbox
                modelValue={localElement.value?.useLatestParameters ?? false}
                onChange={(val: boolean) => handleManualFieldChange('useLatestParameters', val)}
              >
                {t('flow.triggerPanel.manualReuseParams')}
              </Checkbox>
            </FormItem>
          </Form>
        </div>
      )
    }

    const renderTimerSection = () => {
      if (!isTimerTrigger.value) return null
      return (
        <div class={styles.section}>
          <Form form-type="vertical">
            <FormItem label={t('flow.triggerPanel.timerRule')}>
              <CronTab v-model={cronExpression.value} local={cronLocale.value} />
            </FormItem>

            <FormItem label={t('flow.triggerPanel.startNode')}>
              <Radio.Group
                modelValue={timerStartNodeType.value}
                onChange={handleTimerStartNodeTypeChange}
              >
                <Radio label="assign">{t('flow.triggerPanel.startNodeSpecify')}</Radio>
                <Radio label="inherit">{t('flow.triggerPanel.startNodeFollowEnv')}</Radio>
              </Radio.Group>
              {timerStartNodeType.value === 'assign' && (
                <Input
                  value={timerStartNodeValue.value}
                  placeholder={t('flow.triggerPanel.startNodePlaceholder')}
                  onChange={handleTimerStartNodeChange}
                />
              )}
            </FormItem>

            <FormItem label={t('flow.triggerPanel.startParams')}>
              <div class={styles.paramHeader}>
                <Button text theme="primary" onClick={handleAddTimerParam}>
                  {t('flow.triggerPanel.addStartParam')}
                </Button>
              </div>
              {timerParams.value.length === 0 && (
                <div class={styles.paramEmpty}>{t('flow.triggerPanel.paramEmpty')}</div>
              )}
              {timerParams.value.map((param, index) => (
                <div class={styles.paramRow} key={index}>
                  <Input
                    value={param.key}
                    placeholder={t('flow.triggerPanel.paramKeyPlaceholder')}
                    onChange={(val: string) => handleTimerParamChange(index, 'key', val)}
                  />
                  <Input
                    value={param.value}
                    placeholder={t('flow.triggerPanel.paramValuePlaceholder')}
                    onChange={(val: string) => handleTimerParamChange(index, 'value', val)}
                  />
                  <Button text theme="danger" onClick={() => handleRemoveTimerParam(index)}>
                    {t('flow.common.delete')}
                  </Button>
                </div>
              ))}
            </FormItem>
          </Form>
        </div>
      )
    }

    const renderCloudSection = () => {
      if (!isCloudDesktopTrigger.value) return null
      const fields = [
        { key: 'listenDesktops', label: t('flow.triggerPanel.cloudListenDesktop') },
        { key: 'ignoreDesktops', label: t('flow.triggerPanel.cloudIgnoreDesktop') },
        { key: 'triggerUsers', label: t('flow.triggerPanel.cloudTriggerUsers') },
        { key: 'ignoreUsers', label: t('flow.triggerPanel.cloudIgnoreUsers') },
      ]

      return (
        <div class={styles.section}>
          <div class={styles.infoBanner}>
            <SvgIcon name="info-circle" size={16} />
            <span>{t('flow.triggerPanel.cloudRequirement', { version: '1.3.0' })}</span>
          </div>
          <Form form-type="vertical">
            {fields.map((field) => (
              <FormItem key={field.key} label={field.label}>
                <Input
                  type="textarea"
                  rows={3}
                  value={triggerInputs.value[field.key] || ''}
                  placeholder={t('flow.triggerPanel.textareaPlaceholder')}
                  onChange={(val: string) => updateTimerInput(field.key, val)}
                />
              </FormItem>
            ))}
          </Form>
        </div>
      )
    }

    const loadAtomModal = async () => {
      const code = atomCode.value
      const version = atomVersion.value
      if (!code || !version || !props.visible) return
      try {
        await atomStore.getAtomModal(code, version, projectCode)
      } catch (error) {
        console.error('Failed to load trigger atom modal:', error)
      }
    }

    watch([atomCode, atomVersion, () => props.visible], loadAtomModal, { immediate: true })

    const atomModal = computed(() => {
      const code = atomCode.value
      const version = atomVersion.value
      if (!code || !version) return null
      return atomStore.getCachedAtomModal(code, version)
    })

    const atomPropsModel = computed(() => {
      const modal = atomModal.value
      if (!modal) return {}
      const { htmlTemplateVersion, props } = modal
      if (htmlTemplateVersion && htmlTemplateVersion !== '1.0') {
        return (props?.input as Record<string, any>) || {}
      }
      return props || {}
    })

    const atomValue = computed(() => {
      return localElement.value?.data?.input || {}
    })

    const handleAtomFormChange = (name: string, value: any) => {
      updateTimerInput(name, value)
    }

    const hasAtomFormConfig = computed(() => Object.keys(atomPropsModel.value || {}).length > 0)
    const isLoadingModal = computed(() => {
      const code = atomCode.value
      const version = atomVersion.value
      if (!code || !version) return false
      return atomStore.isLoadingAtomModal(code, version)
    })

    const renderDynamicFormSection = () => {
      if (!localElement.value) return null
      if (isLoadingModal.value) {
        return (
          <div class={styles.section}>
            <Loading loading={true} />
          </div>
        )
      }
      if (hasAtomFormConfig.value) {
        return (
          <div class={styles.section}>
            <AtomForm
              atomPropsModel={atomPropsModel.value}
              atomValue={atomValue.value}
              element={localElement.value}
              onChange={handleAtomFormChange}
            />
          </div>
        )
      }

      return null
    }

    const renderContent = () => {
      if (!localElement.value) {
        return <div class={styles.emptyState}>{t('flow.triggerPanel.emptyState')}</div>
      }

      return (
        <div class={styles.panelBody}>
          <div class={styles.fieldGroup}>
            <div class={styles.fieldRow}>
              <span>{t('flow.content.version')}</span>
              <Select
                modelValue={localElement.value.version || '1.latest'}
                list={versionOptions.value}
                onChange={handleVersionChange}
              />
            </div>
          </div>

          {renderDynamicFormSection()}
        </div>
      )
    }

    return () => (
      <Sideslider isShow={props.visible} width={560} onClosed={handleClose}>
        {{
          header: () => (
            <div class={styles.header}>
              <p class={styles.title}>{triggerTitle.value}</p>
              <div class={styles.enableToggle}>
                <Switcher
                  size="small"
                  theme="primary"
                  modelValue={localElement.value?.additionalOptions?.enable ?? true}
                  onChange={handleEnableChange}
                />
                <span>{t('flow.triggerPanel.enabledLabel')}</span>
              </div>
            </div>
          ),
          default: () => <div class={styles.content}>{renderContent()}</div>,
          footer: () => (
            <div class={styles.footer}>
              <Button theme="primary" onClick={handleSave} disabled={!localElement.value}>
                {t('flow.content.save')}
              </Button>
              <Button onClick={handleClose}>{t('flow.common.cancel')}</Button>
            </div>
          ),
        }}
      </Sideslider>
    )
  },
})
