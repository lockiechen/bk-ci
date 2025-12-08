import { defineComponent, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, Input } from 'bkui-vue'
import { SvgIcon } from '@/components/SvgIcon'
import AuthoringContent from '@/views/Flow/Detail/AuthoringEnv/AuthoringContent'
import { useNewFlow } from '@/hooks/useNewFlow'
import styles from './Index.module.css'

export default defineComponent({
  name: 'BaseInfo',
  components: {
    SvgIcon,
    AuthoringContent,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        flowName: '',
        desc: '',
        authoringEnv: '',
      }),
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, expose }) {
    const { t } = useI18n()
    const formRef = ref()
    const baseInfoData = ref({ ...props.modelValue })
    const {
      authoringEnvList,
      authoringNodeList,
      envListLoading,
      nodeListLoading,
      fetchAuthoringEnvList,
      fetchAuthoringNodeList,
    } = useNewFlow()

    expose({
      formRef,
    })

    watch(
      () => props.modelValue,
      (nv) => {
        baseInfoData.value = nv
      },
    )

    /**
     * 监听创作环境变化，获取对应的创作节点列表
     */
    watch(
      () => baseInfoData.value.authoringEnv,
      (newEnv) => {
        if (newEnv) {
          const selectedEnv = authoringEnvList.value.find((env) => env.id === newEnv)
          if (selectedEnv) {
            fetchAuthoringNodeList(selectedEnv.name)
          }
        } else {
          authoringNodeList.value = []
        }
      },
    )

    onMounted(() => {
      fetchAuthoringEnvList()
    })

    function handleChange() {
      emit('update:modelValue', baseInfoData.value)
    }

    function updateAuthoringEnv(env: string) {
      baseInfoData.value.authoringEnv = env
      handleChange()
    }

    return () => (
      <Form class={styles.baseInfo} ref={formRef} model={baseInfoData.value} form-type="vertical">
        <div class={styles.baseItem}>
          <p class={styles.baseTitle}>{t('flow.content.basicInfo')}</p>
          <Form.FormItem
            label={t('flow.content.name')}
            property="flowName"
            required
            maxlength={128}
          >
            <Input
              v-model={baseInfoData.value.flowName}
              onChange={handleChange}
              placeholder={t('flow.content.inputFlowName')}
            ></Input>
          </Form.FormItem>
          <Form.FormItem label={t('flow.content.description')} property="desc">
            <Input
              v-model={baseInfoData.value.desc}
              onChange={handleChange}
              type="textarea"
            ></Input>
          </Form.FormItem>
        </div>
        <div class={styles.baseItem}>
          <p class={styles.baseTitle}>
            <span>{t('flow.content.creationEnvironment')}</span>
            <span class={styles.titleSet}>
              <SvgIcon name="jump" size={12} class={styles.jumpIcon} />
              {t('flow.content.environmentManagement')}
            </span>
          </p>
          <AuthoringContent
            isEdit={true}
            envLoading={envListLoading.value}
            nodeLoading={nodeListLoading.value}
            modelValue={baseInfoData.value.authoringEnv}
            onUpdate:modelValue={updateAuthoringEnv}
            envList={authoringEnvList.value}
            nodeList={authoringNodeList.value}
          />
        </div>
      </Form>
    )
  },
})
