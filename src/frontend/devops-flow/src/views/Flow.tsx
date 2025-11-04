import { defineComponent } from "vue";
import { FlowGroupAside } from "../components/FlowGroupAside";
import { Content } from "../components/Content";
import styles from "./Flow.module.css";

export default defineComponent({
  name: "Flow",
  props: {
    groupId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class={styles.page}>
        <div class={styles.sidebar}>
          <FlowGroupAside />
        </div>
        <div class={styles.content}>
          <Content groupId={props.groupId} />
        </div>
      </div>
    );
  },
});