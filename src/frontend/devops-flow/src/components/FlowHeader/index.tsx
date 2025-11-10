import { defineComponent, ref, version } from "vue";
import type { PropType } from "vue";
import { Button, Tag, Select } from "bkui-vue";
import styles from "./index.module.css";
import { RouterLink } from "vue-router";
import { FLOW_GROUP_TYPES } from "@/constants/flowGroup";
import { SvgIcon } from "../SvgIcon";

const { Option } = Select;

export interface VersionOption {
  value: string;
  label: string;
  isLatest?: boolean;
}

export type FlowInfo = {
  name: string;
  versions: VersionOption[];
  currentVersion: string;
}

export const FlowHeader = defineComponent({
  name: "FlowHeader",
  props: {
    flowInfo: {
      type: Object as PropType<FlowInfo>,
      required: true,
    },
    onEdit: {
      type: Function as PropType<() => void>,
    },
    onExecute: {
      type: Function as PropType<() => void>,
    },
    onVersionChange: {
      type: Function as PropType<(version: string) => void>,
    },
  },
  setup(props) {
    const selectedVersion = ref(props.flowInfo.currentVersion);

    const handleVersionChange = (value: string) => {
      selectedVersion.value = value;
      props.onVersionChange?.(value);
    };

    const currentVersionOption = () => {
      return props.flowInfo.versions.find(v => v.value === selectedVersion.value);
    };

    const renderTag = () => {
      return (
        <Tag theme="success" size="small" class={styles.tag}>
          最新
        </Tag>
      )
    }

    const renderCheckIcon = (isLatest: boolean = false) => {
      return (
        <SvgIcon name="check-circle" class={[styles.checkIcon, isLatest && styles.latestCheckIcon]} />
      )
    }

    return () => {
      const currentVersion = currentVersionOption();
      const flowList = {
        name: 'flowList',
        params: {
            groupId: FLOW_GROUP_TYPES.ALL_FLOWS
        }
      }
      return (
        <header class={styles.header}>
          <div class={styles.headerLeft}>
            {/* Logo/图标 */}
            <RouterLink to={flowList} class={styles.logoLink}>
                <div class={styles.logo}>
                <img src="/devops-flow-logo.svg" alt="flow" class={styles.logoIcon} />
                </div>
                
                {/* 创作流文本 */}
                <span class={styles.flowLabel}>创作流</span>
            </RouterLink>
            <SvgIcon name="angle-down" class={styles.separatorIcon} size={18} />
            {/* 工作流名称 */}
            <span class={styles.workflowName}>{props.flowInfo.name}</span>
            
            <SvgIcon name="exchange-line" />            
            {/* 版本选择器 */}
              <Select
                modelValue={selectedVersion.value}
                onChange={handleVersionChange}
                class={styles.versionSelector}
              >
                {{
                    trigger: ({ selected}: any) => (
                        <span class={styles.versionTrigger}>
                            {renderCheckIcon(currentVersion?.isLatest)}
                            {selected?.[0]?.['label']}
                            {currentVersion?.isLatest && renderTag()}
                            <SvgIcon name="angle-down" class={styles.versionSelectToggleIcon} />
                        </span>
                    ),
                    default: () => props.flowInfo.versions.map((version) => (
                            <Option
                              key={version.value}
                              value={version.value}
                              label={version.label}
                            >
                              <div class={styles.versionOption}>
                                {renderCheckIcon(version.isLatest)}
                                <span>{version.label}</span>
                                {version.isLatest && renderTag()}
                              </div>
                            </Option>
                          ))
                    
                }}
              </Select>
          </div>
          
          <div class={styles.headerRight}>
            <Button onClick={props.onEdit}>编辑</Button>
            <Button theme="primary" onClick={props.onExecute}>执行</Button>
            <div class={styles.moreButton}>
              <i class="bk-icon icon-ellipsis"></i>
            </div>
          </div>
        </header>
      );
    };
  },
});

