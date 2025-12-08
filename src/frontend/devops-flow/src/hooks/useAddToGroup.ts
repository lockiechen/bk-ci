import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAddToGroupStore } from '@/stores/addToGroupStore'
import { useFlowGroupData } from './useFlowGroupData'

/**
 * AddToGroupPopup组件hook
 */
export function useAddToGroup() {
  const store = useAddToGroupStore()
  const { personalFlowGroups, projectFlowGroups } = useFlowGroupData()

  const { loading, filterKeyword, treeData, selectedGroups } = storeToRefs(store)

  watch(
    [personalFlowGroups, projectFlowGroups],
    () => {
      if (personalFlowGroups.value.length > 0 || projectFlowGroups.value.length > 0) {
        store.initTreeData(personalFlowGroups.value, projectFlowGroups.value)
      }
    },
    { immediate: true },
  )

  return {
    // State
    loading,
    filterKeyword,
    treeData,
    selectedGroups,

    // Actions
    handleCheck: store.handleCheck,
    emptySelectedGroups: store.emptySelectedGroups,
    remove: store.remove,
    initPopup: store.initPopup,
  }
}
