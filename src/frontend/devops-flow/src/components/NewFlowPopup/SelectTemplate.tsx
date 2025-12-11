import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Radio, Checkbox, Popover, Tab, Loading } from 'bkui-vue'
import { SvgIcon } from '@/components/SvgIcon'
import { useNewFlow } from '@/hooks/useNewFlow'
import EmptyPage from '@/components/EmptyPage/index'
import FlowModel from '@/views/Flow/Detail/FlowModel'
import AuthoringEnv from '@/views/Flow/Detail/AuthoringEnv'
import TriggerTab from '@/views/Flow/Detail/TriggerEvent'
import NoticeTab from '@/views/Flow/Detail/Notice'
import SettingTab from '@/views/Flow/Detail/BasicSetting'
import styles from './Index.module.css'
type FlowTabTypeEnum =
  | typeof FlowModel
  | typeof AuthoringEnv
  | typeof TriggerTab
  | typeof NoticeTab
  | typeof SettingTab

export default defineComponent({
  name: 'SelectTemplate',
  components: {
    SvgIcon,
    FlowModel,
    AuthoringEnv,
    TriggerTab,
    NoticeTab,
    SettingTab,
    EmptyPage,
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
    const {
      projectModelList,
      storeModelList,
      projectModelLoading,
      storeModelLoading,
      fetchProjectTemplates,
      fetchStoreTemplates,
      updateTemplateInfo,
      formData,
    } = useNewFlow()

    const templateInfoData = ref({
      activeTemplate: props.modelValue?.activeTemplate,
      currentModel: props.modelValue?.currentModel || 'freedomMode',
      cloneTemplateSet: props.modelValue?.cloneTemplateSet || [],
      activeMenuItem: props.modelValue?.activeMenuItem || 'flowModel',
    })

    // 监听store中formData.templateInfo的变化，确保组件状态与store同步
    watch(
      () => formData.value.templateInfo,
      (newTemplateInfo) => {
        if (newTemplateInfo) {
          templateInfoData.value = { ...templateInfoData.value, ...newTemplateInfo }
        }
      },
      { deep: true, immediate: true },
    )

    onMounted(() => {
      if (!templateInfoData.value.activeTemplate.name) {
        fetchProjectTemplates('default-project')
      }
    })

    const configList = computed(() =>
      [
        {
          title: t('flow.content.workflowOrchestration'),
          name: 'flowModel',
        },
        {
          title: t('flow.content.workflowEnvironment'),
          name: 'authoringEnv',
        },
        {
          title: t('flow.content.triggerEvents'),
          name: 'trigger',
        },
        {
          title: t('flow.content.notificationConfig'),
          name: 'notice',
        },
        {
          title: t('flow.content.basicSettings'),
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
      // 同步更新store中的模板信息
      updateTemplateInfo(templateInfoData.value)
    }

    function renderDynamicComponent() {
      const TargetComponent = configComponentMap[templateInfoData.value.activeMenuItem]
      return TargetComponent ? <TargetComponent /> : null
    }

    function changeConfig(name: string) {
      templateInfoData.value.activeMenuItem = name
      handleChange()
    }

    const isModelListShow = ref(false)
    const panels = ref([
      { name: 'projectModel', label: t('flow.content.projectTemplate') },
      { name: 'storeModel', label: t('flow.content.storeTemplate') },
    ])

    const active = ref('projectModel')

    function handleShowOrHiddenModelList() {
      isModelListShow.value = !isModelListShow.value
    }

    function handleHiddenModelList() {
      isModelListShow.value = false
    }

    /**
     * 处理tab切换事件
     */
    function handleTabChange(tabName: string) {
      active.value = tabName

      if (tabName === 'storeModel' && storeModelList.value.length === 0) {
        // 切换到storeModel时获取商店模板列表
        fetchStoreTemplates('default-project')
      }
    }

    /**
     * 检查模板是否为当前选中的模板
     */
    function isTemplateActive(template: any): boolean {
      return templateInfoData.value.activeTemplate?.name === template.name
    }

    /**
     * 渲染项目模板列表
     */
    function renderProjectModelList() {
      if (projectModelList.value.length === 0) {
        return <EmptyPage />
      }

      return (
        <div class={styles.templateList}>
          {projectModelList.value.map((template) => (
            <div
              class={`${styles.templateItem} ${isTemplateActive(template) ? styles.templateItemActive : ''}`}
              onClick={() => {
                templateInfoData.value.activeTemplate = {
                  name: template.name,
                  logoUrl: template.logoUrl,
                  desc: template.desc,
                }
                handleChange()
                handleHiddenModelList()
              }}
            >
              <span class={styles.templateCorner}>
                <SvgIcon name="check-line" size={12} />
              </span>
              <div class={styles.templateImage}>
                {template.logoUrl ? (
                  <img src={template.logoUrl} width={32} height={32} />
                ) : (
                  <SvgIcon name="placeholder" size={32} />
                )}
              </div>
              <div class="flex-1">
                <div class={styles.templateName}>
                  {template.name}
                  {template?.templateType === 'CONSTRAINT' ? (
                    <span class={styles.templateStore}>
                      <SvgIcon name="is-store" size={20} />
                    </span>
                  ) : null}
                </div>
                <div class={styles.templateDesc}>{template.desc || '--'}</div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    /**
     * 渲染商店模板列表
     */
    function renderStoreModelList() {
      if (storeModelList.value.length === 0) {
        return <EmptyPage />
      }

      return (
        <div class={styles.templateList}>
          {storeModelList.value.map((template) => (
            <div
              class={`${styles.templateItem} ${isTemplateActive(template) ? styles.templateItemActive : ''}`}
              onClick={() => {
                templateInfoData.value.activeTemplate = {
                  name: template.name,
                  logoUrl: template.logoUrl,
                  desc: template.desc,
                }
                handleChange()
                handleHiddenModelList()
              }}
            >
              <span class={styles.templateCorner}>
                <SvgIcon name="check-line" size={12} />
              </span>
              <div class={styles.templateImage}>
                {template.logoUrl ? (
                  <img src={template.logoUrl} width={32} height={32} />
                ) : (
                  <SvgIcon name="placeholder" size={32} />
                )}
              </div>
              <div class="flex-1">
                <div class={styles.templateName}>
                  {template.name}
                  {template?.templateType === 'CONSTRAINT' ? (
                    <span class={styles.templateStore}>
                      <SvgIcon name="is-store" size={20} />
                    </span>
                  ) : null}
                </div>
                <div class={styles.templateDesc}>{template.desc || '--'}</div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return () => (
      <div class={styles.selectTemplate}>
        <div class={styles.headerAside}>
          <Popover
            is-show={isModelListShow.value}
            theme="light"
            disable-outside-click
            trigger="manual"
            placement="bottom-start"
            height={528}
            width={1120}
            arrow={false}
          >
            {{
              default: () => (
                <div
                  class={styles.activeSelect}
                  onClick={handleShowOrHiddenModelList}
                  v-bk-loading={{ loading: projectModelLoading.value, size: 'small' }}
                >
                  <span class={styles.activeImage}>
                    {templateInfoData.value.activeTemplate?.logoUrl ? (
                      <img
                        src={templateInfoData.value.activeTemplate.logoUrl}
                        width={32}
                        height={32}
                      />
                    ) : (
                      <SvgIcon name="placeholder" size={32} />
                    )}
                  </span>
                  <div class={styles.activeLabel}>
                    <p>{templateInfoData.value.activeTemplate?.name}</p>
                    {templateInfoData.value.activeTemplate?.templateType === 'PUBLIC' ? (
                      <p class={styles.activeDesc}>{t('flow.content.orchestrateFromScratch')}</p>
                    ) : (
                      <p class={styles.activeDesc}>
                        {templateInfoData.value.activeTemplate?.desc || '--'}
                      </p>
                    )}
                  </div>
                  <span class={styles.selectIcon}>
                    <SvgIcon name={isModelListShow.value ? 'arrow-up' : 'arrow-down'} size={12} />
                  </span>
                </div>
              ),
              content: () => {
                return (
                  <Tab
                    v-model:active={active.value}
                    type="unborder-card"
                    onChange={handleTabChange}
                  >
                    {panels.value.map((item) => (
                      <Tab.TabPanel name={item.name} label={item.label} key={item.name}>
                        <Loading
                          loading={
                            item.name === 'projectModel'
                              ? projectModelLoading.value
                              : storeModelLoading.value
                          }
                          size="small"
                        >
                          {item.name === 'projectModel'
                            ? renderProjectModelList()
                            : renderStoreModelList()}
                        </Loading>
                      </Tab.TabPanel>
                    ))}
                  </Tab>
                )
              },
            }}
          </Popover>
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
