import { defineComponent, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { Dialog, Upload, Message } from 'bkui-vue';
import { useRouter } from 'vue-router';
import styles from "./ImportFlowPopup.module.css";
import { CODE_MODE, UI_MODE } from '@/utils/flowConst'

export default defineComponent({
  name: 'ImportFlowPopup',
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String
    },
    handleImportSuccess: {
      type: Function
    }
  },
  emits: ['update:isShow', 'confirm'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const router = useRouter();

    function checkJsonValid(json: any) {
      try {
        return (json.model.stages && json.setting.flowName) || json.stages
      } catch (e) {
        return false
      }
    }

    async function handleSuccess(result: any, type = UI_MODE) {
      let res

      if (res) {
        if (typeof props.handleImportSuccess === 'function') {
          props.handleImportSuccess()
          return
        }

        nextTick(() => {
          router.push({
            name: 'flowImportEdit',
            params: {
              tab: 'flow'
            }
          })
        })
      }
    }

    function handleSelect({ file, onProgress, onSuccess, onComplete }: any) {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.addEventListener('loadend', async e => {
        try {
          if (file.type === 'application/json' || file.name.endsWith('.json')) {
            const jsonResult = JSON.parse(reader.result as string)
            const isValid = checkJsonValid(jsonResult)
            const code = isValid ? 0 : 1
            const message = isValid ? null : t('flow.content.invalidFlowJson')

            onSuccess({
              code,
              message,
              result: jsonResult
            }, file)

            if (isValid) {
              handleSuccess(jsonResult, UI_MODE)
            }
          }
        } catch (e) {
          onSuccess({
            code: 1,
            message: t('flow.content.invalidFlowJson'),
            result: ''
          }, file)
        } finally {
          onComplete(file)
        }
      })
      reader.addEventListener('progress', onProgress)
    }

    function handleConfirm() {
      emit('confirm');
      handleClose();
    }

    function handleClose() {
      emit('update:isShow', false)
    }

    return () => (
      <Dialog
        is-show={props.isShow}
        theme="primary"
        width={640}
        title={props.title || t('flow.content.importFlow')}
        confirm-text={t('flow.content.import')}
        quick-close={false}
        onClosed={handleClose}
        onConfirm={handleConfirm}
      >
        {{
          default: () => (
            <>
              <span class={`${styles.label} ${styles.desc}`}>{t('flow.content.importFlowLabel')}</span>
              <Upload
                v-if={props.isShow}
                accept=".json, application/json"
                with-credentials={true}
                custom-request={handleSelect}
                class={styles.upload}
              >
              </Upload>
              <span class={styles.desc}>{t('flow.content.importFlowTip')}</span>
            </>
          )
        }}
      </Dialog>
    );
  },
});
