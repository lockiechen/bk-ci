import { defineComponent, onMounted, onUnmounted, ref, computed, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import { ORDER_ENUM, FLOW_SORT_FILED } from '@/utils/flowConst.ts';
import { Button, Table, Loading } from "bkui-vue";
import ExtMenu from '@/components/ExtMenu/index';
import EmptyTableStatus from '@/components/EmptyTable/index';
import { type Flow } from '@/types/index'
import styles from "./FlowTable.module.css";

export const FlowTable = defineComponent({
  name: "FlowTable",
  components: {
    ExtMenu,
    EmptyTableStatus
  },
  props: {
    data: {
      type: Array as PropType<Flow[]>,
      required: true,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    sortType: {
      type: String,
      default: FLOW_SORT_FILED.flowName
    },
    collation: {
      type: String,
      default: ORDER_ENUM.ascending
    },
    pagination: {
      type: Object,
      default: () => ({
        current: 1,
        count: 0,
        limit: 20
      })
    }
  },
  emits: ['sortChange', 'pageChange', 'limitChange', 'clearSearch'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const maxHeight = ref();
    const fieldToSortTypeMap = {
      'name': FLOW_SORT_FILED.flowName,
      'executionTime': FLOW_SORT_FILED.latestBuildStartDate
    };
    const tableContainerRef = ref<HTMLDivElement>();

    const columns = computed(() => [
      {
        label: t('flow.content.name'),
        field: "name",
        sort: {
          value: props.sortType === FLOW_SORT_FILED.flowName && props.collation ? props.collation : null,
          sortScope: 'all'
        }
      },
      { label: t('flow.content.groupName'), field: "groupName" },
      { label: t('flow.content.lastExecution'), field: "lastExecution" },
      {
        label: t('flow.content.executionTime'),
        field: "executionTime",
        sort: {
          value: props.sortType === FLOW_SORT_FILED.latestBuildStartDate && props.collation ? props.collation : null,
          sortScope: 'all'
        }
      },
      {
        label: t('flow.content.actions'),
        field: "actions",
        render: ({ row }: any) => {
          return (
            <div class={styles.actions}>
              <Button text theme="primary">{t('flow.content.execute')}</Button>
              <ExtMenu data={row} config={row.flowAction} />
            </div>
          )
        }
      }
    ]);

    onMounted(() => {
      updateTableHeight()
      window.addEventListener('resize', updateTableHeight)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateTableHeight)
    })

    function updateTableHeight() {
      if (tableContainerRef.value) {
        maxHeight.value = tableContainerRef.value.offsetHeight;
      }
    }

    function handleSort({ column, type }: any) {
      const sortType = fieldToSortTypeMap[column.field];
      const collation = type;
      emit('sortChange', { sortType, collation });
    }

    function handlePageChange(current: number) {
      emit('pageChange', current);
    }

    function handleLimitChange(limit: number) {
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
            columns={columns.value}
            max-height={maxHeight.value}
            border={['row', 'outer']}
            pagination={props.pagination}
            onColumnSort={handleSort}
            onPageValueChange={handlePageChange}
            onPageLimitChange={handleLimitChange}
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