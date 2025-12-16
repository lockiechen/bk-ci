import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Loading } from 'bkui-vue'
import { useModeStore } from '@/stores/flowMode'
import { useFlowModel } from '@/hooks/useFlowModel'
import ModeSwitch from '@/components/ModeSwitch'
import EmptyPage from '@/components/EmptyPage/index'
import CodeEditor from '@/components/CodeEditor'
import styles from './FlowModel.module.css'
import layoutStyles from '@/styles/layout.module.css'

import BkPipeline from 'bkui-pipeline/vue3'
import 'bkui-pipeline/dist/bkui-pipeline.css'

export default defineComponent({
  name: 'FlowModel',
  components: {
    ModeSwitch,
    EmptyPage,
    BkPipeline,
    CodeEditor,
    Loading,
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const route = useRoute()
    const modeStore = useModeStore()

    // 使用 useFlowModel hook 管理数据
    const { flowModel, flowModelWithoutTriggerStage, yamlContent, loading, isFlowEmpty } =
      useFlowModel({
        flowId: route.params.flowId as string, // TODO: 从路由参数获取实际的 flowId
        autoLoad: true,
      })

    return () => (
      <div class={styles.flowModel}>
        <ModeSwitch></ModeSwitch>

        <div class={layoutStyles.flexDetailContent}>
          {loading.value ? (
            <div class={layoutStyles.loadingWrapper}>
              <Loading loading size="small" mode="spin" theme="primary" />
            </div>
          ) : (
            <>
              {modeStore.isCodeMode ? (
                <div class={styles.codeEditorWrapper}>
                  <CodeEditor
                    modelValue={yamlContent.value}
                    readOnly={true}
                    height="100%"
                    codeLensTitle={t('flow.content.editStep')}
                  />
                </div>
              ) : (
                <div class={styles.uiModeWrapper}>
                  {!isFlowEmpty.value && flowModelWithoutTriggerStage.value ? (
                    <BkPipeline editable={false} pipeline={flowModelWithoutTriggerStage.value} />
                  ) : (
                    <EmptyPage
                      title={t('flow.content.blankTemplateNoOrchestration')}
                      desc={t('flow.content.createToAddFirstStage')}
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
