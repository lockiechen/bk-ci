import { defineComponent, defineAsyncComponent, type PropType } from 'vue'
import { Form } from 'bkui-vue'
const { FormItem } = Form
import type { Container, Element } from '@/api/flowModel'
import { rely } from '@/utils/atom'

// 动态导入组件
const VuexInput = defineAsyncComponent(() => import('./VuexInput'))
const VuexTextarea = defineAsyncComponent(() => import('./VuexTextarea'))
const Selector = defineAsyncComponent(() => import('./Selector'))
const AtomCheckbox = defineAsyncComponent(() => import('./AtomCheckbox'))
const EnumInput = defineAsyncComponent(() => import('./EnumInput'))
const KeyValueMap = defineAsyncComponent(() => import('./KeyValueMap'))
const AtomAceEditor = defineAsyncComponent(() => import('./AtomAceEditor'))
const AtomCheckboxList = defineAsyncComponent(() => import('./AtomCheckboxList'))
const StaffInput = defineAsyncComponent(() => import('./StaffInput'))
const AtomDatePicker = defineAsyncComponent(() => import('./AtomDatePicker'))

// 组件映射表
const COMPONENT_MAP: Record<string, any> = {
  'vuex-input': VuexInput,
  'vuex-textarea': VuexTextarea,
  selector: Selector,
  'atom-checkbox': AtomCheckbox,
  'enum-input': EnumInput,
  'key-value': KeyValueMap,
  'key-value-normal': KeyValueMap,
  'atom-ace-editor': AtomAceEditor,
  'atom-checkbox-list': AtomCheckboxList,
  'staff-input': StaffInput,
  'company-staff-input': StaffInput,
  'atom-date-picker': AtomDatePicker,
  // 兼容旧配置的名称
  input: VuexInput,
  textarea: VuexTextarea,
  select: Selector,
  checkbox: AtomCheckbox,
  radio: EnumInput,
  'checkbox-list': AtomCheckboxList,
  'user-input': StaffInput,
  'date-picker': AtomDatePicker,
  'time-picker': AtomDatePicker,
  'code-editor': AtomAceEditor,
}

export default defineComponent({
  name: 'AtomForm',
  props: {
    atomPropsModel: {
      type: Object,
      default: () => ({}),
    },
    atomValue: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    element: {
      type: Object as PropType<Element>,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const handleChange = (name: string, value: any) => {
      emit('change', name, value)
    }

    // 判断字段是否隐藏
    const isHidden = (obj: any, element: any) => {
      try {
        // 1. rely 检查 (依赖于当前表单值)
        if (!rely(obj, props.atomValue)) {
          return true
        }

        if (typeof obj.isHidden === 'function') {
          return obj.isHidden(element)
        }

        if (typeof obj.isHidden === 'string') {
          // 注意：eval 在严格模式下受限，且有安全风险。
          // 但在迁移旧逻辑时，如果后端返回的是字符串函数，可能需要这种处理。
          // 这里暂时只支持布尔值和简单判断，复杂逻辑建议在后端处理或通过其他方式。
          // 如果必须支持 eval，需要非常小心。暂不实现 eval。
          return false
        }

        if (typeof obj.hidden === 'boolean') {
          return obj.hidden
        }

        return false
      } catch (error) {
        console.error('Error in isHidden:', error)
        return false
      }
    }

    // 获取默认值
    const getPlaceholder = (obj: any) => {
      return obj.placeholder || obj.desc || ''
    }

    return () => (
      <Form formType="vertical">
        {Object.entries(props.atomPropsModel).map(([key, obj]: [string, any]) => {
          if (isHidden(obj, props.element)) return null

          const Component = COMPONENT_MAP[obj.component] || COMPONENT_MAP[obj.type] || VuexInput
          const value = props.atomValue[key] ?? obj.default ?? ''

          return (
            <FormItem
              key={key}
              label={obj.label}
              required={obj.required}
              property={key}
              description={obj.desc}
            >
              <Component
                name={key}
                value={value}
                disabled={props.disabled}
                placeholder={getPlaceholder(obj)}
                handleChange={handleChange}
                {...obj}
              />
            </FormItem>
          )
        })}
      </Form>
    )
  },
})
