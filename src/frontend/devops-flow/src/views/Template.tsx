import { defineComponent } from "vue";
import { Sidebar } from "../components/Sidebar";
import styles from "./Flow.module.css";

export default defineComponent({
  name: "Template",
  setup() {
    return () => (
      <div class={styles.page}>
        <div class={styles.sidebar}>
          <Sidebar />
        </div>
        <div class={styles.content}>
          <div style="padding: 24px;">
            <h2>模板页面</h2>
          </div>
        </div>
      </div>
    );
  },
});
