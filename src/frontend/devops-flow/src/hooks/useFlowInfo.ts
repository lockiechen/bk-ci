import { useFlowInfoStore } from '@/stores/flowInfoStore'
import { storeToRefs } from 'pinia'

export function useFlowInfo() {
  const store = useFlowInfoStore()
  const { flowInfo, flowVersionList, loading } = storeToRefs(store)
  return { flowInfo, flowVersionList, loading }
}
