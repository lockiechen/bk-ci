import { fetchAuthoringEnvList } from '@/api/authoringEnvironmentApi'
import type { ExecutionRecord } from '@/api/executionRecord'
import { getHistoryConditionList } from '@/api/executionRecord'
import StageSteps from '@/components/StageSteps'
import StatusIcon from '@/components/StatusIcon'
import { ROUTE_NAMES } from '@/constants/routes'
import { useExecutionRecordData } from '@/hooks/useExecutionRecordData'
import { useExecutionRecordStore } from '@/stores/executionRecord'
import { statusColorMap } from '@/utils/flowStatus'
import SearchSelect from '@blueking/search-select-v3'
import { DatePicker, Loading, Table } from 'bkui-vue'
import type { Column } from 'bkui-vue/lib/table/props'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import styles from './ExecutionRecord.module.css'

// Constants for Search Keys
const SEARCH_KEY = {
  STATUS: 'status',
  TRIGGER: 'trigger',
  TRIGGER_USER: 'triggerUser',
  WORKFLOW_NODE: 'workflowNode', // Map to materialBranch for API
  REMARK: 'remark',
} as const

type SearchValues = { 
  id: string;
  name: string;
  values?: Array<{ id: string; name: string }>
}[]

export default defineComponent({
  name: 'ExecutionRecord',
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const projectId = computed(() => route.params.projectId as string)
    const flowId = computed(() => route.params.flowId as string)

    // Initialize store
    const store = useExecutionRecordStore()

    const statusList = ref<any[]>([])
    const triggerList = ref<any[]>([])
    // const workflowNodeList = ref<any[]>([]) // Remove this

    // Load initial data
    onMounted(async () => {
      if (projectId.value && flowId.value) {
        try {
          const [statuses, triggers] = await Promise.all([
            getHistoryConditionList(projectId.value, flowId.value, SEARCH_KEY.STATUS),
            getHistoryConditionList(projectId.value, flowId.value, SEARCH_KEY.TRIGGER),
          ])
          statusList.value = statuses
          triggerList.value = triggers
        } catch (e) {
          console.error(e)
        }
      }
    })

    // 远程获取节点列表
    const getWorkflowNodes = async (keyword: string) => {
      if (!projectId.value) return []
      try {
        const res = await fetchAuthoringEnvList({ projectId: projectId.value })
        const list = res.map((item) => ({
          id: item.envHashId,
          name: item.name,
        }))

        if (!keyword) return list

        return list.filter((item) => item.name.toLowerCase().includes(keyword.toLowerCase()))
      } catch (e) {
        console.error(e)
        return []
      }
    }

    const getMenuList = async (item: any, keyword: string) => {
      if (item.id === SEARCH_KEY.WORKFLOW_NODE) {
        return await getWorkflowNodes(keyword)
      }
      return []
    }

    // 搜索选择器的数据配置
    const searchData = computed(() => [
      {
        id: SEARCH_KEY.STATUS,
        name: t('flow.content.status'),
        multiable: true,
        children: statusList.value.map((item) => ({ id: item.id, name: item.value })),
      },
      {
        id: SEARCH_KEY.TRIGGER,
        name: t('flow.content.triggerMethod'),
        multiable: true,
        children: triggerList.value.map((item) => ({ id: item.id, name: item.value })),
      },
      {
        id: SEARCH_KEY.TRIGGER_USER,
        name: t('flow.content.triggerUser'),
      },
      {
        id: SEARCH_KEY.WORKFLOW_NODE,
        name: t('flow.content.workflowNode'),
        async: true,
      },
      {
        id: SEARCH_KEY.REMARK,
        name: t('flow.content.remark'),
      },
    ])

    // 日期范围
    const dateRange = ref<[Date, Date] | null>(null)

    // 搜索选择器的值
    const searchValue = ref<SearchValues>([])

    // 初始化：从 URL query 恢复搜索条件
    const {
      startTime,
      endTime,
      status,
      trigger,
      triggerUser,
      materialBranch,
      remark,
    } = route.query

    // 恢复日期
    if (startTime && endTime) {
      dateRange.value = [new Date(startTime as string), new Date(endTime as string)]
    }

    // 恢复 SearchSelect
    const initialSearchValue: any[] = []

    // Helper to restore search items
    const restoreSearchItem = (key: string, id: string, isMulti = false) => {
      const value = route.query[key]
      if (value) {
        const item = searchData.value.find((d) => d.id === id)
        if (item) {
          if (isMulti) {
            const list = Array.isArray(value) ? value : [value]
            const values = (list as string[]).map((v) => {
              const option = item.children?.find((c) => c.id === v)
              return { id: v, name: option?.name || v }
            })
            initialSearchValue.push({ id, name: item.name, values })
          } else {
            initialSearchValue.push({ id, name: item.name, values: [{ id: value as string, name: value as string }] })
          }
        }
      }
    }

    restoreSearchItem(SEARCH_KEY.STATUS, SEARCH_KEY.STATUS, true)
    restoreSearchItem(SEARCH_KEY.TRIGGER, SEARCH_KEY.TRIGGER, true)
    restoreSearchItem(SEARCH_KEY.TRIGGER_USER, SEARCH_KEY.TRIGGER_USER)
    restoreSearchItem(SEARCH_KEY.WORKFLOW_NODE, SEARCH_KEY.WORKFLOW_NODE)
    restoreSearchItem(SEARCH_KEY.REMARK, SEARCH_KEY.REMARK)

    if (initialSearchValue.length > 0) {
      searchValue.value = initialSearchValue
    }

    // 更新 store (在调用 hook 之前)
    if (Object.keys(route.query).length > 0) {
      store.setQueryParams({
        startTime: startTime as string,
        endTime: endTime as string,
        status: Array.isArray(status) ? status : status ? [status] : undefined,
        trigger: Array.isArray(trigger) ? trigger : trigger ? [trigger] : undefined,
        triggerUser: triggerUser as string,
        materialBranch: materialBranch as string,
        remark: remark as string,
      } as any)
    }

    // Use hook to manage execution record data
    const {
      records: tableData,
      pagination,
      loading,
      handlePageChange,
      handleLimitChange,
      updateQueryParams,
    } = useExecutionRecordData()

    const searchPlaceHolder = computed(() => {
      return searchData.value.map((item) => item.name).join('/')
    })

    // 监听日期范围变化
    watch(dateRange, (newRange) => {
      let params: any = {}
      if (newRange && newRange.length === 2) {
        params = {
          startTime: newRange[0].toISOString(),
          endTime: newRange[1].toISOString(),
        }
      } else {
        params = {
          startTime: undefined,
          endTime: undefined,
        }
      }
      updateQueryParams(params)

      // Sync URL
      const query = { ...route.query, ...params }
      if (!params.startTime) {
        delete query.startTime
        delete query.endTime
      }
      router.replace({ query })
    })

    // 处理搜索选择器变化
    const handleSearchChange = (
      value: SearchValues,
    ) => {
      searchValue.value = value

      const params: Record<string, string | string[] | undefined> = {
        [SEARCH_KEY.STATUS]: undefined,
        [SEARCH_KEY.TRIGGER]: undefined,
        [SEARCH_KEY.TRIGGER_USER]: undefined,
        [SEARCH_KEY.WORKFLOW_NODE]: undefined,
        [SEARCH_KEY.REMARK]: undefined,
      }

      value.forEach((item) => {
        if (item.id === SEARCH_KEY.STATUS && item.values) {
          params[SEARCH_KEY.STATUS] = item.values.map((v) => v.id)
        } else if (item.id === SEARCH_KEY.TRIGGER && item.values) {
          params[SEARCH_KEY.TRIGGER] = item.values.map((v) => v.id)
        } else {
          // For single value fields
          if (Array.isArray(item.values) && item.values.length > 0) {
             params[item.id] = item.values[0]!.id
          }
        }
      })

      updateQueryParams(params)

      // Sync URL
      const query = { ...route.query, ...params }
      // Remove undefined keys from query
      Object.keys(params).forEach(key => {
          if (params[key] === undefined) {
              delete query[key]
          }
      })

      router.replace({ query })
    }

    // 处理搜索按钮点击
    const handleSearch = () => {
      // 搜索逻辑已在 handleSearchChange 中处理
    }

    // 渲染 Stage 状态 - 使用 StageSteps 组件
    const renderStageStatus = (stages: ExecutionRecord['stageStatus'], buildId: string) => {
      if (!stages || stages.length === 0) {
        return <span>--</span>
      }
      return <StageSteps steps={stages} buildId={buildId} />
    }

    // 备注展开状态映射
    const remarkExpandedMap = ref<Record<string, boolean>>({})

    // 渲染备注（支持展开/收起）
    const renderRemark = (remark: string, rowId: string) => {
      if (!remark) return '--'
      const expanded = remarkExpandedMap.value[rowId] || false
      const shouldTruncate = remark.length > 50
      const displayText = expanded || !shouldTruncate ? remark : remark.slice(0, 50) + '...'

      return (
        <div class={styles.remarkCell}>
          <span class={styles.remarkText}>{displayText}</span>
          {shouldTruncate && (
            <span
              class={styles.remarkExpand}
              onClick={() => {
                remarkExpandedMap.value[rowId] = !expanded
              }}
            >
              {expanded ? t('flow.content.collapse') : t('flow.content.expand')}
            </span>
          )}
        </div>
      )
    }

    // 表格列配置
    const tableColumns = computed(() => [
      {
        label: t('flow.content.buildNo'),
        field: 'buildNo',
        render: ({ row }: any) => {
          const record = row as ExecutionRecord
          const status = record.status || 'UNKNOWN'
          const statusColor = statusColorMap[status as keyof typeof statusColorMap] || statusColorMap.UNKNOWN
          
          return (
            <span class={styles.buildNoStatus}>
              <StatusIcon status={status as any} size={14} />
              <span
                class={styles.buildNo}
                style={{ color: statusColor }}
                onClick={() => {
                  router.push({
                    name: ROUTE_NAMES.FLOW_DETAIL_EXECUTION_DETAIL_TAB,
                    params: {
                      flowId: flowId.value,
                      buildNo: record.id,
                    },
                  })
                }}
              >
                #{record.buildNo}
              </span>
              
            </span>
          )
        },
      },
      {
        label: t('flow.content.stageStatus'),
        field: 'stageStatus',
        render: ({ row }: any) => {
          const record = row as ExecutionRecord
          return renderStageStatus(record.stageStatus, record.id)
        },
      },
      {
        label: t('flow.content.workflowNode'),
        field: 'createWorkspaceId',
      },
      {
        label: t('flow.content.triggerMethodAndUser'),
        field: 'triggerAndUser',
      },
      {
        label: t('flow.content.triggerTime'),
        field: 'triggerTime',
      },
      {
        label: t('flow.content.executionStartTime'),
        field: 'startTime',
      },
      {
        label: t('flow.content.executionEndTime'),
        field: 'endTime',
      },
      {
        label: t('flow.content.totalDuration'),
        field: 'totalDuration',
      },
      {
        label: t('flow.content.executionDuration'),
        field: 'executionDuration',
      },
      {
        label: t('flow.content.remark'),
        field: 'remark',
        render: ({ row }: any) =>
          renderRemark((row as ExecutionRecord).remark, (row as ExecutionRecord).id),
      },
      {
        label: t('flow.content.errorCode'),
        field: 'errorCode',
        render: ({ row }: any) => (row as ExecutionRecord).errorCode || '--',
      },
    ])

    return () => (
      <>
        {/* 筛选区域 */}
        <div class={styles.filterBar}>
          <div class={styles.filterLeft}>
            <DatePicker
              type="daterange"
              placeholder={t('flow.content.selectStartTimeRange')}
              v-model={dateRange.value}
              class={styles.datePicker}
            />
          </div>
          <div class={styles.filterRight}>
            <SearchSelect
              modelValue={searchValue.value}
              data={searchData.value}
              unique-select
              placeholder={searchPlaceHolder.value}
              class={styles.searchInput}
              getMenuList={getMenuList}
              onUpdate:modelValue={handleSearchChange}
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Table area */}
        <Loading class={styles.tableWrapper} loading={loading.value} mode="spin" theme="primary" size="small">
          <Table
            data={tableData.value}
            columns={tableColumns.value as Column[]}
            class={styles.table}
            pagination={{
              current: pagination.value.current,
              count: pagination.value.count,
              limit: pagination.value.limit,
              showTotalCount: true,
            }}
            remotePagination
            border="outer"
            onPageValueChange={handlePageChange}
            onPageLimitChange={handleLimitChange}
          />
        </Loading>
      </>
    )
  },
})
