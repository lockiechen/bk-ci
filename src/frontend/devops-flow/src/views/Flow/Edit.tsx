import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { Button } from "bkui-vue";
import styles from "./index.module.css";

export default defineComponent({
  name: "FlowEdit",
  setup() {
    const route = useRoute();
    const flowId = route.params.flowId as string;

    return () => (
      <div class={styles.pageContent}>
        <div class={styles.pagePlaceholder}>
          <h2>编辑创作流</h2>
          <p>编辑页面内容待实现</p>
          <p>Flow ID: {flowId}</p>
          <Button theme="primary">保存</Button>
        </div>
      </div>
    );
  },
});

