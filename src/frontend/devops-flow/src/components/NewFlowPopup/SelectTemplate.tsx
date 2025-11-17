import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Radio, Checkbox, Message } from 'bkui-vue'
import { SvgIcon } from '@/components/SvgIcon'
import FlowModel from '@/views/Flow/Detail/FlowModel'
import AuthoringEnv from '@/views/Flow/Detail/AuthoringEnv'
import TriggerTab from '@/views/Flow/Detail/TriggerEvent'
import NoticeTab from '@/views/Flow/Detail/Notice'
import SettingTab from '@/views/Flow/Detail/BasicSetting'

import styles from './Index.module.css'
type FlowTabTypeEnum = typeof FlowModel | typeof AuthoringEnv | typeof TriggerTab | typeof NoticeTab | typeof SettingTab

export default defineComponent({
  name: 'SelectTemplate',
  components: {
    SvgIcon,
    FlowModel,
    AuthoringEnv,
    TriggerTab,
    NoticeTab,
    SettingTab,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        activeTemplate: { name: '', logoUrl: '', desc: '' },
        currentModel: 'freedomMode',
        cloneTemplateSet: [],
        activeMenuItem: 'flowModel',
      }),
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()

    const templateInfoData = ref({
      activeTemplate: {
        ...props.modelValue?.activeTemplate,
        name: props.modelValue?.activeTemplate?.name || t('flow.content.blankTemplate'),
      },
      currentModel: props.modelValue?.currentModel || 'freedomMode',
      cloneTemplateSet: props.modelValue?.cloneTemplateSet || [],
      activeMenuItem: props.modelValue?.activeMenuItem || 'flowModel',
    })
    const isTemplatPopup = ref(false)
    const templateList = ref([])

    watch(
      () => props.modelValue,
      (newValue) => {
        templateInfoData.value = { ...templateInfoData.value, ...newValue }
      },
      { deep: true },
    )

    const configList = computed(() =>
      [
        {
          title: t('flow.flowModel'),
          name: 'flowModel',
        },
        {
          title: t('flow.authoringEnv'),
          name: 'authoringEnv',
        },
        {
          title: t('flow.trigger'),
          name: 'trigger',
        },
        {
          title: t('flow.noticeSetting'),
          name: 'notice',
        },
        {
          title: t('flow.baseSetting'),
          name: 'setting',
        },
      ].map((child) => ({
        ...child,
        disableTooltip: {
          disabled: true,
        },
        active: templateInfoData.value.activeMenuItem === child.name,
      })),
    )

    const configComponentMap: Record<string, FlowTabTypeEnum> = {
      flowModel: FlowModel,
      authoringEnv: AuthoringEnv,
      trigger: TriggerTab,
      notice: NoticeTab,
      setting: SettingTab,
    }

    function handleChange() {
      emit('update:modelValue', templateInfoData.value)
    }

    function renderDynamicComponent() {
      const TargetComponent = configComponentMap[templateInfoData.value.activeMenuItem]
      return TargetComponent ? <TargetComponent /> : null
    }

    function changeConfig(name: string) {
      templateInfoData.value.activeMenuItem = name
    }

    return () => (
      <div class={styles.selectTemplate}>
        <div class={styles.headerAside}>
          <div class={styles.activeSelect}>
            <span class={styles.activeImage}>
              {templateInfoData.value.activeTemplate.logoUrl ? (
                <img src={templateInfoData.value.activeTemplate.logoUrl} width={32} height={32} />
              ) : (
                <SvgIcon name="placeholder" size={32} />
              )}
            </span>
            <div class={styles.activeLabel}>
              <p>{templateInfoData.value.activeTemplate.name}</p>
              {templateInfoData.value.activeTemplate.name === t('flow.content.blankTemplate') ? (
                <p class={styles.activeDesc}>{t('flow.content.orchestrateFromScratch')}</p>
              ) : (
                <p class={styles.activeDesc}>
                  {templateInfoData.value.activeTemplate.desc || '--'}
                </p>
              )}
            </div>
            <span class={styles.selectIcon}>
              <SvgIcon name={isTemplatPopup.value ? 'arrow-up' : 'arrow-down'} size={12} />
            </span>
          </div>
          <div class={styles.settingAside}>
            <div class={styles.modelSelect}>
              <p class={styles.settingLabel}>{t('flow.content.mode')}</p>
              <Radio.Group
                v-model={templateInfoData.value.currentModel}
                size="small"
                onChange={handleChange}
              >
                <Radio label="freedomMode">{t('flow.content.freeMode')}</Radio>
                <Radio label="constraintMode" disabled={true}>
                  {t('flow.content.constraintMode')}
                </Radio>
              </Radio.Group>
            </div>
            <div class={styles.cloneTemplateSet}>
              <p class={styles.settingLabel}>{t('flow.content.cloneTemplateSettings')}</p>
              <Checkbox.Group
                v-model={templateInfoData.value.cloneTemplateSet}
                disabled={true}
                onChange={handleChange}
              >
                <Checkbox label="freedomMode" size="small">
                  {t('flow.content.notificationSettings')}
                </Checkbox>
                <Checkbox label="constraintMode" size="small">
                  {t('flow.content.concurrencyPolicy')}
                </Checkbox>
                <Checkbox label="constraintMode" size="small">
                  {t('flow.content.tag')}
                </Checkbox>
              </Checkbox.Group>
            </div>
          </div>
        </div>
        <div class={styles.contentConfig}>
          <ul class={styles.configAside}>
            {configList.value.map((item) => (
              <li
                onClick={() => changeConfig(item.name)}
                class={`${styles.configItem} ${templateInfoData.value.activeMenuItem === item.name ? styles.configActive : ''}`}
              >
                {item.title}
              </li>
            ))}
          </ul>
          <div class={styles.configContent}>{renderDynamicComponent()}</div>
        </div>
      </div>
    )
  },
})
