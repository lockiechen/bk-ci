import { defineComponent, ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Form, Input, Radio, Checkbox } from 'bkui-vue'
import { SvgIcon } from '@/components/SvgIcon'
import { useFlowModel } from '@/hooks/useFlowModel'
import sharedStyles from '../shared.module.css'
import styles from './BasicSettings.module.css'

const { FormItem } = Form

const runLockTypeMap = {
  MULTIPLE: 'MULTIPLE',
  GROUP_LOCK: 'GROUP_LOCK',
}

export default defineComponent({
  name: 'EditBasicSettings',
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const flowId = route.params.flowId as string
    const { flowSetting } = useFlowModel({ flowId })

    // 表单数据
    const formData = ref<Record<string, unknown>>({
      name: '',
      desc: '',
      runLockType: runLockTypeMap.MULTIPLE,
      maxConRunningQueueSize: 40,
      waitQueueTimeMinute: 20,
      concurrencyGroup: '${{ci.flow_id}}',
      concurrencyCancelInProgress: false,
    })

    function initFormData(setting: Record<string, unknown>) {
      formData.value.name = setting?.name || ''
      formData.value.desc = setting?.desc || ''
      formData.value.runLockType = setting?.runLockType || runLockTypeMap.MULTIPLE
      formData.value.maxConRunningQueueSize = setting?.maxConRunningQueueSize || 40
      formData.value.waitQueueTimeMinute = setting?.waitQueueTimeMinute || 20
      formData.value.concurrencyGroup = setting?.concurrencyGroup || '${{ci.flow_id}}'
      formData.value.concurrencyCancelInProgress = setting?.concurrencyCancelInProgress || false
    }

    watch(
      flowSetting,
      (newVal) => {
        if (newVal) {
          initFormData(newVal)
        }
      },
      { immediate: true },
    )

    return () => (
      <div class={sharedStyles.tabContainer}>
        <div class={styles.basicSettings}>
          <Form formType="vertical" labelWidth={120}>
            {/* 基础信息 */}
            <div class={styles.section}>
              <div class={styles.sectionTitle}>{t('flow.content.basicInfo')}</div>
              <FormItem label={t('flow.content.workflowName')} required property="name">
                <Input
                  v-model={formData.value.name}
                  placeholder={t('flow.content.workflowNamePlaceholder')}
                  maxlength={128}
                />
              </FormItem>

              <FormItem label={t('flow.content.description')} property="desc">
                <Input
                  v-model={formData.value.desc}
                  type="textarea"
                  rows={3}
                  placeholder={t('flow.content.descriptionPlaceholder')}
                  maxlength={500}
                />
              </FormItem>
            </div>

            {/* 执行设置 */}
            <div class={styles.section}>
              <div class={styles.sectionTitle}>{t('flow.content.executionSettings')}</div>
              <FormItem>
                <div class={styles.concurrencySettings}>
                  <div class={styles.concurrencyHeader}>
                    <span class={styles.concurrencyTitle}>
                      {t('flow.content.concurrencySettings')}
                    </span>
                  </div>
                  <Radio.Group v-model={formData.value.runLockType} class={styles.radioGroup}>
                    <Radio label={runLockTypeMap.MULTIPLE} class={styles.radioItem}>
                      {t('flow.content.concurrentExecution')}
                    </Radio>
                    <Radio label={runLockTypeMap.GROUP_LOCK} class={styles.radioItem}>
                      {t('flow.content.groupOnlyOneBuildTaskCanRunAtSameTime')}
                    </Radio>
                  </Radio.Group>
                  {formData.value.runLockType === runLockTypeMap.MULTIPLE && (
                    <div class={styles.subForm}>
                      <FormItem
                        label={t('flow.content.maxConcurrentExecutions')}
                        required
                        property="maxConRunningQueueSize"
                        class={styles.subFormItem}
                      >
                        <Input
                          v-model={formData.value.maxConRunningQueueSize}
                          type="number"
                          min={1}
                          max={200}
                          placeholder={t('flow.content.maxConcurrentExecutionsPlaceholder')}
                        />
                      </FormItem>
                      <FormItem
                        label={t('flow.content.queueTimeoutTime')}
                        required
                        property="waitQueueTimeMinute"
                        class={styles.subFormItem}
                      >
                        <div class={styles.timeoutInputWrapper}>
                          <Input
                            v-model={formData.value.waitQueueTimeMinute}
                            type="number"
                            min={1}
                            max={1440}
                            placeholder={t('flow.content.queueTimeoutTimePlaceholder')}
                          />
                          <span class={styles.unit}>{t('flow.content.minutes')}</span>
                        </div>
                      </FormItem>
                    </div>
                  )}
                  {formData.value.runLockType === runLockTypeMap.GROUP_LOCK && (
                    <div class={styles.subForm}>
                      <FormItem
                        label={t('flow.content.groupName')}
                        required
                        property="concurrencyGroup"
                        class={styles.subFormItem}
                      >
                        <Input
                          v-model={formData.value.concurrencyGroup}
                          placeholder={t('flow.content.groupNamePlaceholder')}
                          maxlength={128}
                        />
                      </FormItem>
                      <FormItem property="concurrencyCancelInProgress" class={styles.subFormItem}>
                        <Checkbox v-model={formData.value.concurrencyCancelInProgress}>
                          {t('flow.content.stopWhenNewCome')}
                        </Checkbox>
                      </FormItem>
                      {!formData.value.concurrencyCancelInProgress && (
                        <>
                          <FormItem
                            label={t('flow.content.maxQueueSize')}
                            property="maxQueueSize"
                            class={styles.subFormItem}
                          >
                            <div class={styles.queueSizeInputWrapper}>
                              <Input
                                v-model={formData.value.maxQueueSize}
                                type="number"
                                min={0}
                                max={200}
                                placeholder={t('flow.content.maxQueueSizePlaceholder')}
                              />
                              <span class={styles.unit}>{t('flow.content.item')}</span>
                            </div>
                          </FormItem>
                          <FormItem
                            label={t('flow.content.maxQueueTime')}
                            property="waitQueueTimeMinute"
                            class={styles.subFormItem}
                          >
                            <div class={styles.timeoutInputWrapper}>
                              <Input
                                v-model={formData.value.waitQueueTimeMinute}
                                type="number"
                                min={1}
                                max={1440}
                                placeholder={t('flow.content.queueTimeoutTimePlaceholder')}
                              />
                              <span class={styles.unit}>{t('flow.content.minutes')}</span>
                            </div>
                          </FormItem>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </FormItem>
            </div>
          </Form>
        </div>
      </div>
    )
  },
})
