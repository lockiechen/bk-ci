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
    const flowModel = useFlowModel({ flowId })

    // 表单数据
    const formData = ref({
      name: '',
      desc: '',
      runLockType: runLockTypeMap.MULTIPLE, // MULTIPLE: 可并发运行, GROUP_LOCK: 分组
      maxConRunningQueueSize: 40,
      waitQueueTimeMinute: 20,
      concurrencyGroup: '${{ci.flow_id}}', // 分组名称，默认使用流水线ID
      concurrencyCancelInProgress: false, // 是否在新任务到来时取消正在运行的构建
      maxQueueSize: 0, // 最大排队数量
    })

    // 从flowModel中初始化数据
    const initFormData = () => {
      if (flowModel.flowModel.value) {
        formData.value.name = flowModel.flowModel.value.name || ''
        formData.value.desc = flowModel.flowModel.value.desc || ''
        // TODO: 从flowSetting中获取并发设置
        // 这里暂时使用默认值，后续需要从API获取实际的flowSetting
      }
    }

    // 监听flowModel变化
    watch(
      () => flowModel.flowModel.value,
      () => {
        initFormData()
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
                        <Checkbox checked={formData.value.concurrencyCancelInProgress}>
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
