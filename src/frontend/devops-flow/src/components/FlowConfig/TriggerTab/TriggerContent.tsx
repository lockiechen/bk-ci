import { defineComponent, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Table, Switcher } from 'bkui-vue';
import EmptyTableStatus from '@/components/EmptyTable/index';

export default defineComponent({
  name: 'TriggerContent',
  components: {
    EmptyTableStatus
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const triggerData = ref([{
      trigger: '手动触发',
      version: '1.latest',
      enable: true
    }])
    const columns = computed(() => [
      {
        label: t('flow.content.groupName'),
        field: "trigger",
        minWidth: 300,
      },
      {
        label: t('flow.content.lastExecution'),
        field: "version",
        minWidth: 300,
      },
      {
        label: t('flow.content.enable'),
        field: "enable",
        width: 220,
        render: ({ row }: any) => {
          return (
            <Switcher
              v-model={row.enable}
              theme="primary"
              style={{'flex-shrink': 0}}
              disabled={!props.isEdit}
            />
          )
        }
      }
    ]);

    return () => (
      <Table
        data={triggerData.value}
        columns={columns.value}
        border={['row', 'outer']}
      >
        {{
          empty: () => <EmptyTableStatus type="empty" onClear={() => emit('clearSearch')} />,
        }}
      </Table>
    );
  }
});