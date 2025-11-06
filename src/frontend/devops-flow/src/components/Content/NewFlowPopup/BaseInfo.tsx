import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, Input} from 'bkui-vue';
import { SvgIcon } from "@/components/SvgIcon";
import AuthoringContent from "@/components/FlowConfig/AuthoringEnv/AuthoringContent.tsx";
import styles from "./Index.module.css";

export default defineComponent({
  name: 'BaseInfo',
  components: {
    SvgIcon,
    AuthoringContent
  },
  props: {
    modelValue: {
      type: Boolean
    }
  },
  emits: ['update:modelValue'],
  setup() {
    const { t } = useI18n();
    const formRef = ref();
    const FormData = ref({
      flowName: '',
      desc: ''
    });

    return () => (
      <Form
        class={styles.baseInfo}
        ref={formRef.value}
        model={FormData.value}
        form-type="vertical"
      >
        <div class={styles.baseItem}>
          <p class={styles.baseTitle}>{t('flow.content.basicInfo')}</p>
          <Form.FormItem
            label={t('flow.content.flowName')}
            property="flowName"
            placeholder={t('flow.content.inputFlowName')}
            required
          >
            <Input
              v-model={FormData.value.flowName}
            ></Input>
          </Form.FormItem>
          <Form.FormItem
            label={t('flow.content.description')}
            property="desc"
          >
            <Input
              v-model={FormData.value.desc}
              type="textarea"
            ></Input>
          </Form.FormItem>
        </div>
        <div class={styles.baseItem}>
          <p class={styles.baseTitle}>
            <span>{t('flow.content.creationEnvironment')}</span>
            <span class={styles.titleSet}>
              <SvgIcon
                name='jump'
                size={12}
                class={styles.jumpIcon}
              />
              {t('flow.content.environmentManagement')}
            </span>
          </p>
          <AuthoringContent
            isEdit={true}
          />
        </div>
      </Form>
    );
  },
});