import type { ExecutionRecord } from '@/api/executionRecord'
import { ROUTE_NAMES } from '@/constants/routes'
import { useExecutionRecordData } from '@/hooks/useExecutionRecordData'
import SearchSelect from '@blueking/search-select-v3'
import { DatePicker, Table } from 'bkui-vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import styles from './ExecutionRecord.module.css'

export default defineComponent({
  name: 'ExecutionRecord',
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const flowId = route.params.flowId as string

    // 使用 hook 管理执行记录数据
    const {
      records: tableData,
      pagination,
      loading,
      isAllChecked,
      isIndeterminate,
      handlePageChange,
      handleLimitChange,
      handleSelectAll,
      handleSelect,
      updateQueryParams,
    } = useExecutionRecordData(flowId)

    // 日期范围
    const dateRange = ref<[Date, Date] | null>(null)

    // 搜索选择器的值
    const searchValue = ref<
      Array<{ id: string; name: string; values?: Array<{ id: string; name: string }> }>
    >([])

    // 搜索选择器的数据配置
    const searchData = computed(() => [
      {
        id: 'status',
        name: t('flow.content.status'),
        children: [
          { id: 'success', name: t('flow.common.success') },
          { id: 'failed', name: t('flow.common.failed') },
          { id: 'running', name: t('flow.content.executionStatusRunning') },
          { id: 'pending', name: t('flow.content.executionStatusPending') },
        ],
      },
      {
        id: 'repository',
        name: t('flow.content.repository'),
      },
      {
        id: 'commitId',
        name: 'commitId',
      },
      {
        id: 'commitMessage',
        name: 'CommitMessage',
      },
      {
        id: 'triggerMethod',
        name: t('flow.content.triggerMethod'),
        children: [
          { id: 'manual', name: t('flow.content.manualTrigger') },
          { id: 'timer', name: t('flow.content.timerTrigger') },
          { id: 'remote', name: t('flow.content.remoteTrigger') },
          { id: 'git-push', name: 'Git Push' },
          { id: 'git-tag', name: 'Git Tag' },
          { id: 'merge', name: t('flow.content.codeMerge') },
        ],
      },
      {
        id: 'triggerBranch',
        name: t('flow.content.triggerBranch'),
      },
      {
        id: 'remark',
        name: t('flow.content.remark'),
      },
      {
        id: 'artifactQuality',
        name: t('flow.content.artifactQuality'),
      },
    ])

    const searchPlaceHolder = computed(() => {
      return searchData.value.map((item) => item.name).join('/')
    })

    // 监听日期范围变化
    watch(dateRange, (newRange) => {
      if (newRange && newRange.length === 2) {
        updateQueryParams({
          startTime: newRange[0].toISOString(),
          endTime: newRange[1].toISOString(),
        })
      } else {
        updateQueryParams({
          startTime: undefined,
          endTime: undefined,
        })
      }
    })

    // 处理搜索选择器变化
    const handleSearchChange = (
      value: Array<{ id: string; name: string; values?: Array<{ id: string; name: string }> }>,
    ) => {
      searchValue.value = value
      // 将选中的值转换为关键词字符串
      const keyword = value
        .map((item) => {
          if (item.values && item.values.length > 0) {
            return item.values.map((v) => v.name).join(' ')
          }
          return item.name
        })
        .join(' ')
      updateQueryParams({
        keyword: keyword || undefined,
      })
    }

    // 处理搜索按钮点击
    const handleSearch = () => {
      // 触发搜索，重新加载数据
      updateQueryParams({
        keyword:
          searchValue.value
            .map((item) => {
              if (item.values && item.values.length > 0) {
                return item.values.map((v) => v.name).join(' ')
              }
              return item.name
            })
            .join(' ') || undefined,
      })
    }

    // 渲染 Stage 状态
    const renderStageStatus = (stages: ExecutionRecord['stageStatus']) => {
      return (
        <div class={styles.stageStatus}>
          {stages.map((stage, index) => {
            if (stage.status === 'pending') {
              return <div key={index} class={styles.stagePending}></div>
            }
            const statusClass =
              stage.status === 'success'
                ? styles.stageSuccess
                : stage.status === 'failed'
                  ? styles.stageFailed
                  : styles.stageRunning
            const title = stage.status === 'running' ? `${stage.progress}%` : ''
            return <div key={index} class={[styles.stageCircle, statusClass]} title={title}></div>
          })}
        </div>
      )
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
        render: ({ row }: any) => (
          <span
            class={styles.buildNo}
            onClick={() => {
              router.push({
                name: ROUTE_NAMES.FLOW_DETAIL_EXECUTION_DETAIL_TAB,
                params: {
                  flowId,
                  buildNo: (row as ExecutionRecord).buildNo,
                },
              })
            }}
          >
            #{(row as ExecutionRecord).buildNo}
          </span>
        ),
      },
      {
        label: t('flow.content.stageStatus'),
        field: 'stageStatus',
        render: ({ row }: any) => renderStageStatus((row as ExecutionRecord).stageStatus),
      },
      {
        label: t('flow.content.workflowNode'),
        field: 'workflowNode',
      },
      {
        label: t('flow.content.triggerMethodAndUser'),
        field: 'triggerMethod',
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
              onUpdate:modelValue={handleSearchChange}
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* 表格区域 */}
        <div class={styles.tableWrapper}>
          <Table
            data={tableData.value}
            columns={tableColumns.value}
            class={styles.table}
            pagination={pagination.value}
            border="outer"
            loading={loading.value}
            onPageChange={handlePageChange}
            onPageLimitChange={handleLimitChange}
          />
        </div>
      </>
    )
  },
})
