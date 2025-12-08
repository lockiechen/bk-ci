import { defineComponent, computed } from 'vue'
import { Select } from 'bkui-vue'
const { Option } = Select

export default defineComponent({
  name: 'Selector',
  props: {
    value: {
      type: [String, Number, Array, Boolean],
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    list: {
      type: Array as PropType<Array<{ id: string | number; name: string; disabled?: boolean }>>,
      default: () => [],
    },
    handleChange: {
      type: Function,
      default: () => () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    multiSelect: {
      type: Boolean,
      default: false,
    },
    displayKey: {
      type: String,
      default: 'name',
    },
    settingKey: {
      type: String,
      default: 'id',
    },
  },
  emits: ['change', 'update:value'],
  setup(props, { emit }) {
    const handleChange = (value: string | number | Array<string | number>) => {
      emit('update:value', value)
      emit('change', value)
      props.handleChange(props.name, value)
    }

    return () => (
      <Select
        modelValue={props.value}
        disabled={props.disabled}
        placeholder={props.placeholder}
        multiple={props.multiSelect}
        onChange={handleChange}
      >
        {props.list.map((item: any) => (
          <Option
            key={item[props.settingKey]}
            value={item[props.settingKey]}
            label={item[props.displayKey]}
            disabled={item.disabled}
          />
        ))}
      </Select>
    )
  },
})
