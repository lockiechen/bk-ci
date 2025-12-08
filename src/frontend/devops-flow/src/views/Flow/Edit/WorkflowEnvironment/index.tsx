import { defineComponent, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Select, Tag, Button } from 'bkui-vue'
import { SvgIcon } from '@/components/SvgIcon'
import { useFlowModel } from '@/hooks/useFlowModel'
import sharedStyles from '../shared.module.css'
import styles from './WorkflowEnvironment.module.css'

const { Option } = Select

export default defineComponent({
  name: 'EditWorkflowEnvironment',
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const flowId = route.params.flowId as string
    const flowModel = useFlowModel({ flowId })

    // 创作环境选择
    const selectedEnvId = ref('env-001')
    const envList = ref([
      { id: 'env-001', name: t('flow.content.myAuthoringEnv') },
    ])

    // 创作节点列表（从flowModel中提取或使用mock数据）
    const creationNodes = computed(() => {
      // TODO: 从flowModel中提取创作节点信息
      return [
        { id: 'ins-be4830935d0ed3db', name: 'ins-be4830935d0ed3db' },
        { id: 'ins-be4830935d0ed3db', name: 'ins-be4830935d0ed3db' },
        { id: 'ins-be4830935d0ed3db', name: 'ins-be4830935d0ed3db' },
      ]
    })

    // 工作空间路径
    const workspace = computed(() => {
      return t('flow.content.workSpaceDesc')
    })

    // 跳转到创作环境管理
    const handleGoEnvironmentManagement = () => {
      // TODO: 跳转到创作环境管理页面
      console.log('Go to environment management')
    }

    // 跳转到节点设置
    const handleGoNodeSettings = () => {
      // TODO: 跳转到节点设置页面
      console.log('Go to node settings')
    }

    return () => (
      <div class={sharedStyles.tabContainer}>
        <div class={styles.workflowEnvironment}>
          {/* 我的创作环境选择 */}
          <div class={styles.envSelector}>
            <Select
              v-model={selectedEnvId.value}
              clearable={false}
              class={styles.envSelect}
            >
              {envList.value.map((env) => (
                <Option key={env.id} value={env.id} label={env.name} />
              ))}
            </Select>
          </div>

          {/* 创作节点 */}
          <div class={styles.section}>
            <div class={styles.sectionHeader}>
              <span class={styles.sectionTitle}>{t('flow.content.creationNode')}</span>
              <span class={styles.settingsIcon} onClick={handleGoNodeSettings}>
                <SvgIcon name="set-line" size={16} />
              </span>
            </div>
            <div class={styles.nodeList}>
              {creationNodes.value.map((node, index) => (
                <Tag key={index} class={styles.nodeTag}>
                  {node.name}
                </Tag>
              ))}
            </div>
          </div>

          {/* 工作空间 */}
          <div class={styles.section}>
            <div class={styles.sectionHeader}>
              <span class={styles.sectionTitle}>{t('flow.content.workspace')}</span>
            </div>
            <div class={styles.workspaceContent}>{workspace.value}</div>
          </div>

          {/* 创作环境管理链接 */}
          <div class={styles.envManagementLink}>
            <Button text theme="primary" onClick={handleGoEnvironmentManagement}>
              {t('flow.content.environmentManagement')}
              <SvgIcon name="tiaozhuan" size={14} class={styles.linkIcon} />
            </Button>
          </div>
        </div>
      </div>
    )
  },
})
