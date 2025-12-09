import { defineComponent, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Button, Message } from 'bkui-vue'
import { ROUTE_NAMES } from '@/constants/routes'
import { useFlowModel } from '@/hooks/useFlowModel'
import styles from './EditHeader.module.css'
import { CommonHeader } from '../CommonHeader'

export const EditHeader = defineComponent({
  name: 'EditHeader',
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const flowId = route.params.flowId as string
    const projectId = (route.params.projectId as string) || (route.query.projectId as string)

    const flowModel = useFlowModel({ flowId })
    const isSaving = ref(false)

    const workflowName = computed(() => {
      return flowModel.flowModel.value?.name || '--'
    })

    const handleCancel = () => {
      router.push({
        name: ROUTE_NAMES.FLOW_DETAIL_EXECUTION_RECORD,
        params: { flowId },
      })
    }

    const handleSave = async () => {
      if (!projectId) {
        Message({
          theme: 'error',
          message: t('flow.content.projectIdRequired'),
        })
        return
      }

      if (!flowModel.flowModel.value) {
        Message({
          theme: 'error',
          message: t('flow.content.noFlowModel'),
        })
        return
      }

      isSaving.value = true

      try {
        await flowModel.saveFlow({
          projectId,
          flowId,
          storageType: 'MODEL',
        })

        Message({
          theme: 'success',
          message: t('flow.content.saveSuccess'),
        })
      } catch (error: any) {
        console.error('Failed to save flow:', error)
        Message({
          theme: 'error',
          message: error?.message || t('flow.content.saveFailed'),
        })
      } finally {
        isSaving.value = false
      }
    }

    const handleDebug = () => {
      // TODO: Implement debug logic
      console.log('Debug flow')
    }

    const handlePublish = () => {
      // TODO: Implement publish logic
      console.log('Publish flow')
    }

    return () => (
      <CommonHeader workflowName={workflowName.value} onWorkflowNameClick={handleCancel}>
        {{
          default: () => (
            <div class={styles.editHeader}>
              <div class={styles.headerLeft}>
                <span class={styles.flowName}>
                  {t('flow.content.edit')} - {flowId}
                </span>
              </div>
            </div>
          ),
          actions: () => (
            <div class={styles.headerRight}>
              <Button onClick={handleCancel} disabled={isSaving.value}>
                {t('flow.common.cancel')}
              </Button>
              <Button
                outline
                theme="primary"
                onClick={handleSave}
                loading={isSaving.value}
                disabled={isSaving.value || !flowModel.hasUnsavedChanges.value}
              >
                {t('flow.content.save')}
              </Button>
              <Button onClick={handleDebug} disabled={isSaving.value}>
                {t('flow.content.debug')}
              </Button>
              <Button theme="primary" onClick={handlePublish} disabled={isSaving.value}>
                {t('flow.content.publish')}
              </Button>
            </div>
          ),
        }}
      </CommonHeader>
    )
  },
})
