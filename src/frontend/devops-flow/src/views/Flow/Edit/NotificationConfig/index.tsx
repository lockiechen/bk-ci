import { SvgIcon } from '@/components/SvgIcon'
import { useFlowModel } from '@/hooks/useFlowModel'
import { Button, Card, Collapse, Message } from 'bkui-vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import type { Subscription } from '../../../../api/flowModel'
import sharedStyles from '../shared.module.css'
import styles from './NotificationConfig.module.css'

interface NotifyItem {
  type: string
  name: string
  notifications: Subscription[]
}

export default defineComponent({
  name: 'EditNotificationConfig',
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const flowId = route.params.flowId as string
    const projectId = route.params.projectId as string

    // Use flowModel to get and update settings
    const { flowSetting, updateFlowSetting } = useFlowModel({
      projectId,
      flowId,
      version: route.params.version as string,
    })

    // 通知数据（从flowSetting中获取）
    const successSubscriptionList = ref<Subscription[]>([])
    const failSubscriptionList = ref<Subscription[]>([])
    const cancelSubscriptionList = ref<Subscription[]>([])
    const publishSubscriptionList = ref<Subscription[]>([])

    // Initialize data from flowSetting
    watch(
      flowSetting,
      (setting) => {
        if (setting) {
          successSubscriptionList.value = setting.successSubscriptionList || []
          failSubscriptionList.value = setting.failSubscriptionList || []
          cancelSubscriptionList.value = (setting as any).cancelSubscriptionList || []
          publishSubscriptionList.value = (setting as any).publishSubscriptionList || []
        }
      },
      { immediate: true }
    )

    // Update flowSetting when notification data changes
    const updateNotificationSetting = () => {
      if (!flowSetting.value) return
      
      updateFlowSetting({
        ...flowSetting.value,
        successSubscriptionList: successSubscriptionList.value,
        failSubscriptionList: failSubscriptionList.value,
        cancelSubscriptionList: cancelSubscriptionList.value as any,
        publishSubscriptionList: publishSubscriptionList.value as any,
      })
    }

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
    const getNotificationList = (type: string): Subscription[] => {
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
      
      // Update flowSetting after deletion
      updateNotificationSetting()
      
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
