<template>
  <VueDraggable
    v-model="computedStages"
    v-bind="dragOptions"
    :move="checkMove"
    class="bk-pipeline"
  >
    <Stage
      class="list-item"
      v-for="(stage, index) in computedStages"
      :ref="(el) => setStageRef(el, stage.id)"
      :key="stage.id"
      :editable="editable"
      :stage="stage"
      :is-preview="isPreview"
      :is-exec-detail="isExecDetail"
      :has-finally-stage="hasFinallyStage"
      :stage-index="index"
      :cancel-user-id="cancelUserId"
      :handle-change="updatePipeline"
      :is-latest-build="isLatestBuild"
      :stage-length="computedStages.length"
      :containers="stage.containers"
      :match-rules="matchRules"
      @[COPY_EVENT_NAME_VALUE]="handleCopyStage"
      @[DELETE_EVENT_NAME_VALUE]="handleDeleteStage"
    >
    </Stage>
  </VueDraggable>
</template>

<script setup>
import {
  ref,
  computed,
  provide,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { VueDraggable } from "vue-draggable-plus";
import Stage from "./Stage";
import { eventBus, hashID, isTriggerContainer } from "./util";
import {
  ADD_STAGE,
  ATOM_ADD_EVENT_NAME,
  ATOM_CONTINUE_EVENT_NAME,
  ATOM_EXEC_EVENT_NAME,
  ATOM_QUALITY_CHECK_EVENT_NAME,
  ATOM_REVIEW_EVENT_NAME,
  CLICK_EVENT_NAME,
  COPY_EVENT_NAME,
  DEBUG_CONTAINER,
  DELETE_EVENT_NAME,
  STAGE_CHECK,
  STAGE_RETRY,
  APPEND_JOB,
} from "./constants";

// 定义 emits - 必须在 defineProps 之前，且不能引用局部变量
const emit = defineEmits([
  "input",
  "change",
  CLICK_EVENT_NAME,
  DELETE_EVENT_NAME,
  ATOM_REVIEW_EVENT_NAME,
  ATOM_CONTINUE_EVENT_NAME,
  ATOM_EXEC_EVENT_NAME,
  ATOM_QUALITY_CHECK_EVENT_NAME,
  ATOM_ADD_EVENT_NAME,
  ADD_STAGE,
  STAGE_CHECK,
  STAGE_RETRY,
  DEBUG_CONTAINER,
  APPEND_JOB,
]);

const customEvents = [
  CLICK_EVENT_NAME,
  DELETE_EVENT_NAME,
  ATOM_REVIEW_EVENT_NAME,
  ATOM_CONTINUE_EVENT_NAME,
  ATOM_EXEC_EVENT_NAME,
  ATOM_QUALITY_CHECK_EVENT_NAME,
  ATOM_ADD_EVENT_NAME,
  ADD_STAGE,
  STAGE_CHECK,
  STAGE_RETRY,
  DEBUG_CONTAINER,
  APPEND_JOB,
];

const props = defineProps({
  editable: {
    type: Boolean,
    default: true,
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
  currentExecCount: {
    type: Number,
    default: 1,
  },
  isExecDetail: {
    type: Boolean,
    default: false,
  },
  isLatestBuild: {
    type: Boolean,
    default: false,
  },
  canSkipElement: {
    type: Boolean,
    default: false,
  },
  pipeline: {
    type: Object,
    required: true,
  },
  cancelUserId: {
    type: String,
    default: "unknow",
  },
  userName: {
    type: String,
    default: "unknow",
  },
  matchRules: {
    type: Array,
    default: () => [],
  },
  isExpandAllMatrix: {
    type: Boolean,
    default: true,
  },
});

// 使用 ref 存储 stage refs
const stageRefs = ref({});

// provide 响应式数据 - Vue 2.7 和 Vue 3 兼容
// 使用 Object.defineProperty 创建响应式代理，在 Vue 2.7 和 Vue 3 中都能正常工作
// Vue 2.7: Object.defineProperty 配合 Vue 的响应式系统
// Vue 3: 虽然推荐使用 reactive，但 Object.defineProperty 仍然可以工作
const reactiveData = {};
const keys = [
  "currentExecCount",
  "isPreview",
  "userName",
  "matchRules",
  "editable",
  "isExecDetail",
  "isLatestBuild",
  "canSkipElement",
  "cancelUserId",
  "isExpandAllMatrix",
];

keys.forEach((key) => {
  Object.defineProperty(reactiveData, key, {
    enumerable: true,
    get: () => props[key],
    configurable: true,
  });
});

provide("reactiveData", reactiveData);
provide("emitPipelineChange", () => {
  emitPipelineChange(props.pipeline);
});

const DELETE_EVENT_NAME_VALUE = DELETE_EVENT_NAME;
const COPY_EVENT_NAME_VALUE = COPY_EVENT_NAME;

const computedStages = computed({
  get() {
    return props.pipeline?.stages ?? [];
  },
  set(stages) {
    const data = stages.map((stage, index) => {
      const name = `stage-${index + 1}`;
      const id = `s-${hashID()}`;
      if (!stage.containers) {
        return {
          id,
          name,
          containers: [stage],
        };
      }
      return stage;
    });
    updatePipeline(props.pipeline, {
      stages: data.filter((stage) => stage.containers.length),
    });
  },
});

const dragOptions = computed(() => {
  return {
    group: "pipeline-job",
    ghostClass: "sortable-ghost-atom",
    chosenClass: "sortable-chosen-atom",
    animation: 130,
    disabled: !props.editable,
  };
});

const hasFinallyStage = computed(() => {
  try {
    const stageLength = computedStages.value.length;
    const last = computedStages.value[stageLength - 1];
    return last.finally;
  } catch (error) {
    return false;
  }
});

const emitPipelineChange = (newVal) => {
  emit("input", newVal);
  emit("change", newVal);
};

const registeCustomEvent = (destory = false) => {
  customEvents.forEach((eventName) => {
    const fn = (destory ? eventBus.$off : eventBus.$on).bind(eventBus);
    fn(eventName, (...args) => {
      emit(eventName, ...args);
    });
  });
};

const checkIsTriggerStage = (stage) => {
  try {
    return isTriggerContainer(stage.containers[0]);
  } catch (e) {
    return false;
  }
};

const updatePipeline = (model, params) => {
  Object.assign(model, params);
  emitPipelineChange(model);
};

const checkMove = (event) => {
  const dragContext = event.draggedContext || {};
  const element = dragContext.element || {};
  const isTrigger = element.containers[0]?.["@type"] === "trigger";
  const isFinally = element.finally === true;

  const relatedContext = event.relatedContext || {};
  const relatedelement = relatedContext.element || {};
  const isRelatedTrigger = relatedelement["@type"] === "trigger";

  const isTriggerStage = checkIsTriggerStage(relatedelement);
  const isRelatedFinally = relatedelement.finally === true;

  return (
    !isTrigger &&
    !isRelatedTrigger &&
    !isTriggerStage &&
    !isFinally &&
    !isRelatedFinally
  );
};

const handleCopyStage = ({ stageIndex, stage }) => {
  const newStages = [...props.pipeline.stages];
  newStages.splice(stageIndex + 1, 0, stage);
  emitPipelineChange({
    ...props.pipeline,
    stages: newStages,
  });
};

const handleDeleteStage = (stageId) => {
  const newStages = props.pipeline.stages.filter(
    (stage) => stage.id !== stageId
  );
  emitPipelineChange({
    ...props.pipeline,
    stages: newStages,
  });
};

const expandPostAction = (stageId, matrixId, containerId) => {
  return new Promise((resolve) => {
    try {
      let jobInstance =
        stageRefs.value[stageId]?.[0]?.$refs?.[containerId]?.[0]?.$refs?.jobBox;
      if (matrixId) {
        jobInstance =
          stageRefs.value[stageId]?.[0]?.$refs?.[matrixId]?.[0]?.$refs?.jobBox
            ?.$refs[containerId]?.[0];
      }
      console.log(jobInstance, "jobInstance");
      jobInstance?.$refs?.atomList?.expandPostAction?.();
      nextTick(() => {
        resolve(true);
      });
    } catch (error) {
      console.error(error);
      resolve(false);
    }
  });
};

const expandMatrix = (stageId, matrixId, containerId, expand = true) => {
  console.log("expandMatrix", stageId, matrixId, containerId);
  return new Promise((resolve) => {
    try {
      const jobInstance =
        stageRefs.value[stageId]?.[0]?.$refs?.[matrixId]?.[0]?.$refs?.jobBox;
      jobInstance?.toggleMatrixOpen?.(expand);
      nextTick(() => {
        jobInstance?.$refs[containerId]?.[0]?.toggleShowAtom(expand);
        resolve(true);
      });
    } catch (error) {
      console.error(error);
      resolve(false);
    }
  });
};

const expandJob = (stageId, containerId, expand = true) => {
  console.log("expandJob", stageId, containerId);
  return new Promise((resolve) => {
    try {
      const jobInstance =
        stageRefs.value[stageId]?.[0]?.$refs?.[containerId]?.[0]?.$refs?.jobBox;
      jobInstance?.toggleShowAtom(expand);
      resolve(true);
    } catch (error) {
      console.error(error);
      resolve(false);
    }
  });
};

// 设置 ref 的回调函数
const setStageRef = (el, stageId) => {
  if (el) {
    if (!stageRefs.value[stageId]) {
      stageRefs.value[stageId] = [];
    }
    stageRefs.value[stageId].push(el);
  }
};

onMounted(() => {
  registeCustomEvent();
});

onBeforeUnmount(() => {
  window.showLinuxTipYet = false;
  registeCustomEvent(true);
});

// 暴露方法供外部调用
defineExpose({
  expandPostAction,
  expandMatrix,
  expandJob,
});
</script>

<style lang="scss">
.bk-pipeline {
  display: flex;
  padding-right: 120px;
  width: fit-content;
  position: relative;
  align-items: flex-start;
  ul,
  li {
    margin: 0;
    padding: 0;
  }
}

.list-item {
  transition: transform 0.2s ease-out;
}

.list-enter, .list-leave-to
        /* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(36px) scale(0, 1);
}

.list-leave-active {
  position: absolute !important;
}
</style>
