import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Dialog, Loading } from 'bkui-vue'
import { SvgIcon } from '@/components/SvgIcon'
import styles from './AddToGroupPopup.module.css'

export default defineComponent({
  name: 'AddToGroupPopup',
  components: {
    SvgIcon,
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

    const onClose = () => {
      emit('update:isShow', false)
    }

    const onConfirm = () => {
      emit('confirm', props.data.id, 666)
    }

    return () => (
      <Dialog
        is-show={props.isShow}
        title={t('flow.content.addTo')}
        quick-close={false}
        class={styles.addToGroupPopup}
        onClosed={onClose}
        onConfirm={onConfirm}
      >
        <Loading loading={props.loading} size="small"></Loading>
      </Dialog>
    )
  },
})
