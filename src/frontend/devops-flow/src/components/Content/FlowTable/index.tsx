import { defineComponent, ref, computed, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import { ORDER_ENUM, FLOW_SORT_FILED } from '@/utils/flowConst.ts';
import { Button, Table, Loading } from "bkui-vue";
import type { Column } from 'bkui-vue/lib/table/props';
import ExtMenu from '@/components/ExtMenu/index';
import EmptyTableStatus from '@/components/EmptyTable/index';
import { type ContentTableItem } from '@/api/flowContentList'
import { useTableHeight } from '@/hooks/useTableHeight';
import styles from "./FlowTable.module.css";

export const FlowTable = defineComponent({
  name: "FlowTable",
  components: {
    ExtMenu,
    EmptyTableStatus
  },
  props: {
    data: {
      type: Array as PropType<ContentTableItem[]>,
      required: true,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object as PropType<{
        current: number;
        count: number;
        limit: number;
      }>,
      required: true
    },
    currentSortType: {
      type: String,
      required: true
    },
    currentCollation: {
      type: String,
      required: true
    }
  },
  emits: ['clearSearch', 'sortChange', 'pageChange', 'limitChange'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const tableContainerRef = ref<HTMLDivElement>();
    const { maxHeight } = useTableHeight(tableContainerRef);
    const fieldToSortTypeMap: Record<string, string> = {
      'name': FLOW_SORT_FILED.flowName,
      'latestBuildStartTime': FLOW_SORT_FILED.latestBuildStartDate
    };

    const tableColumn = computed(() => [
      {
        label: t('flow.content.name'),
        field: "name",
        sort: {
          value: props.currentSortType === FLOW_SORT_FILED.flowName && props.currentCollation ? props.currentCollation : null,
          sortScope: 'all'
        }
      },
      { label: t('flow.content.groupName'), field: "viewNames" },
      { label: t('flow.content.lastExecution'), field: "latestBuildStatus" },
      {
        label: t('flow.content.executionTime'),
        field: "latestBuildStartTime",
        sort: {
          value: props.currentSortType === FLOW_SORT_FILED.latestBuildStartDate && props.currentCollation ? props.currentCollation : null,
          sortScope: 'all'
        }
      },
      {
        label: t('flow.content.actions'),
        field: "actions",
        render: ({ row }: any) => (
            <div class={styles.actions}>
              <Button text theme="primary" onClick={() => row.handleExecute(row)}>{t('flow.content.execute')}</Button>
              <ExtMenu data={row} config={row.flowAction} />
            </div>
          )
      }
    ] as Column[]);

    function handleSort({ column, type }: any) {
      const sortType = fieldToSortTypeMap[column.field];
      const collation = type;
      emit('sortChange', { sortType, collation });
    }

    function pageChange(current: number) {
      emit('pageChange', current);
    }

    function limitChange(limit: number) {
      emit('limitChange', limit);
    }

    return () => (
      <div
        class={styles.flowTable}
        ref={tableContainerRef}
      >
        <Loading loading={props.loading}>
          <Table
            data={props.data}
            columns={tableColumn.value}
            max-height={maxHeight.value}
            border={['row', 'outer']}
            pagination={props.pagination}
            onColumnSort={handleSort}
            onPageValueChange={pageChange}
            onPageLimitChange={limitChange}
          >
            {{
              empty: () => <EmptyTableStatus type="empty" onClear={() => emit('clearSearch')} />,
            }}
          </Table>
        </Loading>
      </div>
    );
  },
});