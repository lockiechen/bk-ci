import { defineComponent, ref, computed, watch, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { FLOW_SORT_FILED } from '@/utils/flowConst.ts'
import { Button, Table, Loading, Dropdown, Message } from 'bkui-vue'
import type { Column } from 'bkui-vue/lib/table/props'
import SearchSelect from '@blueking/search-select-v3'
import ExtMenu from '@/components/ExtMenu/index'
import EmptyTableStatus from '@/components/EmptyTable/index'
import { SvgIcon } from '@/components/SvgIcon'
import ImportFlowPopup from '@/components/ImportFlowPopup'
import NewFlowPopup from '@/components/NewFlowPopup'
import AddToGroupPopup from '@/components/AddToGroupPopup'
import CopyFlowPopup from '@/components/CopyFlowPopup'
import SaveAsTemplatePopup from '@/components/SaveAsTemplatePopup'
import {
  type ContentTableItem,
  type SaveAsTemplateParams,
  type CopyFlowParams,
} from '@/api/flowContentList'
import { useTableHeight } from '@/hooks/useTableHeight'
import { useFlowListData } from '@/hooks/useFlowListData'
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm'
import styles from './FlowTable.module.css'

export const FlowTable = defineComponent({
  name: 'FlowTable',
  components: {
    ExtMenu,
    EmptyTableStatus,
    SvgIcon,
    ImportFlowPopup,
    NewFlowPopup,
    SearchSelect,
    AddToGroupPopup,
    CopyFlowPopup,
    SaveAsTemplatePopup,
  },
  props: {
    groupId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const router = useRouter()
    const confirmLoading = ref(false)
    const tableContainerRef = ref<HTMLDivElement>()
    const { maxHeight } = useTableHeight(tableContainerRef)
    const { showDeleteConfirm } = useDeleteConfirm()

    const {
      pagination,
      tableLoading,
      flowTableList,
      isShowAddToDialog,
      isShowCopyDialog,
      isShowSaveAsTemplateDialog,
      currentActionData,

      sortList,
      newFlowList,
      sortShow,
      currentSortType,
      currentCollation,
      currentSortIconName,
      newFromTemplatePopupShow,
      importFlowPopupShow,

      updateQuery,
      changeSortType,
      closeAllDialogs,
      handleTableSortChange,
      handlePageChange,
      handleLimitChange,
      handleClearSearch,
      removeContent,
      confirmEnableAction,
      copyContentItem,
      saveContentAsTemplate,
      addContentToFlowGroup,
      importNewContent,
      setDeleteActionCallback,
      setEnableActionCallback,
      loadContentDataWithGroupId,
    } = useFlowListData()

    // 使用传入的 groupId 加载数据
    watch(
      () => props.groupId,
      (newGroupId) => {
        if (newGroupId) {
          loadContentDataWithGroupId(newGroupId)
        }
      },
      { immediate: true },
    )

    watch([currentSortType, currentCollation], () => {
      loadContentDataWithGroupId(props.groupId)
      updateQuery()
    })

    const fieldToSortTypeMap: Record<string, string> = {
      name: FLOW_SORT_FILED.flowName,
      latestBuildStartTime: FLOW_SORT_FILED.latestBuildStartDate,
    }

    const tableColumn = computed(
      () =>
        [
          {
            label: t('flow.content.name'),
            field: 'name',
            sort: {
              value:
                currentSortType.value === FLOW_SORT_FILED.flowName && currentCollation.value
                  ? currentCollation.value
                  : null,
              sortScope: 'all',
            },
            render: ({ row }: any) => {
              const item = row as ContentTableItem
              return (
                <span
                  class={styles.nameLink}
                  onClick={() => {
                    router.push({
                      name: 'flowDetail',
                      params: { flowId: item.id },
                    })
                  }}
                >
                  {item.name}
                </span>
              )
            },
          },
          { label: t('flow.content.groupName'), field: 'viewNames' },
          { label: t('flow.content.lastExecution'), field: 'latestBuildStatus' },
          {
            label: t('flow.content.executionTime'),
            field: 'latestBuildStartTime',
            sort: {
              value:
                currentSortType.value === FLOW_SORT_FILED.latestBuildStartDate &&
                currentCollation.value
                  ? currentCollation.value
                  : null,
              sortScope: 'all',
            },
          },
          {
            label: t('flow.content.actions'),
            field: 'actions',
            render: ({ row }: any) => (
              <div class={styles.actions}>
                <Button
                  text
                  theme="primary"
                  disabled={!row.enable}
                  onClick={() => row.handleExecute(row)}
                >
                  {t('flow.content.execute')}
                </Button>
                <ExtMenu data={row} config={row.flowAction} />
              </div>
            ),
          },
        ] as Column[],
    )

    function handleSort({ column, type }: any) {
      const sortType = fieldToSortTypeMap[column.field] || ''
      const collation = type || ''
      handleTableSortChange({ sortType, collation })
    }

    function pageChange(current: number) {
      handlePageChange(current)
      loadContentDataWithGroupId(props.groupId)
    }

    function limitChange(limit: number) {
      handleLimitChange(limit)
      loadContentDataWithGroupId(props.groupId)
    }

    // 处理删除操作
    function handleDeleteAction(data: any) {
      const objectName = data?.name || data?.id
      showDeleteConfirm({
        message: () => [
          `${t('flow.content.confirmDeleteFlow')}\n${t('flow.content.operationObject')}: `,
          h('strong', { style: 'font-weight: 700; color: var(--color-text-primary);' }, objectName),
        ],
        onConfirm: async () => {
          await removeContent(data?.id)
        },
      })
    }

    // 处理启用/禁用操作
    function handleEnableAction(data: any) {
      const isEnable = data?.enable
      const objectName = data?.name || data?.id
      showDeleteConfirm({
        title: t('flow.content.enableOrDisable'),
        message: () => [
          `${isEnable ? t('flow.content.confirmDisableFlow') : t('flow.content.confirmEnableFlow')}\n${t('flow.content.operationObject')}: `,
          h('strong', { style: 'font-weight: 700; color: var(--color-text-primary);' }, objectName),
        ],
        theme: 'primary',
        confirmText: t('flow.common.confirm'),
        onConfirm: async () => {
          await confirmEnableAction(data?.id, !data.enable)
        },
      })
    }

    // 设置删除操作回调
    setDeleteActionCallback(handleDeleteAction)
    // 设置启用/禁用操作回调
    setEnableActionCallback(handleEnableAction)

    // 搜索选择器的值
    const searchValue = ref<
      Array<{ id: string; name: string; values?: Array<{ id: string; name: string }> }>
    >([])

    // 搜索选择器的数据配置
    const searchData = computed(() => [
      {
        id: 'name',
        name: t('flow.content.name'),
      },
      {
        id: 'viewNames',
        name: t('flow.content.searchFieldGroupName'),
      },
      {
        id: 'latestBuildStatus',
        name: t('flow.content.searchFieldExecutionStatus'),
        children: [
          { id: 'success', name: t('flow.common.success') },
          { id: 'failed', name: t('flow.common.failed') },
          { id: 'running', name: t('flow.content.executionStatusRunning') },
          { id: 'pending', name: t('flow.content.executionStatusPending') },
        ],
      },
    ])

    const searchPlaceHolder = computed(() => {
      return searchData.value.map((item) => item.name).join('/')
    })

    // 处理搜索选择器变化
    const handleSearchChange = (
      value: Array<{ id: string; name: string; values?: Array<{ id: string; name: string }> }>,
    ) => {
      searchValue.value = value
      // TODO: 实现搜索逻辑
      console.log('Search changed:', value)
    }

    // 处理搜索按钮点击
    const handleSearch = () => {
      // TODO: 触发搜索，重新加载数据
      console.log('Search triggered:', searchValue.value)
    }

    const handleAddTo = async (flowId: string, groupId: string) => {
      confirmLoading.value = true
      try {
        await addContentToFlowGroup(flowId, groupId)
        Message({
          theme: 'success',
          message: t('flow.content.addTo') + t('flow.common.success'),
        })
      } catch (error: any) {
        Message({ theme: 'error', message: error || error.message })
      } finally {
        confirmLoading.value = false
      }
    }

    const handleCopyFlow = async (flowId: string, params: CopyFlowParams) => {
      confirmLoading.value = true
      try {
        const res = await copyContentItem(flowId, params)
        if (res) {
          Message({
            theme: 'success',
            message: t('flow.content.copyCreationFlow') + t('flow.common.success'),
          })
        }
      } catch (error: any) {
        Message({ theme: 'error', message: error || error.message })
      } finally {
        confirmLoading.value = false
      }
    }

    const handleSaveAsTemplate = async (flowId: string, params: SaveAsTemplateParams) => {
      confirmLoading.value = true
      try {
        await saveContentAsTemplate(flowId, params)
        Message({
          theme: 'success',
          message: t('flow.content.saveAsTemplate') + t('flow.common.success'),
        })
      } catch (error: any) {
        Message({ theme: 'error', message: error || error.message })
      } finally {
        confirmLoading.value = false
      }
    }

    return () => (
      <div class={styles.content}>
        <div class={styles.toolbar}>
          <h2 class={styles.title}>{t('flow.common.allFlows')}</h2>
        </div>
        <div class={styles.tableContainer}>
          <div class={styles.toolbar}>
            <Dropdown
              trigger="click"
              popover-options={{
                clickContentAutoHide: true,
              }}
            >
              {{
                default: () => (
                  <Button theme="primary">
                    <SvgIcon name="add-small" size={22} />
                    {t('flow.content.newFlow')}
                  </Button>
                ),
                content: () => (
                  <Dropdown.DropdownMenu>
                    {newFlowList.value.map((item) => (
                      <Dropdown.DropdownItem
                        key={item.text}
                        onClick={item.handler}
                        class={styles.newFlow}
                      >
                        {item.text}
                      </Dropdown.DropdownItem>
                    ))}
                  </Dropdown.DropdownMenu>
                ),
              }}
            </Dropdown>
            <Button>{t('flow.content.batchManage')}</Button>
            <div class={styles.searchBox}>
              <SearchSelect
                modelValue={searchValue.value}
                data={searchData.value}
                placeholder={searchPlaceHolder.value}
                class={styles.searchInput}
                onUpdate:modelValue={handleSearchChange}
                onSearch={handleSearch}
              />
              <Dropdown
                trigger="click"
                is-show={sortShow.value}
                popover-options={{
                  clickContentAutoHide: true,
                }}
              >
                {{
                  default: () => (
                    <div class={styles.iconSortButton}>
                      <SvgIcon name={currentSortIconName.value} class={styles.sortIcon} size={10} />
                    </div>
                  ),
                  content: () => (
                    <Dropdown.DropdownMenu>
                      {sortList.value.map((item) => (
                        <Dropdown.DropdownItem
                          key={item.id}
                          class={`${styles.sortItem} ${item.active ? styles.active : ''}`}
                          onClick={() => changeSortType(item.id)}
                        >
                          {item.name}
                          <SvgIcon name={item.sortIcon} class={styles.sortItemIcon} size={10} />
                        </Dropdown.DropdownItem>
                      ))}
                    </Dropdown.DropdownMenu>
                  ),
                }}
              </Dropdown>
            </div>
          </div>
          <div class={styles.flowTable} ref={tableContainerRef}>
            <Loading loading={tableLoading.value}>
              <Table
                data={flowTableList.value}
                columns={tableColumn.value}
                max-height={maxHeight.value}
                border={['row', 'outer']}
                pagination={pagination.value}
                onColumnSort={handleSort}
                onPageValueChange={pageChange}
                onPageLimitChange={limitChange}
              >
                {{
                  empty: () => <EmptyTableStatus type="empty" onClear={handleClearSearch} />,
                }}
              </Table>
            </Loading>
          </div>
        </div>

        <NewFlowPopup
          isShow={newFromTemplatePopupShow.value}
          onUpdate:isShow={(val: boolean) => {
            newFromTemplatePopupShow.value = val
          }}
        />

        <ImportFlowPopup
          isShow={importFlowPopupShow.value}
          onUpdate:isShow={(val: boolean) => {
            importFlowPopupShow.value = val
          }}
          onConfirm={importNewContent}
        />

        <AddToGroupPopup
          isShow={isShowAddToDialog.value}
          data={currentActionData.value}
          loading={confirmLoading.value}
          onUpdate:isShow={closeAllDialogs}
          onConfirm={handleAddTo}
        />

        <CopyFlowPopup
          isShow={isShowCopyDialog.value}
          data={currentActionData.value}
          loading={confirmLoading.value}
          onUpdate:isShow={closeAllDialogs}
          onConfirm={handleCopyFlow}
        />

        <SaveAsTemplatePopup
          isShow={isShowSaveAsTemplateDialog.value}
          data={currentActionData.value}
          loading={confirmLoading.value}
          onUpdate:isShow={closeAllDialogs}
          onConfirm={handleSaveAsTemplate}
        />
      </div>
    )
  },
})
