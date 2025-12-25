import { useFlowInfoStore } from '@/stores/flowInfoStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { VERSION_STATUS_ENUM } from '../utils/flowConst';

export function useFlowInfo() {
  const store = useFlowInfoStore()
  const { flowInfo, flowVersionList, loading } = storeToRefs(store)

  const releasedVersionList = computed(() => {
    return flowVersionList.value?.filter((v => v.status === VERSION_STATUS_ENUM.RELEASED)) ?? []
  })

  onMounted(() => {
    store.initFlowInfo()
  })
  return { flowInfo, flowVersionList, releasedVersionList, loading }
}
