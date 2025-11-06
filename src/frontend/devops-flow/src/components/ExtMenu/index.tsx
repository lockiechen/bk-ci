import { defineComponent, ref, type PropType, computed } from 'vue';
import { Popover } from 'bkui-vue';
import { SvgIcon } from "@/components/SvgIcon";
import styles from "./ExtMenu.module.css";

interface MenuItem {
  text: string;
  disable?: boolean;
  hasPermission?: boolean;
  disablePermissionApi?: boolean;
  permissionData?: any;
  tooltips?: string;
  handler: (data: any, item: MenuItem) => void;
}

export default defineComponent({
  name: 'ExtMenu',
  components: {
    SvgIcon
  },
  props: {
    data: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    },
    config: {
      type: Array as PropType<MenuItem[]>,
      default: () => []
    }
  },

  setup(props) {
    const dotMenuRef = ref();
    const hasShow = ref(false);
    const bodyEle = computed(() => document.getElementsByTagName('body')[0])

    function getTooltips(item: MenuItem) {
      return {
        content: item?.tooltips,
        disabled: !item?.tooltips,
        allowHTML: false
      };
    };

    function clickMenuItem(item: MenuItem) {
      if (item.disable) return;

      hasShow.value = false;
      item.handler(props.data, item);
    };

    function handleShowMenu() {
      hasShow.value = true;
    };

    function handleHideMenu() {
      hasShow.value = false;
    };

    return () => (
      <Popover
        disabled={props.config.length === 0}
        placement="bottom"
        isShow={hasShow.value}
        ref={dotMenuRef.value}
        theme="light"
        trigger="click"
        arrow={false}
        extCls={styles.extMenu}
        clickContentAutoHide={true}
        boundary={bodyEle.value}
        allowHtml={true}
        onAfterShow={handleShowMenu}
        onAfterHidden={handleHideMenu}
      >
        {{
          default: () => (
            <SvgIcon
              name='more-fill'
              class={styles.moreFill}
              size={14}
            />
          ),
          content: () => props.config.length > 0 && (
            <ul class={styles.dotMenuList}>
              {props.config.map((item, index) => (
                <li
                  class={`${styles.dotMenuItem} ${item.disable ? styles.isDisable : ''}`}
                  v-bk-tooltips={getTooltips(item)}
                  key={index}
                  onClick={(e: Event) => {
                    e.stopPropagation();
                    clickMenuItem(item);
                  }}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          )
        }}
      </Popover>
    );

  }
});