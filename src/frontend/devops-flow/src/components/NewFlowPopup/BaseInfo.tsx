import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, Input } from 'bkui-vue'
import { SvgIcon } from '@/components/SvgIcon'
import AuthoringContent from '@/components/FlowConfig/AuthoringEnv/AuthoringContent.tsx'
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
    const authoringEnvList = ref([
      {
        value: 'a',
        label: t('flow.content.myAuthoringEnv'),
      },
    ])

    expose({
      formRef,
    })

    watch(
      () => props.modelValue,
      (nv) => {
        baseInfoData.value = nv
      },
    )

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
            modelValue={baseInfoData.value.authoringEnv}
            onUpdate:modelValue={updateAuthoringEnv}
            envList={authoringEnvList.value}
          />
        </div>
      </Form>
    )
  },
})
