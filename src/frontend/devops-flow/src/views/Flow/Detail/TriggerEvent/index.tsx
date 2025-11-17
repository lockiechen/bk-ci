import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { Loading } from 'bkui-vue';
import { useModeStore } from '@/stores/flowMode';
import ModeSwitch from '@/components/ModeSwitch';
import EmptyPage from '@/components/EmptyPage/index';
import CodeEditor from '@/components/CodeEditor';
import { useFlowConfigCode } from '@/hooks/useFlowConfigCode';
import styles from "./TriggerEvent.module.css";
import layoutStyles from '@/styles/layout.module.css';

export default defineComponent({
  name: 'TriggerEvent',
  components: {
    ModeSwitch,
    EmptyPage,
    CodeEditor,
    Loading,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const route = useRoute();
    const modeStore = useModeStore();

    // Use flow config code hook for Code mode
    const {
      loading,
      yamlContent,
      sectionHighlight,
      isEmpty,
    } = useFlowConfigCode({
      flowId: route.params.flowId as string,
      section: 'trigger-event',
      autoLoad: true,
    });

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
                      title={t('flow.content.noConfigurationFound')}
                      desc={t('flow.content.pleaseConfigureFirst')}
                    />
                  )}
                </div>
              ) : (
                <div class={styles.uiContent}>
                  <h3>触发事件</h3>
                  <p>TriggerEvent组件内容</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  },
});
