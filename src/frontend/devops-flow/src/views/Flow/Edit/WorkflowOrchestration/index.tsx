import { computed, defineComponent, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Exception } from 'bkui-vue'
import sharedStyles from '../shared.module.css'
import styles from './index.module.css'
import BkPipeline from 'bkui-pipeline/vue3'
import 'bkui-pipeline/dist/bkui-pipeline.css'
import { useFlowModel } from '@/hooks/useFlowModel'
import { useUIStore } from '@/stores/ui'
import { SvgIcon } from '@/components/SvgIcon'
import StagePropertyPanel from '@/components/WorkflowOrchestration/StagePropertyPanel'
import JobPropertyPanel from '@/components/WorkflowOrchestration/JobPropertyPanel'
import AtomPropertyPanel from '@/components/WorkflowOrchestration/AtomPropertyPanel'
import AtomSelector from '@/components/WorkflowOrchestration/AtomSelector'
import type { FlowModel } from '@/api/flowModel'

export default defineComponent({
  name: 'EditWorkflowOrchestration',
  setup() {
    // ========== Hooks ==========
    const { t } = useI18n()
    const route = useRoute()
    const flowId = route.params.flowId as string
    const flowModel = useFlowModel({
      flowId,
    })
    const uiStore = useUIStore()

    // ========== Refs ==========
    const isStagePanelVisible = ref(false)
    const isJobPanelVisible = ref(false)
    const isAtomPanelVisible = ref(false)
    const isAtomSelectorVisible = ref(false)

    // ========== Computed ==========
    // (暂无 computed)

    // ========== Lifecycle Hooks ==========
    watch(
      () => flowModel.isEditingStage.value,
      (val) => {
        if (val) isStagePanelVisible.value = true
      },
    )

    watch(
      () => flowModel.isEditingJob.value,
      (val) => {
        if (val) isJobPanelVisible.value = true
      },
    )

    watch(
      () => flowModel.isEditingPlugin.value,
      (val) => {
        if (val) {
          isAtomPanelVisible.value = true
          if (!flowModel.editingElement.value?.atomCode) {
            handleChooseAtom()
          }
        }
      },
    )

    watch(isStagePanelVisible, (val) => {
      if (!val && flowModel.isEditingStage.value) {
        flowModel.handleClosePanel()
      }
    })

    watch(isJobPanelVisible, (val) => {
      if (!val && flowModel.isEditingJob.value) {
        flowModel.handleClosePanel()
      }
    })

    watch(isAtomPanelVisible, (val) => {
      if (!val && flowModel.isEditingPlugin.value) {
        flowModel.handleClosePanel()
      }
    })

    watch(
      () => [
        isStagePanelVisible.value,
        isJobPanelVisible.value,
        isAtomPanelVisible.value,
        isAtomSelectorVisible.value,
      ],
      ([isStageOpen, isJobOpen, isAtomOpen, isAtomSelectorOpen]) => {
        // 如果任何一个侧边栏打开，则自动收起变量面板
        if (isStageOpen || isJobOpen || isAtomOpen || isAtomSelectorOpen) {
          if (uiStore.isVariablePanelOpen) {
            uiStore.setVariablePanelOpen(false)
          }
        }
      },
    )

    // ========== Functions ==========
    function renderEmptyState() {
      return (
        <div class={styles.emptyFlowStage} onClick={flowModel.handleAddFirstStage}>
          <SvgIcon name="add-small" />
          <span>{t('flow.orchestration.clickToAddStage')}</span>
        </div>
      )
    }

    function handleChooseAtom() {
      isAtomSelectorVisible.value = true
    }

    return () => (
      <div class={[sharedStyles.tabContainer, styles.workflowOrchestration]}>
        {flowModel.hasFlowStages.value ? (
          <BkPipeline
            pipeline={flowModel.flowModelWithoutTriggerStage.value!}
            onAppendJob={flowModel.handleAddJob}
            onAddAtom={flowModel.handleAddAtom}
            onClick={flowModel.handleFlowClick}
            onAddStage={flowModel.handleAddStage}
          />
        ) : flowModel.flowModelWithoutTriggerStage.value ? (
          renderEmptyState()
        ) : (
          <Exception type="empty" scene="part">
            {t('flow.orchestration.noFlowStageTips')}
          </Exception>
        )}

        {/* Stage property panel */}
        <StagePropertyPanel
          v-model={isStagePanelVisible.value}
          stage={flowModel.editingStage.value}
          editable={true}
          isNew={flowModel.isNewStage.value}
          onChange={flowModel.handleStageChange}
          onConfirm={flowModel.handleStageConfirm}
        />

        {/* Job property panel */}
        <JobPropertyPanel
          v-model={isJobPanelVisible.value}
          editable={true}
          editingContainer={flowModel.editingContainer.value}
          isNew={flowModel.isNewJob.value}
          onChange={flowModel.handleJobChange}
          onConfirm={flowModel.handleJobConfirm}
        />

        {/* Atom property panel */}
        <AtomPropertyPanel
          v-model:visible={isAtomPanelVisible.value}
          currentElement={flowModel.editingElement.value!}
          onChooseAtom={handleChooseAtom}
          onUpdateAtom={flowModel.updateAtom}
        />

        {/* Atom selector */}
        <AtomSelector
          v-model:visible={isAtomSelectorVisible.value}
          onSelect={flowModel.handleAtomSelect}
        />
      </div>
    )
  },
})
