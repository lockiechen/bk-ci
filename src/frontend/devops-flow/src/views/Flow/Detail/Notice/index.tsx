import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { Loading } from 'bkui-vue';
import { useModeStore } from "@/stores/flowMode";
import ModeSwitch from '@/components/ModeSwitch';
import EmptyPage from '@/components/EmptyPage/index';
import CodeEditor from '@/components/CodeEditor';
import NoticeContent from './NoticeContent';
import { useFlowConfigCode } from '@/hooks/useFlowConfigCode';
import styles from './NoticeTab.module.css';
import layoutStyles from '@/styles/layout.module.css';

export default defineComponent({
  name: 'NoticeTab',
  components: {
    ModeSwitch,
    NoticeContent,
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
      section: 'notice',
      autoLoad: true,
    });

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
                <div>
                  {
                    true ? <NoticeContent /> : <EmptyPage />
                  }
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
});
