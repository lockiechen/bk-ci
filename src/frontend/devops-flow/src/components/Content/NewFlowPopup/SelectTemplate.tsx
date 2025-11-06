import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Radio, Checkbox, Message } from 'bkui-vue';
import { SvgIcon } from "@/components/SvgIcon";
import {
  FlowModel,
  AuthoringEnv,
  TriggerTab,
  NoticeTab,
  SettingTab,
} from "@/components/FlowConfig";
import styles from "./Index.module.css";

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
      type: Boolean
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const router = useRouter();
    const activeTemplate = ref({
      "name": "空白模板",
      "logoUrl": "",
      "desc": ""
    });
    const isTemplatPopup = ref(false);
    const templateList = ref([]);
    const currentModel = ref('freedomMode');
    const cloneTemplateSet = ref([]);
    const activeMenuItem = ref('flowModel');
    const configList = computed(() => [
      {
        title: t('flow.flowModel'),
        name: 'flowModel'
      },
      {
        title: t('flow.authoringEnv'),
        name: 'authoringEnv'
      },
      {
        title: t('flow.trigger'),
        name: 'trigger'
      },
      {
        title: t('flow.noticeSetting'),
        name: 'notice'
      },
      {
        title: t('flow.baseSetting'),
        name: 'setting'
      }
    ].map((child) => ({
      ...child,
      disableTooltip: {
        disabled: true
      },
      active: activeMenuItem.value === child.name
    })));

    const configComponentMap: Record<string, any> = {
      flowModel: FlowModel,
      authoringEnv: AuthoringEnv,
      trigger: TriggerTab,
      notice: NoticeTab,
      setting: SettingTab
    }
    
    function renderDynamicComponent() {
      const TargetComponent = configComponentMap[activeMenuItem.value]
      return TargetComponent ? <TargetComponent /> : null
    }

    function changeConfig(name: string) {
      activeMenuItem.value = name;
    }

    return () => (
      <div class={styles.selectTemplate}>
        <div class={styles.headerAside}>
          <div
            class={styles.activeSelect}
          >
            <span class={styles.activeImage}>
              {
                activeTemplate.value.logoUrl ? (
                  <img
                    src={activeTemplate.value.logoUrl}
                    width={32}
                    height={32}
                  />
                ) : (
                  <SvgIcon
                    name='placeholder'
                    size={32}
                  />
                )
              }
            </span>
            <div class={styles.activeLabel}>
              <p>{activeTemplate.value.name}</p>
              {
                activeTemplate.value.name === '空白模板' ? (
                  <p class={styles.activeDesc}>{t('flow.content.orchestrateFromScratch')}</p>
                ) : <p class={styles.activeDesc}>{activeTemplate.value.desc || '--'}</p>
              }
            </div>
            <span class={styles.selectIcon}>
              <SvgIcon
                name={isTemplatPopup.value ? 'arrow-up' : 'arrow-down'}
                size={12}
              />
            </span>
          </div>
          <div class={styles.settingAside}>
            <div class={styles.modelSelect}>
              <p class={styles.settingLabel}>{t('flow.content.mode')}</p>
              <Radio.Group
                v-model={currentModel.value}
                size="small"
              >
                <Radio label='freedomMode'>{t('flow.content.freeMode')}</Radio>
                <Radio label='constraintMode' disabled={true}>{t('flow.content.constraintMode')}</Radio>
              </Radio.Group>
            </div>
            <div class={styles.cloneTemplateSet}>
              <p class={styles.settingLabel}>{t('flow.content.cloneTemplateSettings')}</p>
              <Checkbox.Group
                v-model={cloneTemplateSet.value}
                disabled={true}
              >
                <Checkbox label='freedomMode' size="small">{t('flow.content.notificationSettings')}</Checkbox>
                <Checkbox label='constraintMode' size="small">{t('flow.content.concurrencyPolicy')}</Checkbox>
                <Checkbox label='constraintMode' size="small">{t('flow.content.tag')}</Checkbox>
              </Checkbox.Group>
            </div>
          </div>
        </div>
        <div class={styles.contentConfig}>
          <ul class={styles.configAside}>
            {
              configList.value.map(item => (
                <li
                  onClick={() => changeConfig(item.name)}
                  class={`${styles.configItem} ${activeMenuItem.value === item.name ? styles.configActive : ''}`}
                >
                  {item.title}
                </li>
              ))
            }
          </ul>
          <div class={styles.configContent}>
            {renderDynamicComponent()}
          </div>
        </div>
      </div>
    );
  },
});