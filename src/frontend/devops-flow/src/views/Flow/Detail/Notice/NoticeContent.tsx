import { defineComponent, ref, computed, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { Collapse } from 'bkui-vue'
import type { FlowSettings, Subscription } from '@/api/flowModel'
import styles from './NoticeTab.module.css'

export default defineComponent({
  name: 'NoticeContent',
  props: {
    flowSetting: {
      type: Object as PropType<FlowSettings>,
      default: null,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const activeIndex = ref([1]) // 默认展开第二个（运行失败时）

    // 通知类型映射
    const notifyTypeMap: Record<string, string> = {
      EMAIL: t('flow.content.emailNotice'),
      WEWORK: t('flow.content.weworkNotice'),
      RTX: t('flow.content.rtxNotice'),
      WEWORK_GROUP: t('flow.content.weworkGroup'),
      VOICE: t('flow.content.voiceNotice'),
      WECHAT: t('flow.content.wechatNotice'),
      SMS: t('flow.content.smsNotice'),
    }

    // 格式化通知类型显示
    const formatNotificationTypes = (types: string[]): string => {
      if (!types || types.length === 0) return '--'
      return types.map((type) => notifyTypeMap[type] || type).join(', ')
    }

    // 格式化用户显示
    const formatUsers = (users: string): string => {
      if (!users || users.trim() === '') return '--'
      return users
    }

    // 格式化通知组显示
    const formatGroups = (groups: string[]): string => {
      if (!groups || groups.length === 0) return '--'
      return groups.join(', ')
    }

    // 格式化通知内容显示
    const formatContent = (content: string): string => {
      if (!content || content.trim() === '') return '--'
      return content
    }

    // 获取通知列表数据
    const successList = computed(() => props.flowSetting?.successSubscriptionList || [])
    const failList = computed(() => props.flowSetting?.failSubscriptionList || [])
    // 注意：flowSetting 中可能没有 cancelSubscriptionList 和 publishSubscriptionList
    // 暂时使用空数组，如果后续有这些字段可以更新
    const cancelList = computed(() => [])
    const publishList = computed(() => [])

    // Collapse 列表数据
    const collapseList = computed(() => [
      {
        name: `${t('flow.content.runSuccess')} (${successList.value.length})`,
        subscriptions: successList.value,
      },
      {
        name: `${t('flow.content.runFailed')} (${failList.value.length})`,
        subscriptions: failList.value,
      },
      {
        name: `${t('flow.content.runCanceled')} (${cancelList.value.length})`,
        subscriptions: cancelList.value,
      },
      {
        name: `${t('flow.content.newVersionPublished')} (${publishList.value.length})`,
        subscriptions: publishList.value,
      },
    ])

    return () => (
      <div>
        <Collapse
          v-model={activeIndex.value}
          list={collapseList.value}
          header-icon="right-shape"
          class={styles.collapse}
        >
          {{
            content: (item: { subscriptions: Subscription[] }) => {
              if (item.subscriptions.length === 0) {
                return null
              }

              // 只显示第一个通知的详细信息（根据设计图）
              const subscription = item.subscriptions[0]

              return (
                <div class={styles.collapseContent}>
                  <div class={styles.infoRow}>
                    <label class={styles.label}>{t('flow.content.noticeType')}:</label>
                    <span class={styles.value}>
                      {formatNotificationTypes(subscription?.types || [])}
                    </span>
                  </div>
                  <div class={styles.infoRow}>
                    <label class={styles.label}>{t('flow.content.noticeGroup')}:</label>
                    <span class={styles.value}>{formatGroups(subscription?.groups || [])}</span>
                  </div>
                  <div class={styles.infoRow}>
                    <label class={styles.label}>{t('flow.content.noticeUser')}:</label>
                    <span class={styles.value}>{formatUsers(subscription?.users || '')}</span>
                  </div>
                  <div class={styles.infoRow}>
                    <label class={styles.label}>{t('flow.content.noticeContent')}:</label>
                    <span class={styles.value}>{formatContent(subscription?.content || '')}</span>
                  </div>
                </div>
              )
            },
          }}
        </Collapse>
      </div>
    )
  },
})
