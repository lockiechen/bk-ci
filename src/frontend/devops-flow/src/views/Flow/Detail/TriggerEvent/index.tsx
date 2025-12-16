import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Loading } from 'bkui-vue'
import { useModeStore } from '@/stores/flowMode'
import ModeSwitch from '@/components/ModeSwitch'
import EmptyPage from '@/components/EmptyPage/index'
import CodeEditor from '@/components/CodeEditor'
import TriggerEventContent from './TriggerEventContent'
import { useFlowConfigCode } from '@/hooks/useFlowConfigCode'
import { useFlowModel } from '@/hooks/useFlowModel'
import type { Element } from '@/api/flowModel'
import layoutStyles from '@/styles/layout.module.css'

interface TriggerEvent {
  name: string
  icon: string
  version: string
  enabled: boolean
  type: string
}

export default defineComponent({
  name: 'TriggerEvent',
  components: {
    ModeSwitch,
    EmptyPage,
    CodeEditor,
    Loading,
    TriggerEventContent,
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const route = useRoute()
    const modeStore = useModeStore()
    const flowId = route.params.flowId as string

    // Use flow model hook to get trigger events
    const { triggerEvents: triggerElements } = useFlowModel({ flowId, autoLoad: true })

    // Use flow config code hook for Code mode
    const { loading, yamlContent, sectionHighlight, isEmpty } = useFlowConfigCode({
      flowId,
      section: 'trigger-event',
      autoLoad: true,
    })

    // 将 Element[] 转换为 TriggerEvent[] 格式
    const triggerEvents = computed<TriggerEvent[]>(() => {
      return triggerElements.value.map((element: Element) => {
        // 获取启用状态
        const enabled = element.additionalOptions?.enable ?? true

        // 根据 atomCode 确定图标和类型
        const getIconAndType = (atomCode?: string) => {
          if (!atomCode) return { icon: '', type: '' }

          // 手动触发
          if (atomCode === 'manualTrigger' || atomCode.includes('manual')) {
            return { icon: 'play-circle', type: 'manual' }
          }

          // 云桌面关机
          if (atomCode.includes('cloud-desktop') || atomCode.includes('desktop')) {
            return { icon: 'desktop', type: 'cloud-desktop-shutdown' }
          }

          // 默认
          return { icon: 'trigger', type: atomCode }
        }

        const { icon, type } = getIconAndType(element.atomCode)

        return {
          name: element.name || element.atomCode || t('flow.content.unknownTrigger'),
          icon,
          version: element.version || '1 latest',
          enabled,
          type,
        }
      })
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
                <TriggerEventContent triggerEvents={triggerEvents.value} />
              )}
            </>
          )}
        </div>
      </div>
    )
  },
})
