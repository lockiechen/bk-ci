import { defineComponent } from "vue";
import { Sidebar } from "../components/Sidebar";
import { Content } from "../components/Content";
import styles from "./Flow.module.css";

export default defineComponent({
  name: "Flow",
  setup() {
    return () => (
      <div class={styles.page}>
        <div class={styles.sidebar}>
          <Sidebar />
        </div>
        <div class={styles.content}>
          <Content />
        </div>
      </div>
    );
  },
});