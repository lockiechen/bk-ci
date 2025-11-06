import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useModeStore } from "@/stores/mode";
import ModeSwitch from '@/components/ModeSwitch';
import EmptyPage from '@/components/EmptyPage/index';
import NoticeContent from './NoticeContent';
import styles from './NoticeTab.module.css';

export default defineComponent({
  name: 'NoticeTab',
  components: {
    ModeSwitch,
    NoticeContent,
    EmptyPage
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const modeStore = useModeStore();
    
    return () => (
      <div class={styles.noticeTab}>
        <ModeSwitch></ModeSwitch>

        <div class={styles.content}>
          {
            modeStore.isCodeMode ? <div>code方式</div> : (
              <div>
                {
                  true ? <NoticeContent /> : <EmptyPage />
                }
              </div>
            )
          }
        </div>
      </div>
    );
  }
});