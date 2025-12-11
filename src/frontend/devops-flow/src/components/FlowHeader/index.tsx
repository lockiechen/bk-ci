import { defineComponent, ref, h } from 'vue'
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, Tag, Select } from 'bkui-vue'
import styles from './index.module.css'
import { useRoute, useRouter } from 'vue-router'
import { FLOW_GROUP_TYPES } from '@/constants/flowGroup'
import { SvgIcon } from '../SvgIcon'
import ExtMenu from '../ExtMenu'
import { useFlowListData } from '@/hooks/useFlowListData'
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm'
import { deleteContent } from '@/api/flowContentList'
import type { MenuItem } from '@/api/flowContentList'
import { CommonHeader } from '@/components/CommonHeader'
import type { FlowInfo } from '@/types/flow'
import type { FlowVersion } from '@/types/flow'

const { Option } = Select

export interface VersionOption {
  value: string
  label: string
  isLatest?: boolean
}

export const FlowHeader = defineComponent({
  name: 'FlowHeader',
  props: {
    flowInfo: {
      type: Object as PropType<FlowInfo>,
      required: true,
    },
    versionList: {
      type: Array as PropType<FlowVersion[]>,
      required: true,
    },
    onEdit: {
      type: Function as PropType<() => void>,
    },
    onExecute: {
      type: Function as PropType<() => void>,
    },
    onVersionChange: {
      type: Function as PropType<(version: number) => void>,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const selectedVersion = ref(Number(route.params.version) ?? 1)
    const { collectHandler } = useFlowListData()
    const { showDeleteConfirm } = useDeleteConfirm()
    const flowList = {
      name: 'flowList',
      params: {
        groupId: FLOW_GROUP_TYPES.ALL_FLOWS,
      },
    }
    const moreActions = ref<MenuItem[]>([
      {
        text: t('flow.content.favorite'),
        handler: (data: any) => collectHandler(data.hasCollect, data.id),
      },
      {
        text: t('flow.actions.rename'),
        handler: (data: any) => console.log(data),
      },
      {
        text: t('flow.content.export'),
        handler: (data: any) => console.log(data),
      },
      {
        text: t('flow.actions.delete'),
        handler: (data: any) => {
          const objectName = data?.name || data?.id
          showDeleteConfirm({
            message: () => [
              `${t('flow.content.confirmDeleteFlow')}\n${t('flow.content.operationObject')}: `,
              h(
                'strong',
                { style: 'font-weight: 700; color: var(--color-text-primary);' },
                objectName,
              ),
            ],
            onConfirm: async () => {
              await deleteContent(data?.id)
              router.push(flowList)
            },
          })
        },
      },
    ])

    const currentVersionOption = () => {
      return props.versionList.find((v) => v.version === selectedVersion.value)
    }

    const renderTag = () => {
      return (
        <Tag theme="success" size="small" class={styles.tag}>
          {t('flow.content.latest')}
        </Tag>
      )
    }

    const renderCheckIcon = (isLatest: boolean = false) => {
      return (
        <SvgIcon
          name="check-circle"
          class={[styles.checkIcon, isLatest && styles.latestCheckIcon]}
        />
      )
    }

    return () => {
      const currentVersion = currentVersionOption()

      return (
        <>
          <CommonHeader workflowName={props.flowInfo?.pipelineName}>
            {{
              'version-selector': () => (
                <Select
                  v-model={selectedVersion.value}
                  onChange={props.onVersionChange}
                  class={styles.versionSelector}
                >
                  {{
                    trigger: () => (
                      <span class={styles.versionTrigger}>
                        {renderCheckIcon(currentVersion?.isLatest)}
                        {currentVersion?.versionName}
                        {currentVersion?.isLatest && renderTag()}
                        <SvgIcon name="angle-down" class={styles.versionSelectToggleIcon} />
                      </span>
                    ),
                    default: () =>
                      props.versionList.map((version) => (
                        <Option
                          key={version.version}
                          value={version.version}
                          label={version.versionName}
                        >
                          <div class={styles.versionOption}>
                            {renderCheckIcon(version.isLatest)}
                            <span>{version.versionName}</span>
                            {version.isLatest && renderTag()}
                          </div>
                        </Option>
                      )),
                  }}
                </Select>
              ),
              actions: () => (
                <>
                  <Button onClick={props.onEdit}>{t('flow.content.edit')}</Button>
                  <Button theme="primary" onClick={props.onExecute}>
                    {t('flow.content.execute')}
                  </Button>
                  <ExtMenu data={props.flowInfo} config={moreActions.value} />
                </>
              ),
            }}
          </CommonHeader>
        </>
      )
    }
  },
})
