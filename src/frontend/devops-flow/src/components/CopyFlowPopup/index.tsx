import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Dialog, Loading, Form, Input, Select } from 'bkui-vue'
import { SvgIcon } from '@/components/SvgIcon'
import FlowLableSelector from '@/components/FlowLableSelector'
import { type CopyFlowParams } from '@/api/flowContentList'
import { useFlowGroupData } from '@/hooks/useFlowGroupData'
import { useFlowListData } from '@/hooks/useFlowListData'
import styles from './CopyFlowPopup.module.css'

interface FormFieldConfig {
  property: keyof CopyFlowParams
  label: string
  maxlength?: number
  component: string
  props?: Record<string, any>
}

export default defineComponent({
  name: 'CopyFlowPopup',
  components: {
    SvgIcon,
    FlowLableSelector,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:isShow', 'confirm'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const { getMatchDynamicData, getProjectTagList } = useFlowListData()
    const {
      flowGroups: dynamicGroupList,
      personalFlowGroups,
      projectFlowGroups,
    } = useFlowGroupData()
    const initFormData = () => {
      return {
        name: '',
        desc: '',
        labels: [],
        dynamicGroup: [],
        staticView: [],
      }
    }
    const formData = ref<CopyFlowParams>(initFormData())
    const dynamicLoading = ref(false)
    const staticViewList = computed(() => {
      const personalList = personalFlowGroups.value || []
      const projectList = projectFlowGroups.value.filter((item) => item.id !== 'unclassified') || []
      return [
        {
          id: 'personal',
          groupName: '我的创作流组',
          count: personalList.length || 0,
          children: personalList,
        },
        {
          id: 'project',
          groupName: '项目创作流组',
          count: projectList.length || 0,
          children: projectList,
        },
      ]
    })
    const tagGroupList = ref()
    const tagsLoading = ref(false)
    const labelSelectorRef = ref()

    const formFields = computed((): FormFieldConfig[] => [
      {
        property: 'name',
        label: t('flow.dialog.copyCreation.name'),
        maxlength: 128,
        component: 'Input',
        props: {
          placeholder: t('flow.content.inputFlowName'),
        },
      },
      {
        property: 'desc',
        label: t('flow.dialog.copyCreation.desc'),
        maxlength: 30,
        component: 'Input',
        props: {
          placeholder: t('flow.dialog.copyCreation.desc'),
        },
      },
      {
        property: 'labels',
        label: t('flow.dialog.copyCreation.labels'),
        component: 'Custom',
      },
      {
        property: 'dynamicGroup',
        label: t('flow.dialog.copyCreation.dynamicPipelineGroup'),
        component: 'Select',
        props: {
          disabled: true,
          multiple: true,
          loading: dynamicLoading.value,
          searchPlaceholder: t('flow.dialog.copyCreation.dynamicMatchPlaceholder'),
        },
      },
      {
        property: 'staticView',
        label: t('flow.dialog.copyCreation.staticPipelineGroup'),
        component: 'Select',
        props: {
          multiple: true,
          searchPlaceholder: t('flow.dialog.copyCreation.dynamicMatchPlaceholder'),
        },
      },
    ])

    watch(
      () => props.isShow,
      (newVal) => {
        if (newVal) {
          const name = props.data?.name ? `${props.data.name}_copy` : ''
          formData.value.name = name
          getDynamicGroup()
          handleRefresh()
        }
      },
    )

    const getDynamicGroup = async (labelIds: string[] = []) => {
      dynamicLoading.value = true
      try {
        const params = {
          labelIds,
          flowName: formData.value.name,
        }
        const res = await getMatchDynamicData(params)
        formData.value.dynamicGroup = res
      } catch (error) {
        console.log('error:', error)
      } finally {
        dynamicLoading.value = false
      }
    }

    const onClose = () => {
      formData.value = initFormData()
      emit('update:isShow', false)
    }

    const onConfirm = async () => {
      emit('confirm', props.data.id, formData.value)
      onClose()
    }

    const handleAddLabel = () => {
      // TODO:跳转到标签设置页
    }

    const handleRefresh = async () => {
      // 清空标签数据
      formData.value.labels = []
      if (labelSelectorRef.value && labelSelectorRef.value.clearLabels) {
        labelSelectorRef.value.clearLabels()
      }

      // TODO:获取label数据,projectId替换为真实projectId
      tagsLoading.value = true
      try {
        const res = await getProjectTagList('projectId')
        tagGroupList.value = res
      } catch (error) {
        console.log('error:', error)
      } finally {
        tagsLoading.value = false
      }
    }

    const updateDynamicGroup = (labelIds: string[]) => {
      formData.value.labels = labelIds
      getDynamicGroup(labelIds)
    }

    const renderFormField = (field: FormFieldConfig) => {
      if (field.component === 'Custom') {
        return (
          <Form.FormItem property={field.property} label={field.label}>
            {{
              label: () => (
                <div class={['flex-between', styles.labelTitle]}>
                  <p>{t('flow.dialog.copyCreation.labels')}</p>
                  <p class={['flex-between', styles.actions]}>
                    <span class={['flex-between', styles.newLabel]} onClick={handleAddLabel}>
                      <SvgIcon name="add-small" size={24} />
                      {t('flow.dialog.copyCreation.addLabel')}
                    </span>
                    <span class={['flex-between', styles.refresh]} onClick={handleRefresh}>
                      <SvgIcon name="refresh-line" size={14} />
                      {t('flow.actions.refresh')}
                    </span>
                  </p>
                </div>
              ),
              default: () => (
                <FlowLableSelector
                  ref={labelSelectorRef}
                  class={styles.labelContent}
                  loading={tagsLoading.value}
                  tagGroupList={tagGroupList.value}
                  editable={true}
                  onChange={updateDynamicGroup}
                />
              ),
            }}
          </Form.FormItem>
        )
      }

      if (field.component === 'Select') {
        return (
          <Form.FormItem property={field.property} label={field.label}>
            <Select v-model={formData.value[field.property]} {...field.props}>
              {field.property === 'dynamicGroup'
                ? dynamicGroupList.value.map((i: any) => (
                    <Select.Option key={i.id} id={i.id} name={i.name}></Select.Option>
                  ))
                : staticViewList.value.map((item: any) => (
                    <Select.Group key={item.id} label={item.groupName} collapsible>
                      {item.children.map((flow: any) => (
                        <Select.Option key={flow.id} id={flow.id} name={flow.name}></Select.Option>
                      ))}
                    </Select.Group>
                  ))}
            </Select>
          </Form.FormItem>
        )
      }

      return (
        <Form.FormItem property={field.property} label={field.label} maxlength={field.maxlength}>
          <Input v-model={formData.value[field.property]} {...field.props}></Input>
        </Form.FormItem>
      )
    }

    return () => (
      <Dialog
        is-show={props.isShow}
        title={t('flow.content.copyCreationFlow')}
        quick-close={false}
        class={styles.copyFlowPopup}
        onClosed={onClose}
        onConfirm={onConfirm}
      >
        <Loading loading={props.loading} size="small">
          <Form model={formData.value} form-type="vertical">
            {formFields.value.map((field) => renderFormField(field))}
          </Form>
        </Loading>
      </Dialog>
    )
  },
})
