import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { Button } from 'bkui-vue';
import { useModeStore } from "@/stores/flowMode";
import styles from './ModeSwitch.module.css';
import { modeList } from "@/utils/flowConst";

export default defineComponent({
  name: 'ModeSwitch',

  setup() {
    const { t } = useI18n();
    const modeStore = useModeStore();
    const flowModelGroup = computed(() => modeList.map(mode => ({
      label: t(`flow.${mode}`),
      id: mode
    })));

    function updatedMode(mode: string) {
      modeStore.setMode(mode);
    }

    return () => (
      <div class={styles.modelSwitch}>
        <Button.ButtonGroup size="small">
          {
            flowModelGroup.value.map(mode => (
              <Button
                selected={mode.id === modeStore.currentMode}
                onClick={() => updatedMode(mode.id)}
              >
                {mode.label}
              </Button>
            ))
          }
        </Button.ButtonGroup>
      </div>
    );
  }
});