import { defineComponent, ref, computed, watch, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, Input, Select, Checkbox, Button, Message } from 'bkui-vue'
import type { FlowVariable } from '@/types/variable'
import {
  VariableType,
  VariableCategory,
  DEFAULT_VARIABLE_VALUES,
  VARIABLE_TYPE_LIST,
  CONSTANT_TYPE_LIST,
  validateVariableId,
} from '@/types/variable'
import styles from './VariableForm.module.css'
import { SvgIcon } from '@/components/SvgIcon'

const FormItem = Form.FormItem

export default defineComponent({
  name: 'VariableForm',
  props: {
    variable: {
      type: Object as PropType<FlowVariable | null>,
      default: null,
    },
    category: {
      type: String as PropType<VariableCategory>,
      required: true,
    },
    existingIds: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const formRef = ref()
    const formData = ref<FlowVariable>(getInitialFormData())

    // Is editing mode
    const isEditMode = computed(() => !!props.variable)

    // Is constant
    const isConstant = computed(() => props.category === VariableCategory.CONSTANT)

    // Available variable types
    const availableTypes = computed(() => {
      if (isConstant.value) {
        return VARIABLE_TYPE_LIST.filter((item) =>
          CONSTANT_TYPE_LIST.includes(item.id as VariableType),
        )
      }
      return VARIABLE_TYPE_LIST
    })

    // Form rules
    const rules = {
      id: [
        {
          required: true,
          message: t('flow.variable.idRequired'),
          trigger: 'blur',
        },
        {
          validator: (value: string) => {
            if (!validateVariableId(value, isConstant.value)) {
              return false
            }
            return true
          },
          message: isConstant.value ? t('flow.variable.constantIdRule') : t('flow.variable.idRule'),
          trigger: 'blur',
        },
        {
          validator: (value: string) => {
            if (isEditMode.value && value === props.variable?.id) {
              return true
            }
            return !props.existingIds.includes(value)
          },
          message: t('flow.variable.idExists'),
          trigger: 'blur',
        },
      ],
      name: [
        {
          required: true,
          message: t('flow.variable.nameRequired'),
          trigger: 'blur',
        },
      ],
      type: [
        {
          required: true,
          message: t('flow.variable.typeRequired'),
          trigger: 'change',
        },
      ],
    }

    // Initialize form data
    function getInitialFormData(): FlowVariable {
      if (props.variable) {
        return { ...props.variable }
      }
      return {
        ...DEFAULT_VARIABLE_VALUES[VariableType.STRING],
        category: props.category,
      }
    }

    // Watch variable prop changes
    watch(
      () => props.variable,
      (newVal) => {
        formData.value = getInitialFormData()
      },
      { immediate: true },
    )

    // Handle type change
    const handleTypeChange = (value: VariableType) => {
      const defaultData = DEFAULT_VARIABLE_VALUES[value]
      formData.value = {
        ...formData.value,
        type: value,
        defaultValue: defaultData.defaultValue,
        options: defaultData.options || [],
      }
    }

    // Handle save
    const handleSave = async () => {
      try {
        await formRef.value.validate()
        emit('save', formData.value)
      } catch (error) {
        console.error('Form validation failed:', error)
      }
    }

    // Handle cancel
    const handleCancel = () => {
      emit('cancel')
    }

    // Add option for ENUM/MULTIPLE types
    const handleAddOption = () => {
      if (!formData.value.options) {
        formData.value.options = []
      }
      formData.value.options.push({
        id: `option_${Date.now()}`,
        label: '',
      })
    }

    // Remove option
    const handleRemoveOption = (index: number) => {
      formData.value.options?.splice(index, 1)
    }

    // Show options editor
    const showOptionsEditor = computed(() => {
      return (
        formData.value.type === VariableType.ENUM || formData.value.type === VariableType.MULTIPLE
      )
    })

    return () => (
      <div class={styles.variableForm}>
        <Form ref={formRef} model={formData.value} rules={rules} labelWidth={120}>
          <FormItem label={t('flow.variable.id')} property="id" required>
            <Input
              v-model={formData.value.id}
              placeholder={
                isConstant.value
                  ? t('flow.variable.constantIdPlaceholder')
                  : t('flow.variable.idPlaceholder')
              }
              disabled={isEditMode.value || !props.editable}
            />
          </FormItem>

          <FormItem label={t('flow.variable.name')} property="name" required>
            <Input
              v-model={formData.value.name}
              placeholder={t('flow.variable.namePlaceholder')}
              disabled={!props.editable}
            />
          </FormItem>

          <FormItem label={t('flow.variable.type')} property="type" required>
            <Select
              v-model={formData.value.type}
              onChange={handleTypeChange}
              disabled={!props.editable}
            >
              {availableTypes.value.map((type) => (
                <Select.Option key={type.id} value={type.id} label={type.name}>
                  {type.name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>

          <FormItem label={t('flow.variable.defaultValue')}>
            {formData.value.type === VariableType.BOOLEAN ? (
              <Checkbox v-model={formData.value.defaultValue} disabled={!props.editable}>
                {String(formData.value.defaultValue)}
              </Checkbox>
            ) : formData.value.type === VariableType.TEXTAREA ? (
              <Input
                v-model={formData.value.defaultValue}
                type="textarea"
                rows={3}
                placeholder={t('flow.variable.defaultValuePlaceholder')}
                disabled={!props.editable}
              />
            ) : formData.value.type === VariableType.ENUM ? (
              <Select v-model={formData.value.defaultValue} disabled={!props.editable}>
                {formData.value.options?.map((option) => (
                  <Select.Option key={option.id} value={option.id} label={option.label}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            ) : formData.value.type === VariableType.MULTIPLE ? (
              <Select v-model={formData.value.defaultValue} multiple disabled={!props.editable}>
                {formData.value.options?.map((option) => (
                  <Select.Option key={option.id} value={option.id} label={option.label}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <Input
                v-model={formData.value.defaultValue}
                placeholder={t('flow.variable.defaultValuePlaceholder')}
                disabled={!props.editable}
              />
            )}
          </FormItem>

          {showOptionsEditor.value && (
            <FormItem label={t('flow.variable.options')}>
              <div class={styles.optionsEditor}>
                {formData.value.options?.map((option, index) => (
                  <div key={option.id} class={styles.optionItem}>
                    <Input
                      v-model={option.id}
                      placeholder={t('flow.variable.optionId')}
                      disabled={!props.editable}
                      class={styles.optionInput}
                    />
                    <Input
                      v-model={option.label}
                      placeholder={t('flow.variable.optionLabel')}
                      disabled={!props.editable}
                      class={styles.optionInput}
                    />
                    {props.editable && (
                      <i class="bk-icon icon-close" onClick={() => handleRemoveOption(index)}></i>
                    )}
                  </div>
                ))}
                {props.editable && (
                  <Button text onClick={handleAddOption}>
                    <SvgIcon name="add-small" />
                    {t('flow.variable.addOption')}
                  </Button>
                )}
              </div>
            </FormItem>
          )}

          <FormItem label={t('flow.variable.description')}>
            <Input
              v-model={formData.value.desc}
              type="textarea"
              rows={2}
              placeholder={t('flow.variable.descriptionPlaceholder')}
              disabled={!props.editable}
            />
          </FormItem>

          {props.category === VariableCategory.INPUT && (
            <>
              <FormItem>
                <Checkbox v-model={formData.value.required} disabled={!props.editable}>
                  {t('flow.variable.showOnExec')}
                </Checkbox>
              </FormItem>
              {formData.value.required && (
                <FormItem>
                  <Checkbox v-model={formData.value.valueNotEmpty} disabled={!props.editable}>
                    {t('flow.variable.required')}
                  </Checkbox>
                </FormItem>
              )}
            </>
          )}

          {props.editable && (
            <FormItem>
              <div class={styles.formActions}>
                <Button theme="primary" onClick={handleSave}>
                  {t('save')}
                </Button>
                <Button onClick={handleCancel}>{t('cancel')}</Button>
              </div>
            </FormItem>
          )}
        </Form>
      </div>
    )
  },
})
