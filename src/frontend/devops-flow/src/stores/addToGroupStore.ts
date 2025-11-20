import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { defineStore } from 'pinia'
import { getSelectedTreeData } from '@/api/flowContentList'
import type { FlowGroupItem } from '@/api/flowGroup'

/**
 * Tree节点接口
 */
export interface TreeNode {
  id: string
  name: string
  hasChild: boolean
  desc: string
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  children?: TreeNode[]
}

/**
 * AddToGroupPopup状态管理
 */
export const useAddToGroupStore = defineStore('addToGroup', () => {
  const { t } = useI18n()
  // 状态定义
  const loading = ref(false)
  const filterKeyword = ref('')
  const treeData = ref<TreeNode[]>([])
  const selectedGroups = ref<FlowGroupItem[]>([])

  /**
   * 根据ID查找节点
   */
  function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findNodeById(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  /**
   * 更新节点状态
   */
  function updateNodeState(node: TreeNode) {
    if (!node.children || node.children.length === 0) {
      node.indeterminate = false
      return
    }

    const checkedChildren = node.children.filter((child) => child.checked).length
    const totalChildren = node.children.length

    if (checkedChildren === 0) {
      node.checked = false
      node.indeterminate = false
    } else if (checkedChildren === totalChildren) {
      node.checked = true
      node.indeterminate = false
    } else {
      node.checked = false
      node.indeterminate = true
    }
  }

  /**
   * 递归更新所有父节点的状态
   */
  function updateAllParentStates(
    targetNode: TreeNode,
    nodes: TreeNode[] = treeData.value,
  ): boolean {
    for (const node of nodes) {
      if (node.children) {
        const isDirectParent = node.children.some((child) => child.id === targetNode.id)
        if (isDirectParent) {
          updateNodeState(node)
          return true
        }

        const found = updateAllParentStates(targetNode, node.children)
        if (found) {
          updateNodeState(node)
          return true
        }
      }
    }
    return false
  }

  /**
   * 处理复选框变化
   */
  function handleCheck(checked: boolean, node: TreeNode) {
    const targetNode = findNodeById(treeData.value, node.id)
    if (!targetNode) return

    targetNode.checked = checked
    targetNode.indeterminate = false

    if (targetNode.hasChild && targetNode.children) {
      // 直接设置所有非禁用的子节点状态，不需要检查当前状态
      targetNode.children.forEach((child) => {
        if (!child.disabled) {
          child.checked = checked
          child.indeterminate = false
        }
      })
      updateNodeState(targetNode)
    } else {
      updateAllParentStates(targetNode)
    }

    updateSelectedGroups()
  }

  /**
   * 获取所有选中的叶子节点ID
   */
  function getCheckedLeafNodes(nodes: TreeNode[] = treeData.value): string[] {
    const result: string[] = []

    const traverse = (nodeList: TreeNode[]) => {
      nodeList.forEach((node) => {
        if (node.hasChild && node.children) {
          traverse(node.children)
        } else if (node.checked && !node.disabled) {
          result.push(node.id)
        }
      })
    }

    traverse(nodes)
    return result
  }

  /**
   * 更新选中组列表
   */
  function updateSelectedGroups() {
    const checkedIds = getCheckedLeafNodes()
    selectedGroups.value = checkedIds.map((id) => {
      const node = findNodeById(treeData.value, id)
      return {
        id: node?.id || id,
        name: node?.name || id,
      } as FlowGroupItem
    })
  }

  /**
   * 清空所有选中状态
   */
  function emptySelectedGroups() {
    const clearCheckedState = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (!node.disabled) {
          node.checked = false
          node.indeterminate = false
        }
        if (node.children) {
          clearCheckedState(node.children)
        }
      })
    }

    clearCheckedState(treeData.value)
    selectedGroups.value = []

    // 清空后需要更新所有父节点的状态
    treeData.value.forEach((parent) => {
      if (parent.children) {
        updateNodeState(parent)
      }
    })
  }

  /**
   * 移除单个组
   */
  function remove(group: FlowGroupItem) {
    const node = findNodeById(treeData.value, group.id)
    if (node) {
      node.checked = false
      node.indeterminate = false

      updateAllParentStates(node)
      updateSelectedGroups()
    }
  }

  /**
   * 初始化树数据
   */
  function initTreeData(personalGroups: FlowGroupItem[], projectGroups: FlowGroupItem[]) {
    treeData.value = [
      {
        id: 'personal',
        name: t('flow.dialog.addGroup.personalFlowGroup'),
        hasChild: true,
        indeterminate: false,
        checked: false,
        disabled: false,
        desc: '',
        children: personalGroups.map((item) => ({
          ...item,
          hasChild: false,
          indeterminate: false,
          checked: false,
          disabled: false,
          desc: '',
        })),
      },
      {
        id: 'projected',
        name: t('flow.sidebar.projectGroups'),
        hasChild: true,
        checked: false,
        indeterminate: false,
        disabled: false,
        desc: '',
        children: projectGroups.map((item) => ({
          ...item,
          hasChild: false,
          indeterminate: false,
          checked: false,
          disabled: false,
          desc: (item as any).desc || '',
        })),
      },
    ]
  }

  /**
   * 根据flowId获取已选中的tree数据并设置disabled状态
   */
  async function loadSelectedTreeData(flowId: string) {
    loading.value = true
    try {
      const response = await getSelectedTreeData(flowId)
      if (response.status === 0 && response.data.length > 0) {
        
        const processNodes = (nodes: TreeNode[]) => {
          nodes.forEach(node => {
            const isSelected = response.data.some(item => item.id === node.id)
            const isDynamicGroup = (node as any).viewType === 1
            
            switch (true) {
              case isSelected:
                node.disabled = true
                node.checked = true
                node.desc = t('flow.dialog.addGroup.added')
                break
              case isDynamicGroup:
                node.disabled = true
                node.desc = t('flow.dialog.addGroup.dynamicGroup')
                break
              default:
                break
            }
            
            if (node.children) {
              processNodes(node.children)
            }
          })
        }
        
        processNodes(treeData.value)
        
        // 更新父节点状态
        treeData.value.forEach((parent) => {
          if (parent.children) {
            updateNodeState(parent)
          }
        })
      }
    } catch (error) {
      console.error('Failed to load selected tree data:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 初始化弹窗
   */
  async function initPopup(data: any) {
    emptySelectedGroups()
    filterKeyword.value = ''
    if (data?.id) {
      await loadSelectedTreeData(data.id)
    }
  }

  return {
    // State
    loading,
    filterKeyword,
    treeData,
    selectedGroups,

    // Actions
    findNodeById,
    updateNodeState,
    updateAllParentStates,
    handleCheck,
    getCheckedLeafNodes,
    updateSelectedGroups,
    emptySelectedGroups,
    remove,
    initTreeData,
    loadSelectedTreeData,
    initPopup,
  }
})
