import { defineComponent, ref } from "vue";
import styles from "./index.module.css";
import { RouterView } from "vue-router";
import { FlowHeader } from "@/components/FlowHeader";
import type { FlowInfo } from "@/components/FlowHeader";
import layoutStyles from "@/styles/layout.module.css";

export default defineComponent({
    setup() {
        const flowInfo = ref<FlowInfo>({
            name: 'stream-ci-demo',
            versions: [
                { value: 'v5-p2-t3-3', label: 'V5 (P2.T3.3)', isLatest: true },
                { value: 'v5-p2-t3-2', label: 'V5 (P2.T3.2)' },
                { value: 'v5-p2-t3-1', label: 'V5 (P2.T3.1)' },
            ],
            currentVersion: 'v5-p2-t3-3',
        });

        const handleVersionChange = (version: string) => {
            flowInfo.value.currentVersion = version;
            // TODO: 处理版本切换逻辑
            console.log('版本切换:', version);
        };

        const handleEdit = () => {
            // TODO: 处理编辑逻辑
            console.log('编辑');
        };

        const handleExecute = () => {
            // TODO: 处理执行逻辑
            console.log('执行');
        };

        return () => (
            <div class={layoutStyles.page}>
                <FlowHeader
                    flowInfo={flowInfo.value}
                    onVersionChange={handleVersionChange}
                    onEdit={handleEdit}
                    onExecute={handleExecute}
                />
                <RouterView />
            </div>
        )
    }
})