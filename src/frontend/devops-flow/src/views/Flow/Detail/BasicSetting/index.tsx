import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Loading } from 'bkui-vue'
import { useModeStore } from '@/stores/flowMode'
import ModeSwitch from '@/components/ModeSwitch'
import EmptyPage from '@/components/EmptyPage/index'
import CodeEditor from '@/components/CodeEditor'
import SettingContent from './SettingContent'
import { useFlowConfigCode } from '@/hooks/useFlowConfigCode'
import { useFlowModel } from '@/hooks/useFlowModel'
import styles from './SettingTab.module.css'
import layoutStyles from '@/styles/layout.module.css'

export default defineComponent({
  name: 'SettingTab',
  components: {
    ModeSwitch,
    SettingContent,
    EmptyPage,
    CodeEditor,
    Loading,
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const route = useRoute()
    const modeStore = useModeStore()
    const flowId = route.params.flowId as string

    // Use flow config code hook for Code mode
    const { loading, yamlContent, sectionHighlight, isEmpty, flowSetting } = useFlowConfigCode({
      flowId,
      section: 'basic-setting',
      autoLoad: true,
    })

    // Get flowModel for group information
    const { flowModel } = useFlowModel({ flowId, autoLoad: true })

    // Combine flowSetting with group info from flowModel
    const basicSettingsWithGroup = computed(() => {
      if (!flowSetting.value) return null

      return {
        ...flowSetting.value,
        // Get group names from flowModel.staticViews
        groupNames: flowModel.value?.staticViews || [],
      }
    })

    return () => (
      <div class={layoutStyles.detailContainerWithRightPadding}>
        <ModeSwitch></ModeSwitch>

        <div class={layoutStyles.detailContent}>
          {loading.value ? (
            <div class={layoutStyles.loadingWrapper}>
              <Loading loading size="small" mode="spin" theme="primary" />
            </div>
          ) : (
            <>
              {modeStore.isCodeMode ? (
                <div class={layoutStyles.codeEditorWrapper}>
                  {!isEmpty.value ? (
                    <CodeEditor
                      modelValue={yamlContent.value}
                      readOnly={true}
                      height="calc(100% - 16px)"
                      highlightRanges={sectionHighlight.value}
                    />
                  ) : (
                    <EmptyPage
                      title={t('flow.content.noConfigurationFound')}
                      desc={t('flow.content.pleaseConfigureFirst')}
                    />
                  )}
                </div>
              ) : basicSettingsWithGroup.value ? (
                <SettingContent basicSettings={basicSettingsWithGroup.value} />
              ) : (
                <EmptyPage />
              )}
            </>
          )}
        </div>
      </div>
    )
  },
})
