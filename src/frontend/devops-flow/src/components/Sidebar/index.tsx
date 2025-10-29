import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import styles from "./Sidebar.module.css";
import { SvgIcon } from "../SvgIcon";
import { useFlowGroupStore } from "../../stores/flowGroup";
import { useFlowGroupData } from "../../hooks/useFlowGroupData";

export const Sidebar = defineComponent({
  name: "Sidebar",
  components: {
    SvgIcon,
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const store = useFlowGroupStore();
    useFlowGroupData(); // 初始化数据加载

    // 组件本地状态
    const selectedItem = ref<string>('allFlows');
    const collapsed = ref({
      myFlowGroups: false,
      projectFlowGroups: true,
    });

    const handleItemClick = (key: string) => {
      selectedItem.value = key;
      
      // 根据不同的 key 进行路由跳转
      if (key === 'allFlows') {
        router.push({ name: 'flow' });
      } else if (key === 'myFavorites') {
        router.push({ name: 'flow', query: { type: 'favorites' } });
      } else if (key === 'myCreated') {
        router.push({ name: 'flow', query: { type: 'created' } });
      } else if (key === 'recycleBin') {
        router.push({ name: 'flow', query: { type: 'recycle' } });
      } else if (key.startsWith('personal-')) {
        const groupId = key.replace('personal-', '');
        router.push({ name: 'flowGroup', params: { groupId } });
      } else if (key.startsWith('project-')) {
        const groupId = key.replace('project-', '');
        router.push({ name: 'flowGroup', params: { groupId } });
      }
    };

    const handleGroupToggle = (key: 'myFlowGroups' | 'projectFlowGroups') => {
      collapsed.value[key] = !collapsed.value[key];
    };

    const handleGroupAction = (e: MouseEvent) => {
      e.stopPropagation();
      // TODO: 显示创建分组弹窗
      console.log('Create group');
    };

    return () => (
      <div class={styles.sidebar}>
        {/* 全部创作流 */}
        <div 
          class={[styles.menuItem, selectedItem.value === 'allFlows' && styles.active]}
          onClick={() => handleItemClick('allFlows')}
        >
          <SvgIcon name="all" class={styles.icon} />
          <span class={styles.text}>{t('flow.sidebar.allFlows')}</span>
          <span class={styles.count}>({store.counts.allFlows})</span>
        </div>

        {/* 我的创作流 */}
        <div class={styles.groupSection}>
          <div 
            class={[styles.groupHeader, !collapsed.value.myFlowGroups && styles.sticky]} 
            onClick={() => handleGroupToggle('myFlowGroups')}
          >
            <SvgIcon 
              name="right-shape" 
              size={14} 
              class={[styles.icon, styles.toggleIcon, !collapsed.value.myFlowGroups && styles.expanded]} 
            />
            <span class={styles.groupTitle}>
              {t('flow.sidebar.myFlows')} ({store.myFlowGroupsTotal})
            </span>
            <div onClick={handleGroupAction}>
              <SvgIcon 
                name="increase" 
                class={styles.icon} 
              />
            </div>
          </div>
          {!collapsed.value.myFlowGroups && (
            <div class={styles.groupContent}>
              {/* 我收藏的 */}
              <div 
                class={[styles.menuItem, styles.subMenuItem, selectedItem.value === 'myFavorites' && styles.active]}
                onClick={() => handleItemClick('myFavorites')}
              >
                <SvgIcon name="star" class={styles.icon} />
                <span class={styles.text}>{t('flow.sidebar.myFavorites')}</span>
                <span class={styles.count}>({store.counts.myFavorites})</span>
              </div>
              
              {/* 我创建的 */}
              <div 
                class={[styles.menuItem, styles.subMenuItem, selectedItem.value === 'myCreated' && styles.active]}
                onClick={() => handleItemClick('myCreated')}
              >
                <SvgIcon name="user" class={styles.icon} />
                <span class={styles.text}>{t('flow.sidebar.myCreated')}</span>
                <span class={styles.count}>({store.counts.myCreated})</span>
              </div>
              
              {/* 个人创作流组 */}
              {store.personalFlowGroups.map((group) => (
                <div 
                  key={group.id}
                  class={[
                    styles.menuItem, 
                    styles.subMenuItem,
                    selectedItem.value === `personal-${group.id}` && styles.active
                  ]}
                  onClick={() => handleItemClick(`personal-${group.id}`)}
                >
                  <SvgIcon name="group" class={styles.icon} />
                  <span class={styles.text}>{group.name}</span>
                  <span class={styles.count}>({group.count})</span>
                  <div class={styles.itemAction}>⋯</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 项目创作流组 */}
        <div class={styles.groupSection}>
          <div 
            class={[styles.groupHeader, !collapsed.value.projectFlowGroups && styles.sticky]} 
            onClick={() => handleGroupToggle('projectFlowGroups')}
          >
            <SvgIcon 
              name="right-shape" 
              size={14} 
              class={[styles.icon, styles.toggleIcon, !collapsed.value.projectFlowGroups && styles.expanded]} 
            />
            <span class={styles.groupTitle}>
              {t('flow.sidebar.projectGroups')} ({store.projectFlowGroupsTotal})
            </span>
            <div onClick={handleGroupAction}>
              <SvgIcon 
                name="increase" 
                class={styles.icon}
              />
            </div>
          </div>
          {!collapsed.value.projectFlowGroups && (
            <div class={styles.groupContent}>
              {store.projectFlowGroups.map((group) => (
                <div 
                  key={group.id}
                  class={[
                    styles.menuItem, 
                    styles.subMenuItem,
                    selectedItem.value === `project-${group.id}` && styles.active
                  ]}
                  onClick={() => handleItemClick(`project-${group.id}`)}
                >
                  <SvgIcon name={group.isDefault ? 'un-group' : 'group'} class={styles.icon} />
                  <span class={styles.text}>{group.name}</span>
                  <span class={styles.count}>({group.count})</span>
                  <div class={styles.itemAction}>⋯</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 回收站 */}
        <div class={styles.divider}></div>
        <div 
          class={[styles.menuItem, selectedItem.value === 'recycleBin' && styles.active]}
          onClick={() => handleItemClick('recycleBin')}
        >
          <SvgIcon class={styles.icon} name="trash-bin" />
          <span class={styles.text}>{t('flow.sidebar.recycleBin')}</span>
        </div>
      </div>
    );
  },
});
