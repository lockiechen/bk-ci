import { InfoBox } from 'bkui-vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';
import { SvgIcon } from '../components/SvgIcon';
import styles from '../styles/useDeleteConfirm.module.css';

interface DeleteConfirmOptions {
  title?: string;
  message: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export function useDeleteConfirm() {
  const { t } = useI18n();

  const showDeleteConfirm = (options: DeleteConfirmOptions) => {
    const {
      title,
      message,
      description,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
    } = options;

    const infoBoxInstance = InfoBox({
      title: title || '',
      content: h('div', {
        class: styles.deleteConfirmContent
      }, [
        h(SvgIcon, {
          name: 'exclamation-circle-shape',
          class: styles.deleteConfirmIcon,
          size: 48,
        }),
        h('span', { class: 'text-[#313238]' }, message),
      ]),
      confirmText: confirmText || t('flow.actions.delete'),
      cancelText: cancelText || t('flow.common.close'),
      theme: 'danger',
      onConfirm: async () => {
        try {
          await onConfirm();
          infoBoxInstance.hide();
        } catch (error) {
          console.error('Delete confirm action failed:', error);
          // 不关闭弹窗，让用户重试
        }
      },
      onClose: () => {
        onCancel?.();
        return true;
      },
    });

    return infoBoxInstance;
  };

  return {
    showDeleteConfirm,
  };
}

