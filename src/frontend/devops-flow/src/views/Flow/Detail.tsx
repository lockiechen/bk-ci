import { defineComponent, ref, computed, watch, shallowRef } from 'vue'
import { Table, DatePicker, Checkbox } from 'bkui-vue'
import SearchSelect from '@blueking/search-select-v3'
import { useRoute, useRouter } from 'vue-router'
import { useExecutionRecordData } from '@/hooks/useExecutionRecordData'
import type { ExecutionRecord } from '@/api/executionRecord'
import styles from './Detail.module.css'
import layoutStyles from '@/styles/layout.module.css'

interface MenuItem {
  key: string
  label: string
  children?: MenuItem[]
}

export default defineComponent({
  name: 'FlowDetail',
  setup() {
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

    // 菜单数据
    const menuItems = ref<MenuItem[]>([
      {
        key: 'execution-info',
        label: '执行信息',
        children: [
          { key: 'execution-record', label: '执行记录' },
          { key: 'trigger-record', label: '触发记录' },
        ],
      },
      {
        key: 'workflow-config',
        label: '创作流配置',
        children: [
          { key: 'workflow-orchestration', label: '创作流编排' },
          { key: 'workflow-environment', label: '创作环境' },
          { key: 'trigger-events', label: '触发事件' },
          { key: 'notification-config', label: '通知配置' },
          { key: 'basic-settings', label: '基础设置' },
        ],
      },

      {
        key: 'more',
        label: '更多',
        children: [
          { key: 'permission-settings', label: '权限设置' },
          { key: 'permission-delegation', label: '权限代持' },
          { key: 'operation-log', label: '操作日志' },
        ],
      },
    ])

    // 当前激活的菜单项
    const activeKey = ref('execution-record')

    // 处理菜单点击
    const handleMenuClick = (key: string) => {
      activeKey.value = key
      // TODO: 根据key跳转到对应页面
    }

    // 日期范围
    const dateRange = ref<[Date, Date] | null>(null)

    // 搜索选择器的值
    const searchValue = ref<
      Array<{ id: string; name: string; values?: Array<{ id: string; name: string }> }>
    >([])

    // 搜索选择器的数据配置
    const searchData = shallowRef([
      {
        id: 'status',
        name: '状态',
        children: [
          { id: 'success', name: '成功' },
          { id: 'failed', name: '失败' },
          { id: 'running', name: '运行中' },
          { id: 'pending', name: '待执行' },
        ],
      },
      {
        id: 'repository',
        name: '代码库',
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
        name: '触发方式',
        children: [
          { id: 'manual', name: '手动触发' },
          { id: 'timer', name: '定时触发' },
          { id: 'remote', name: '远程触发' },
          { id: 'git-push', name: 'Git Push' },
          { id: 'git-tag', name: 'Git Tag' },
          { id: 'merge', name: '代码合并' },
        ],
      },
      {
        id: 'triggerBranch',
        name: '触发分支',
      },
      {
        id: 'remark',
        name: '备注',
      },
      {
        id: 'artifactQuality',
        name: '制品质量',
      },
    ])

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
              {expanded ? '收起' : '展开'}
            </span>
          )}
        </div>
      )
    }

    // 表格列配置
    const tableColumns = computed(() => [
      {
        label: '',
        field: 'checkbox',
        render: ({ row }: any) => (
          <Checkbox
            checked={(row as ExecutionRecord).checked}
            onChange={(checked: boolean) => handleSelect(row as ExecutionRecord, checked)}
          />
        ),
        header: () => (
          <Checkbox
            checked={isAllChecked.value}
            indeterminate={isIndeterminate.value}
            onChange={handleSelectAll}
          />
        ),
      },
      {
        label: '构建号',
        field: 'buildNumber',
        render: ({ row }: any) => `#${(row as ExecutionRecord).buildNumber}`,
      },
      {
        label: 'Stage 状态',
        field: 'stageStatus',
        render: ({ row }: any) => renderStageStatus((row as ExecutionRecord).stageStatus),
      },
      {
        label: '创作节点',
        field: 'workflowNode',
      },
      {
        label: '触发方式/触发人',
        field: 'triggerMethod',
      },
      {
        label: '触发时间',
        field: 'triggerTime',
      },
      {
        label: '执行开始时间',
        field: 'startTime',
      },
      {
        label: '执行完成时间',
        field: 'endTime',
      },
      {
        label: '总耗时',
        field: 'totalDuration',
      },
      {
        label: '执行耗时',
        field: 'executionDuration',
      },
      {
        label: '备注',
        field: 'remark',
        render: ({ row }: any) =>
          renderRemark((row as ExecutionRecord).remark, (row as ExecutionRecord).id),
      },
      {
        label: '错误码',
        field: 'errorCode',
        render: ({ row }: any) => (row as ExecutionRecord).errorCode || '--',
      },
    ])

    return () => (
      <div class={layoutStyles.content}>
        <nav class={styles.sidebar}>
          {menuItems.value.map((item) => (
            <div key={item.key} class={styles.menuGroup}>
              {item.children ? (
                <>
                  <div class={styles.menuCategory}>{item.label}</div>
                  <div class={styles.subMenu}>
                    {item.children.map((child) => (
                      <button
                        key={child.key}
                        class={[
                          styles.menuItem,
                          activeKey.value === child.key && styles.menuItemActive,
                        ]}
                        onClick={() => handleMenuClick(child.key)}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <button
                  class={[
                    styles.menuItem,
                    styles.menuItemTopLevel,
                    activeKey.value === item.key && styles.menuItemActive,
                  ]}
                  onClick={() => handleMenuClick(item.key)}
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </nav>

        <div class={styles.content}>
          {/* 筛选区域 */}
          <div class={styles.filterBar}>
            <div class={styles.filterLeft}>
              <DatePicker
                type="daterange"
                placeholder="选择开始时间范围"
                v-model={dateRange.value}
                class={styles.datePicker}
              />
            </div>
            <div class={styles.filterRight}>
              <SearchSelect
                modelValue={searchValue.value}
                data={searchData.value}
                unique-select
                placeholder="状态/代码库/commitId/CommitMessage/触发方式/触发分支/备注/制品质量"
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
        </div>
      </div>
    )
  },
})
