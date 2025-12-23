import { getFlowVersionList } from '@/api/flowInfo'
import { CommonHeader } from '@/components/CommonHeader'
import { SvgIcon } from '@/components/SvgIcon'
import type { FlowInfo, FlowVersion } from '@/types/flow'
import { Button, Select, Tag } from 'bkui-vue'
import { computed, defineComponent, onMounted, ref, watch, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import styles from './PreviewHeader.module.css'

const { Option } = Select

// ============================================
// 1. Type Definitions
// ============================================

interface PreviewHeaderProps {
  executing: boolean
  flowInfo: FlowInfo | null
  pipelineModel: { name?: string } | null
}

// ============================================
// 2. Pure Utility Functions
// ============================================

/**
 * Find latest version from version list (pure function)
 */
const findLatestVersion = (versions: FlowVersion[]): FlowVersion | undefined => {
  return versions.find(v => v.isLatest)
}

/**
 * Get flow name from model or info (pure function)
 */
const getFlowName = (
  pipelineModel: { name?: string } | null,
  flowInfo: FlowInfo | null
): string => {
  return pipelineModel?.name || flowInfo?.pipelineName || ''
}

/**
 * Check if user can execute (pure function)
 */
const checkCanExecute = (flowInfo: FlowInfo | null): boolean => {
  return flowInfo?.permissions?.canExecute ?? true
}

// ============================================
// 3. Component Definition
// ============================================

export default defineComponent({
  name: 'PreviewHeader',
  props: {
    executing: {
      type: Boolean,
      default: false,
    },
    flowInfo: {
      type: Object as PropType<FlowInfo | null>,
      default: null,
    },
    pipelineModel: {
      type: Object as PropType<{ name?: string } | null>,
      default: null,
    },
  },
  emits: ['execute', 'versionChange'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()

    // ----------------------------------------
    // Local State
    // ----------------------------------------
    const versionList = ref<FlowVersion[]>([])
    const selectedVersion = ref<number | undefined>(undefined)
    const loadingVersions = ref(false)

    // ----------------------------------------
    // Route Params (Computed)
    // ----------------------------------------
    const projectId = computed(() => route.params.projectId as string)
    const flowId = computed(() => route.params.flowId as string)
    const routeVersion = computed(() => {
      const v = route.params.version
      return v ? Number(v) : undefined
    })

    // ----------------------------------------
    // Computed (Derived from Props)
    // ----------------------------------------
    const isDebugMode = computed(() =>
      Object.prototype.hasOwnProperty.call(route.query, 'debug')
    )

    const flowName = computed(() => getFlowName(props.pipelineModel, props.flowInfo))

    const canExecute = computed(() => checkCanExecute(props.flowInfo))

    const currentVersionOption = computed(() =>
      versionList.value.find(v => v.version === selectedVersion.value)
    )

    // ----------------------------------------
    // Actions
    // ----------------------------------------
    
    /**
     * Fetch version list from API
     */
    const fetchVersionList = async (): Promise<void> => {
      if (!projectId.value || !flowId.value) return

      try {
        loadingVersions.value = true
        const list = await getFlowVersionList({
          projectId: projectId.value,
          flowId: flowId.value,
        })

        // Update state immutably
        versionList.value = list || []

        // Set selected version from route or latest
        if (routeVersion.value) {
          selectedVersion.value = routeVersion.value
        } else {
          const latestVersion = findLatestVersion(list || [])
          selectedVersion.value = latestVersion?.version ?? list?.[0]?.version
        }
      } catch (error) {
        console.error('Failed to fetch version list:', error)
        versionList.value = []
      } finally {
        loadingVersions.value = false
      }
    }

    const handleExecute = (): void => {
      emit('execute')
    }

    const handleCancel = (): void => {
      router.back()
    }

    const handleVersionChange = (version: number): void => {
      selectedVersion.value = version
      emit('versionChange', version)
    }

    // ----------------------------------------
    // Render Functions (Pure View Logic)
    // ----------------------------------------
    
    const renderTag = () => (
      <Tag theme="success" size="small" class={styles.tag}>
        {t('flow.content.latest')}
      </Tag>
    )

    const renderCheckIcon = (isLatest = false) => (
      <SvgIcon
        name="check-circle"
        class={[styles.checkIcon, isLatest && styles.latestCheckIcon]}
      />
    )

    const renderVersionSelector = () => {
      const currentVersion = currentVersionOption.value

      return (
        <div class={styles.versionSelectorWrapper}>
          <span class={styles.versionLabel}>{t('flow.preview.flowVersion')}</span>
          <Select
            modelValue={selectedVersion.value}
            onChange={handleVersionChange}
            class={styles.versionSelector}
            clearable={false}
            loading={loadingVersions.value}
          >
            {{
              trigger: () => (
                <span class={styles.versionTrigger}>
                  {renderCheckIcon(currentVersion?.isLatest)}
                  <span class={styles.versionText}>{currentVersion?.versionName}</span>
                  {currentVersion?.isLatest && renderTag()}
                  <SvgIcon name="angle-down" class={styles.versionSelectToggleIcon} />
                </span>
              ),
              default: () =>
                versionList.value.map(version => (
                  <Option key={version.version} value={version.version} label={version.versionName}>
                    <div class={styles.versionOption}>
                      {renderCheckIcon(version.isLatest)}
                      <span>{version.versionName}</span>
                      {version.isLatest && renderTag()}
                    </div>
                  </Option>
                )),
            }}
          </Select>
        </div>
      )
    }

    const renderExecutionTitle = () => (
      <span class={styles.executionTitle}>
        {t(isDebugMode.value ? 'flow.preview.debug' : 'flow.preview.execute')}
      </span>
    )

    const renderActions = () => (
      <>
        {/* Cancel button */}
        <Button disabled={props.executing} onClick={handleCancel}>
          {t('flow.common.cancel')}
        </Button>

        {/* Execute/Debug button */}
        <Button
          theme="primary"
          disabled={props.executing || !canExecute.value}
          loading={props.executing}
          onClick={handleExecute}
        >
          {t(isDebugMode.value ? 'flow.preview.debug' : 'flow.preview.execute')}
        </Button>
      </>
    )

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    watch([projectId, flowId], () => {
      fetchVersionList()
    })

    onMounted(() => {
      fetchVersionList()
    })

    // ----------------------------------------
    // Main Render
    // ----------------------------------------
    return () => {
      // Early return for loading state
      if (!flowName.value) {
        return (
          <header class={styles.previewHeader}>
            <i class={[styles.spinIcon, 'bk-icon', 'icon-loading']} />
          </header>
        )
      }

      return (
        <CommonHeader workflowName={flowName.value}>
          {{
            'version-selector': renderVersionSelector,
            'execution-detail': renderExecutionTitle,
            actions: renderActions,
          }}
        </CommonHeader>
      )
    }
  },
})
