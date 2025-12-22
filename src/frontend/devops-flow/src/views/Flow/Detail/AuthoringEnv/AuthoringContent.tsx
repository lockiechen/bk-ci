import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Select, Tag, Loading } from 'bkui-vue'
import { SvgIcon } from '@/components/SvgIcon'
import styles from './AuthoringEnv.module.css'

export default defineComponent({
  name: 'AuthoringContent',
  components: {
    SvgIcon,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      default: '',
    },
    envList: {
      type: Array,
      default: () => [],
    },
    nodeList: {
      type: Array,
      default: () => [],
    },
    envLoading: {
      type: Boolean,
      default: false,
    },
    nodeLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const selectRef = ref()
    const isPopoverVisible = ref(false)
    const envName = ref(props.modelValue)
    const trigger = ref<'default' | 'manual'>('manual')

    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue !== envName.value) {
          envName.value = newValue
        }
      },
    )

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    function handleClickOutside(event: MouseEvent) {
      if (isPopoverVisible.value && selectRef.value) {
        const selectElement = selectRef.value.$el
        const popoverElement = document.querySelector('.bk-select-search-wrapper')

        const isClickInsideSelect = selectElement?.contains(event.target as Node)
        const isClickInsidePopover = popoverElement?.contains(event.target as Node)

        if (!isClickInsideSelect && !isClickInsidePopover) {
          selectRef.value?.hidePopover()
        }
      }
    }

    function showPopover(event: MouseEvent) {
      const popoverElement = document.querySelector('.bk-select-search-wrapper')
      const isClickInsidePopover = popoverElement?.contains(event.target as Node)

      if (isPopoverVisible.value && !isClickInsidePopover) {
        selectRef.value?.hidePopover()
      } else {
        selectRef.value?.showPopover()
      }
    }

    function handleChange() {
      emit('update:modelValue', envName.value)
    }

    function handlePopoverHide(value: boolean) {
      isPopoverVisible.value = value
    }

    function goEnvironment() {
      console.log('点击，新窗口打开「环境管理」- 对应创作环境的详情页')
    }

    return () => (
      <div class={styles.authoringContent}>
        <p class={styles.authoringHeader} onClick={showPopover}>
          {props.isEdit ? (
            <Select
              ref={selectRef}
              v-model={envName.value}
              filterable
              loading={props.envLoading}
              trigger={trigger.value}
              searchPlaceholder={t('flow.content.searchEnvironment')}
              popoverMinWidth={240}
              onToggle={handlePopoverHide}
              onChange={handleChange}
            >
              {props.envList.map((i: any) => (
                <Select.Option key={i.value} id={i.label} name={i.label}></Select.Option>
              ))}
            </Select>
          ) : (
            <span class={styles.headerText}>{t('flow.content.myAuthoringEnv')}</span>
          )}
        </p>
        {envName.value ? (
          <Loading loading={props.nodeLoading} size="small" class="p-lg">
            <div class={styles.envItem}>
              <p class={styles.envItemTit}>
                {t('flow.content.creationNode')}
                {props.isEdit ? (
                  <span onClick={goEnvironment}>
                    <SvgIcon name="set-line" size={12} class={`cursor-pointer ${styles.setLine}`} />
                  </span>
                ) : null}
              </p>
              <div class={styles.nodeTag}>
                {props.nodeList.length > 0
                  ? props.nodeList.map((node: any) => <Tag key={node.nodeId}>{node.displayName}</Tag>)
                  : '--'}
              </div>
            </div>
            <div class={styles.envItem}>
              <p class={styles.envItemTit}>{t('flow.content.workspace')}</p>
              <div>{t('flow.content.workSpaceDesc')}</div>
            </div>
          </Loading>
        ) : (
          <p class={styles.noData}>{t('flow.content.previewDetailsAfterEnvironmentSelection')}</p>
        )}
      </div>
    )
  },
})
