import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Loading } from 'bkui-vue'
import { useModeStore } from '@/stores/flowMode.ts'
import ModeSwitch from '@/components/ModeSwitch'
import EmptyPage from '@/components/EmptyPage/index'
import CodeEditor from '@/components/CodeEditor'
import AuthoringContent from './AuthoringContent.tsx'
import { useAuthoringEnv } from '@/hooks/useAuthoringEnv'
import { useFlowConfigCode } from '@/hooks/useFlowConfigCode'
import styles from './AuthoringEnv.module.css'
import layoutStyles from '@/styles/layout.module.css'

export default defineComponent({
  name: 'AuthoringEnv',
  components: {
    ModeSwitch,
    AuthoringContent,
    EmptyPage,
    CodeEditor,
    Loading,
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const route = useRoute()
    const modeStore = useModeStore()

    // Use authoring environment hook for UI mode
    const { authoringEnv } = useAuthoringEnv({
      flowId: route.params.flowId as string,
      autoLoad: true,
    })

    // Use flow config code hook for Code mode
    const {
      loading,
      yamlContent,
      sectionHighlight,
      isEmpty,
    } = useFlowConfigCode({
      flowId: route.params.flowId as string,
      section: 'authoring-env',
      autoLoad: true,
    })

    return () => (
      <div class={layoutStyles.detailContainer}>
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
                      height="calc(100vh - 160px)"
                      highlightRanges={sectionHighlight.value}
                    />
                  ) : (
                    <EmptyPage
                      title={t('flow.content.noEnvironmentConfigured')}
                      desc={t('flow.content.pleaseConfigureEnvironmentFirst')}
                    />
                  )}
                </div>
              ) : (
                <div>
                  {!isEmpty.value ? (
                    <AuthoringContent
                      modelValue={authoringEnv.value?.id || ''}
                      envList={[
                        {
                          value: authoringEnv.value?.id || '',
                          label: authoringEnv.value?.name || '',
                        }
                      ]}
                    />
                  ) : (
                    <EmptyPage
                      title={t('flow.content.noEnvironmentConfigured')}
                      desc={t('flow.content.pleaseConfigureEnvironmentFirst')}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  },
})
