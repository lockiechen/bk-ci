import { defineComponent, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Checkbox, Collapse, Button, Card, Message } from 'bkui-vue'
import { SvgIcon } from '@/components/SvgIcon'
import { useFlowModel } from '@/hooks/useFlowModel'
import sharedStyles from '../shared.module.css'
import styles from './NotificationConfig.module.css'

const { CollapsePanel } = Collapse

interface Notification {
  types: string[]
  groups: string[]
  users: string
  content: string
  wechatGroupFlag?: boolean
  wechatGroup?: string
}

interface NotifyItem {
  type: string
  name: string
  notifications: Notification[]
}

export default defineComponent({
  name: 'EditNotificationConfig',
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const flowId = route.params.flowId as string
    const flowModel = useFlowModel({ flowId })

    // 通知数据（从flowModel或setting中获取）
    const successSubscriptionList = ref<Notification[]>([])
    const failSubscriptionList = ref<Notification[]>([
      {
        types: ['EMAIL', 'WEWORK'],
        groups: [],
        users: '${{actor}}',
        content:
          '【${BK_CI_PROJECT_NAME_CN}】 - 【${BK_CI_FLOW_NAME}】 #${BK_CI_BUILD_NUM}执行成功,耗时${BK_CI_BUILD_TOTAL_TIME},触发人:${BK_CI_START_USER_NAME}.',
      },
      {
        types: ['EMAIL', 'WEWORK'],
        groups: [],
        users: '${{actor}}',
        content:
          '【${BK_CI_PROJECT_NAME_CN}】 - 【${BK_CI_FLOW_NAME}】 #${BK_CI_BUILD_NUM}执行成功,耗时${BK_CI_BUILD_TOTAL_TIME},触发人:${BK_CI_START_USER_NAME}.',
      },
    ])
    const cancelSubscriptionList = ref<Notification[]>([
      {
        types: ['EMAIL'],
        groups: [],
        users: '${{actor}}',
        content: '',
      },
    ])
    const publishSubscriptionList = ref<Notification[]>([])

    // 通知列表配置
    const notifyList = computed<NotifyItem[]>(() => [
      {
        type: 'successSubscriptionList',
        name: t('flow.content.runSuccess'),
        key: 'success',
        notifications: successSubscriptionList.value,
      },
      {
        type: 'failSubscriptionList',
        name: t('flow.content.runFailed'),
        key: 'fail',
        notifications: failSubscriptionList.value,
      },
      {
        type: 'cancelSubscriptionList',
        name: t('flow.content.runCanceled'),
        key: 'cancel',
        notifications: cancelSubscriptionList.value,
      },
      {
        type: 'publishSubscriptionList',
        name: t('flow.content.newVersionPublished'),
        key: 'publish',
        notifications: publishSubscriptionList.value,
      },
    ])

    // 获取通知列表
    const getNotificationList = (type: string): Notification[] => {
      switch (type) {
        case 'successSubscriptionList':
          return successSubscriptionList.value
        case 'failSubscriptionList':
          return failSubscriptionList.value
        case 'cancelSubscriptionList':
          return cancelSubscriptionList.value
        case 'publishSubscriptionList':
          return publishSubscriptionList.value
        default:
          return []
      }
    }

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
      return types.map((type) => notifyTypeMap[type] || type).join(', ')
    }

    // 添加通知
    const handleAddNotification = (type: string) => {
      // TODO: 打开通知配置侧边栏
      console.log('Add notification:', type)
    }

    // 编辑通知
    const handleEditNotification = (type: string, index: number) => {
      // TODO: 打开通知配置侧边栏
      console.log('Edit notification:', type, index)
    }

    // 删除通知
    const handleDeleteNotification = (type: string, index: number) => {
      const list = getNotificationList(type)
      list.splice(index, 1)
      Message({
        theme: 'success',
        message: t('flow.content.deleteSuccess'),
      })
    }

    return () => (
      <div class={sharedStyles.tabContainer}>
        <div class={styles.notificationConfig}>
          {/* 通知列表 */}
          <div class={styles.notifyList}>
            <Collapse useBlockTheme class={styles.notifyCard} list={notifyList.value}>
              {{
                header: (notify: NotifyItem) => (
                  <div class={styles.cardHeader}>
                    <span class={styles.cardTitle}>
                      {notify.name}({notify.notifications.length})
                    </span>
                    <Button
                      text
                      theme="primary"
                      onClick={() => handleAddNotification(notify.type)}
                      class={styles.addBtn}
                    >
                      <SvgIcon name="add-small" size={16} class={styles.addIcon} />
                      {t('flow.content.addNotification')}
                    </Button>
                  </div>
                ),
                content: (notify: NotifyItem) => (
                  <div class={styles.cardContent}>
                    {notify.notifications.length > 0 ? (
                      <div class={styles.notificationItems}>
                        {notify.notifications.map((notification, index) => (
                          <Card key={index} class={styles.notificationCard}>
                            <div class={styles.notificationHeader}>
                              <Button
                                text
                                theme="primary"
                                onClick={() => handleEditNotification(notify.type, index)}
                                class={styles.editBtn}
                              >
                                <SvgIcon name="edit" size={14} />
                              </Button>
                              <Button
                                text
                                theme="primary"
                                onClick={() => handleDeleteNotification(notify.type, index)}
                                class={styles.deleteBtn}
                              >
                                <SvgIcon name="delete" size={14} />
                              </Button>
                            </div>
                            <div class={styles.notificationInfo}>
                              <div class={styles.infoRow}>
                                <span class={styles.infoLabel}>
                                  {t('flow.content.noticeType')}:
                                </span>
                                <span class={styles.infoValue}>
                                  {formatNotificationTypes(notification.types)}
                                </span>
                              </div>
                              <div class={styles.infoRow}>
                                <span class={styles.infoLabel}>
                                  {t('flow.content.noticeGroup')}:
                                </span>
                                <span class={styles.infoValue}>
                                  {notification.groups.length > 0
                                    ? notification.groups.join(', ')
                                    : '--'}
                                </span>
                              </div>
                              <div class={styles.infoRow}>
                                <span class={styles.infoLabel}>
                                  {t('flow.content.noticeUser')}:
                                </span>
                                <span class={styles.infoValue}>{notification.users}</span>
                              </div>
                              <div class={styles.infoRow}>
                                <span class={styles.infoLabel}>
                                  {t('flow.content.noticeContent')}:
                                </span>
                                <span class={styles.infoValue}>{notification.content}</span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div class={styles.emptyState}>{t('flow.content.noNotifications')}</div>
                    )}
                  </div>
                ),
              }}
            </Collapse>
          </div>
        </div>
      </div>
    )
  },
})
