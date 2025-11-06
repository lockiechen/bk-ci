import { useI18n } from "vue-i18n";
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { Button, Input, Dropdown } from "bkui-vue";
import { type Flow } from '@/types/index'
import styles from "./Content.module.css";
import { FlowTable } from "./FlowTable";
import { SvgIcon } from "@/components/SvgIcon";
import ImportFlowPopup from '@/components/ImportFlowPopup'
import NewFlowPopup from './NewFlowPopup'

import { ORDER_ENUM, FLOW_SORT_FILED } from '@/utils/flowConst.ts';
// import { statusIconMap } from '@/utils/flowStatus'

export const Content = defineComponent({
  name: "Content",
  components: {
    SvgIcon,
    ImportFlowPopup,
  },  
  props: {
    groupId: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();

    const sortShow = ref(false);
    const currentSortType = ref((route.query.sortType as string) || localStorage.getItem('flowSortType') || FLOW_SORT_FILED.flowName);
    const currentCollation = ref((route.query.collation as string) || localStorage.getItem('flowSortCollation') || ORDER_ENUM.ascending);
    const currentSortIconName = computed(() => getSortIconName(currentSortType.value));

    const tableLoading = ref(false);
    const flowList = ref<Flow[]>([]);
    const pagination = ref({
      current: 1,
      count: 0,
      limit: 20
    });

    const sortList = computed(() => {
      return [
        {
          id: FLOW_SORT_FILED.flowName,
          name: t('flow.content.orderByAlpha')
        }, {
          id: FLOW_SORT_FILED.createTime,
          name: t('flow.content.orderByCreateTime')
        }, {
          id: FLOW_SORT_FILED.updateTime,
          name: t('flow.content.orderByUpdateTime')
        }, {
          id: FLOW_SORT_FILED.latestBuildStartDate,
          name: t('flow.content.orderByExecuteTime')
        }
      ].map(sort => ({
        ...sort,
        active: isActiveSort(sort.id),
        sortIcon: getSortIconName(sort.id)
      }))
    });

    const newFlowList = computed(() => [
      {
        text: t('flow.content.newFromTemplate'),
        handler: handleNewFromTemplate
      },
      {
        text: t('flow.content.importFlow'),
        handler: handleImportFlow
      }
    ]);

    const newFromTemplatePopupShow = ref(false);
    const importFlowPopupShow = ref(false);

    watch([currentSortType, currentCollation], () => {
      fetchFlowList();
      updateQuery();
    });

    onMounted(() => {
      fetchFlowList();
      updateQuery();
    });

    async function fetchFlowList() {
      tableLoading.value = true;
      try {
        const params = {
          page: pagination.value.current,
          pageSize: pagination.value.limit,
          sortType: currentSortType.value,
          collation: currentCollation.value
        };
        // 这里调用实际的接口
        // const response = await flowApi.getFlowList({
        //   sortType: currentSortType.value,
        //   collation: currentCollation.value
        // });
        // flowList.value = response.data;
        setTimeout(() => {
          // 模拟数据 - 后续替换为实际接口调用
          flowList.value = [
            {
              id: 1,
              name: 'CI流水线',
              groupName: '5',
              lastExecution: '成功',
              executionTime: '2024-01-13 10:30',
              status: '运行中',
              creator: '张三',
              updateTime: '2024-01-13 10:30',
            },
            {
              id: 2,
              name: 'A部署流程',
              groupName: '2',
              lastExecution: '失败',
              executionTime: '2024-01-14 16:45',
              status: '已停止',
              creator: '李四',
              updateTime: '2024-01-14 16:45'
            },
            {
              id: 3,
              name: '部署流程',
              groupName: '3',
              lastExecution: '失败',
              executionTime: '2024-01-16 16:45',
              status: '已停止',
              creator: '李屋',
              updateTime: '2024-01-16 16:45'
            },
          ].map(item => ({
            ...item,
            flowAction: [{
              text: t('flow.content.disable') || t('flow.content.enable'),
              handler: handleFn
            }, {
              text: t('flow.content.addTo'),
              tooltips: '66666666',
              handler: handleFn
            }, {
              text: t('flow.content.copyCreationFlow'),
              handler: handleFn
            }, {
              text: t('flow.content.saveAsTemplate'),
              handler: handleFn
            }, {
              text: t('flow.content.delete'),
              handler: handleFn
            }
            ]
          }))
          tableLoading.value = false;
        }, 1000);
      } catch (error) {
        console.error('获取流程列表失败:', error);
      }
    }

    function handleFn(row: Flow) {
      console.log(1111111, row);
    }

    function handleClearSearch() {
      console.log('清空搜索条件');
    }

    function handleNewFromTemplate() {
      console.log('从模板新建创作流');
      newFromTemplatePopupShow.value = !newFromTemplatePopupShow.value
    }

    function handleImportFlow() {
      console.log('导入创作流');
      importFlowPopupShow.value = !importFlowPopupShow.value
    }

    function updateQuery() {
      const queryParams: any = {
        ...route.query,
        sortType: currentSortType.value,
        ...(currentCollation.value ? { collation: currentCollation.value } : {})
      };
      router.push({
        query: queryParams
      });
    }

    function isActiveSort(sortType: string) {
      return currentSortType.value === sortType;
    }

    function getSortIconName(sortType: string) {
      if (isActiveSort(sortType) && currentCollation.value && currentCollation.value !== 'null') {
        return `sort-${currentCollation.value.toLowerCase()}`;
      }
      return 'sort';
    }

    function changeSortType(sortType: string) {
      if (sortType === currentSortType.value) {
        currentCollation.value = currentCollation.value === ORDER_ENUM.descending ? ORDER_ENUM.ascending : ORDER_ENUM.descending;
      } else {
        switch (sortType) {
          case FLOW_SORT_FILED.flowName:
            currentCollation.value = ORDER_ENUM.ascending;
            break;
          case FLOW_SORT_FILED.createTime:
          case FLOW_SORT_FILED.updateTime:
          case FLOW_SORT_FILED.latestBuildStartDate:
            currentCollation.value = ORDER_ENUM.descending;
            break;
        }
        currentSortType.value = sortType;
        sortShow.value = false;
      }

      localStorage.setItem('flowSortType', currentSortType.value);
      localStorage.setItem('flowSortCollation', currentCollation.value);

      updateQuery();
    }

    function handleTableSortChange({ sortType, collation }: { sortType: string, collation: string }) {
      currentSortType.value = sortType;
      currentCollation.value = collation;

      localStorage.setItem('flowSortType', sortType);
      localStorage.setItem('flowSortCollation', collation);
      updateQuery();
    }

    function handlePageChange(current: number) {
      pagination.value.current = current;
      fetchFlowList();
    }

    function handleLimitChange(limit: number) {
      pagination.value.limit = limit;
      pagination.value.current = 1;
      fetchFlowList();
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
                    <SvgIcon
                      name='add-small'
                      size={22}
                    />
                    {t('flow.content.newFlow')}
                  </Button>
                ),
                content: () => (
                  <Dropdown.DropdownMenu>
                    {
                      newFlowList.value.map(item => (
                        <Dropdown.DropdownItem
                          key={item.text}
                          onClick={item.handler}
                          class={styles.newFlow}
                        >
                          {item.text}
                        </Dropdown.DropdownItem>
                      ))
                    }
                  </Dropdown.DropdownMenu>
                ),
              }}
            </Dropdown>
            <Button>{t('flow.content.batchManage')}</Button>
            <div class={styles.searchBox}>
              <Input
                placeholder={t('flow.content.searchPlaceholder')}
                left-icon="search"
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
                      <SvgIcon
                        name={currentSortIconName.value}
                        class={styles.sortIcon}
                        size={10}
                      />
                    </div>
                  ),
                  content: () => (
                    <Dropdown.DropdownMenu>
                      {
                        sortList.value.map(item => (
                          <Dropdown.DropdownItem
                            key={item.id}
                            class={`${styles.sortItem} ${item.active ? styles.active : ''}`}
                            onClick={() => changeSortType(item.id)}
                          >
                            {item.name}
                            <SvgIcon
                              name={item.sortIcon}
                              class={styles.sortItemIcon}
                              size={10}
                            />
                          </Dropdown.DropdownItem>
                        ))
                      }
                    </Dropdown.DropdownMenu>
                  ),
                }}
              </Dropdown>
            </div>
          </div>
          <FlowTable
            data={flowList.value}
            loading={tableLoading.value}
            sortType={currentSortType.value}
            collation={currentCollation.value}
            pagination={pagination.value}
            onSortChange={handleTableSortChange}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onClearSearch={handleClearSearch}
          />
        </div>

        <NewFlowPopup
          v-model={newFromTemplatePopupShow.value}
        />

        <ImportFlowPopup
          v-model={importFlowPopupShow.value}
        />
      </div>
    );
  },
});
