import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useModeStore } from "@/stores/flowMode";
import ModeSwitch from '@/components/ModeSwitch';
import EmptyPage from '@/components/EmptyPage/index';
import SettingContent from './SettingContent';
import styles from './SettingTab.module.css';

export default defineComponent({
  name: 'SettingTab',
  components: {
    ModeSwitch,
    SettingContent,
    EmptyPage
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const modeStore = useModeStore();
    
    return () => (
      <div class={styles.settingTab}>
        <ModeSwitch></ModeSwitch>

        <div class={styles.content}>
          {
            modeStore.isCodeMode ? <div>code方式</div> : (
              <div>
                {
                  true ? <SettingContent /> : <EmptyPage />
                }
              </div>
            )
          }
        </div>
      </div>
    );
  }
});