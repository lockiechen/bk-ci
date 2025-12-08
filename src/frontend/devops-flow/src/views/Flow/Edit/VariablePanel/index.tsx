import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Tab, Button, Input, Message, Collapse, Alert } from 'bkui-vue'
import { VueDraggable, type SortableEvent } from 'vue-draggable-plus'
import {
  type FlowVariable,
  type PluginOutputVariable,
  type SystemVariable,
  type ReadOnlyVariableGroup,
} from '@/types/variable'
import { VariableCategory, VariablePanelTab } from '@/types/variable'
import {
  getFlowVariables,
  saveFlowVariable,
  updateFlowVariable,
  deleteFlowVariable,
  getFlowVariablesFromModel,
  getPluginOutputVariablesFromModel,
  getSystemVariables,
} from '@/api/variable'
import { useFlowModelStore } from '@/stores/flowModel'
import { SvgIcon } from '@/components/SvgIcon'
import VariableItem from './VariableItem'
import VariableForm from './VariableForm'
import ReadOnlyVariableItem from './ReadOnlyVariableItem'
import styles from './VariablePanel.module.css'

interface CategoryItem {
  category: VariableCategory
  name: string
  variables: Record<string, FlowVariable[]>
  emptyText: string
  totalCount?: number
}

export default defineComponent({
  name: 'VariablePanel',
  props: {
    flowId: {
      type: String,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    modelValue: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['toggle', 'update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const DRAG_HANDLE_CLASS = 'drag-handle'
    const isOpen = ref(props.modelValue)
    const activePanelTab = ref(VariablePanelTab.VARIABLES) // 顶级Tab
    const variables = ref<FlowVariable[]>([])
    const pluginOutputVariables = ref<ReadOnlyVariableGroup[]>([])
    const systemVariableGroups = ref<ReadOnlyVariableGroup[]>([])
    const loading = ref(false)
    const searchKeyword = ref('')

    // Get flow model store
    const flowModelStore = useFlowModelStore()

    // Edit mode state
    const isEditMode = ref(false)
    const editingVariable = ref<FlowVariable | null>(null)
    const currentAddingCategory = ref<VariableCategory>(VariableCategory.INPUT)

    // Load variables from flow model
    const loadVariables = () => {
      try {
        const model = flowModelStore.flowModel
        if (!model) {
          variables.value = []
          return
        }
        variables.value = getFlowVariablesFromModel(model)
      } catch (error) {
        console.error('Failed to load variables:', error)
        Message({ theme: 'error', message: t('flow.variable.loadFailed') })
      }
    }

    // Load plugin output variables from flow model
    const loadPluginOutputVariables = () => {
      try {
        const model = flowModelStore.flowModel
        if (!model) {
          pluginOutputVariables.value = []
          return
        }
        pluginOutputVariables.value = getPluginOutputVariablesFromModel(model)
      } catch (error) {
        console.error('Failed to load plugin output variables:', error)
        Message({ theme: 'error', message: t('flow.variable.loadPluginVariablesFailed') })
      }
    }

    // Load system variables
    const loadSystemVariables = async () => {
      try {
        systemVariableGroups.value = await getSystemVariables()
      } catch (error) {
        console.error('Failed to load system variables:', error)
        Message({ theme: 'error', message: t('flow.variable.loadSystemVariablesFailed') })
      }
    }

    // Filter variables by category and group them
    const getVariablesByCategory = (category: VariableCategory) => {
      const filtered = variables.value.filter((v) => {
        const matchCategory = v.category === category
        const matchSearch =
          !searchKeyword.value ||
          v.id.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
          v.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
        return matchCategory && matchSearch
      })

      // Group by groupLabel
      const grouped = filtered.reduce(
        (acc, variable) => {
          const groupKey = variable.groupLabel || t('flow.variable.ungrouped')
          if (!acc[groupKey]) {
            acc[groupKey] = []
          }
          acc[groupKey].push(variable)
          return acc
        },
        {} as Record<string, FlowVariable[]>,
      )

      return grouped
    }

    // Filter system variable groups
    const getFilteredReadonlyVariableGroups = (list: ReadOnlyVariableGroup[]) => {
      if (!searchKeyword.value) {
        return list
      }

      return list
        .map((group) => ({
          ...group,
          params: group.params.filter(
            (v) =>
              v.id.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
              v.name.toLowerCase().includes(searchKeyword.value.toLowerCase()),
          ),
        }))
        .filter((group) => group.params.length > 0)
    }

    // Computed variables for each tab (grouped)
    const inputVariables = computed(() => getVariablesByCategory(VariableCategory.INPUT))
    const constantVariables = computed(() => getVariablesByCategory(VariableCategory.CONSTANT))
    const otherVariables = computed(() => getVariablesByCategory(VariableCategory.OTHER))
    const filteredPluginOutputVariables = computed(() =>
      getFilteredReadonlyVariableGroups(pluginOutputVariables.value),
    )
    const filteredSystemVariableGroups = computed(() =>
      getFilteredReadonlyVariableGroups(systemVariableGroups.value),
    )

    // Get existing variable IDs
    const existingIds = computed(() => variables.value.map((v) => v.id))

    // Get current category for adding variables
    const currentCategory = computed(() => currentAddingCategory.value)

    const variableCategories = computed<CategoryItem[]>(() => {
      return [
        {
          category: VariableCategory.INPUT,
          name: t('flow.variable.inputParams'),
          variables: inputVariables.value,
          emptyText: t('flow.variable.noInputParams'),
        },
        {
          category: VariableCategory.CONSTANT,
          name: t('flow.variable.constants'),
          variables: constantVariables.value,
          emptyText: t('flow.variable.noConstants'),
        },
        {
          category: VariableCategory.OTHER,
          name: t('flow.variable.otherVariables'),
          variables: otherVariables.value,
          emptyText: t('flow.variable.noOtherVariables'),
        },
      ].map((category) => {
        const totalCount = Object.values(category.variables).reduce(
          (sum, group) => sum + group.length,
          0,
        )
        return {
          ...category,
          totalCount,
        }
      })
    })

    // Drag sort configuration - 限制拖拽区域
    const getDragOptions = (category: VariableCategory, group: string) => {
      return {
        group: `variables-${category}-${group}`,
        animation: 200,
        ghostClass: styles.dragGhost,
        chosenClass: styles.dragChosen,
        dragClass: styles.dragging,
        disabled: !props.editable,
        handle: `.${DRAG_HANDLE_CLASS}`, // 只有drag-handle类名支持拖拽
      }
    }

    // Handle variable order update - 仅前端调整数组顺序
    const handleVariableOrderUpdate = async (
      category: VariableCategory,
      group: string,
      newOrder: FlowVariable[],
    ) => {
      try {
        // 仅更新本地状态，不调用后端API
        const variableIds = newOrder.map((v) => v.id)

        // 更新variables数组中的顺序
        const updatedVariables = [...variables.value]
        newOrder.forEach((variable, index) => {
          const varIndex = updatedVariables.findIndex((v) => v.id === variable.id)
          if (varIndex !== -1) {
            updatedVariables[varIndex] = { ...variable, order: index }
          }
        })

        // 根据order字段重新排序
        updatedVariables.sort((a, b) => (a.order || 0) - (b.order || 0))
        variables.value = updatedVariables

        console.log('Variable order updated locally:', { category, group, variableIds })
      } catch (error) {
        console.error('Failed to update variable order:', error)
      }
    }

    // Toggle panel
    const togglePanel = () => {
      isOpen.value = !isOpen.value
      emit('toggle', isOpen.value)
      emit('update:modelValue', isOpen.value)
    }

    // Watch modelValue changes from parent
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue !== isOpen.value) {
          isOpen.value = newValue
        }
      },
    )

    // Handle panel tab change
    const handlePanelTabChange = (name: string) => {
      activePanelTab.value = name as VariablePanelTab
      searchKeyword.value = ''
      // Load data when switching to different tabs
      if (name === VariablePanelTab.PLUGIN_OUTPUT) {
        loadPluginOutputVariables()
      } else if (name === VariablePanelTab.SYSTEM && systemVariableGroups.value.length === 0) {
        loadSystemVariables()
      }
    }

    // Handle add variable
    const handleAddVariable = (category?: VariableCategory) => {
      editingVariable.value = null
      // Set the category for new variable
      if (category) {
        currentAddingCategory.value = category
      }
      isEditMode.value = true
    }

    // Handle edit variable
    const handleEditVariable = (variable: FlowVariable) => {
      editingVariable.value = variable
      isEditMode.value = true
    }

    // Handle save variable
    const handleSaveVariable = async (variable: FlowVariable) => {
      try {
        if (editingVariable.value) {
          // Update existing variable
          await updateFlowVariable(props.flowId, variable.id, variable)
          const index = variables.value.findIndex((v) => v.id === editingVariable.value!.id)
          if (index !== -1) {
            variables.value[index] = variable
          }
          Message({ theme: 'success', message: t('flow.variable.updateSuccess') })
        } else {
          // Add new variable
          await saveFlowVariable(props.flowId, variable)
          variables.value.push(variable)
          Message({ theme: 'success', message: t('flow.variable.addSuccess') })
        }
        isEditMode.value = false
        editingVariable.value = null
      } catch (error) {
        console.error('Failed to save variable:', error)
        Message({ theme: 'error', message: t('flow.variable.saveFailed') })
      }
    }

    // Handle delete variable
    const handleDeleteVariable = async (variableId: string) => {
      try {
        await deleteFlowVariable(props.flowId, variableId)
        variables.value = variables.value.filter((v) => v.id !== variableId)
        Message({ theme: 'success', message: t('flow.variable.deleteSuccess') })
      } catch (error) {
        console.error('Failed to delete variable:', error)
        Message({ theme: 'error', message: t('flow.variable.deleteFailed') })
      }
    }

    // Handle copy variable reference
    const handleCopyReference = (reference: string) => {
      Message({ theme: 'success', message: t('flow.variable.copySuccess') })
    }

    // Handle cancel
    const handleCancel = () => {
      isEditMode.value = false
      editingVariable.value = null
    }

    // Watch flow model changes to reload variables
    watch(
      () => flowModelStore.flowModel,
      () => {
        if (isOpen.value && activePanelTab.value === VariablePanelTab.VARIABLES) {
          loadVariables()
        }
        // Also reload plugin output variables when model changes
        if (isOpen.value && activePanelTab.value === VariablePanelTab.PLUGIN_OUTPUT) {
          loadPluginOutputVariables()
        }
      },
      { deep: true },
    )

    // Initialize
    onMounted(() => {
      loadVariables()
      emit('toggle', isOpen.value)
    })

    const renderSearchInput = () => (
      <Input
        v-model={searchKeyword.value}
        placeholder={t('flow.variable.searchPlaceholder')}
        clearable
        class={styles.searchInput}
      >
        {{
          suffix: () => <SvgIcon name="search" class={styles.searchInputIcon} />,
        }}
      </Input>
    )

    // Render grouped variable list - 平铺展示，支持拖拽排序
    const renderGroupedVariableList = (
      category: VariableCategory,
      groupedVariables: Record<string, FlowVariable[]>,
      emptyText: string,
    ) => {
      const groups = Object.keys(groupedVariables)
      if (groups.length === 0) {
        return <div class={styles.emptyTip}>{emptyText}</div>
      }

      return groups.map((groupName) => {
        const groupVariables = groupedVariables[groupName] ?? []

        function handleDragEnd(e: SortableEvent) {
          if (e.oldIndex === undefined || e.newIndex === undefined || e.oldIndex === e.newIndex) {
            return
          }
          const newOrder = [...groupVariables]
          const [movedItem] = newOrder.splice(e.oldIndex, 1)
          if (!movedItem) return
          newOrder.splice(e.newIndex, 0, movedItem)
          handleVariableOrderUpdate(category, groupName, newOrder)
        }

        return (
          <div key={groupName} class={styles.variableGroup}>
            <div class={styles.groupLabel}>
              <span class={styles.groupName}>{groupName}</span>
              <span class={styles.groupCount}>{groupVariables?.length ?? 0}</span>
            </div>
            <div class={styles.groupContent}>
              <VueDraggable
                {...getDragOptions(category, groupName)}
                modelValue={groupVariables as FlowVariable[]}
                class={styles.draggableList}
                onEnd={handleDragEnd}
              >
                {groupVariables?.map((variable) => (
                  <VariableItem
                    key={variable.id}
                    dragHandleCls={DRAG_HANDLE_CLASS}
                    variable={variable}
                    editable={props.editable}
                    draggable={props.editable}
                    onEdit={handleEditVariable}
                    onDelete={handleDeleteVariable}
                    onCopy={handleCopyReference}
                  />
                ))}
              </VueDraggable>
            </div>
          </div>
        )
      })
    }

    // Render plugin output variables with accordion grouping// Check if any plugin has no stepId
    // const hasInvalidPlugin = pluginOutputVariables.value.length === 0 &&
    //   flowModelStore.flowModel?.stages.some(stage =>
    //     stage.containers.some(container =>
    //       container.elements.some(element => !element.stepId)
    //     )
    //   )
    // Render system variables with accordion grouping
    const renderReadonlyVariables = (
      variableGroups: ReadOnlyVariableGroup[],
      emptyText: string,
      readonlyVarType: VariablePanelTab,
    ) => {
      if (variableGroups.length === 0) {
        return <div class={styles.emptyTip}>{emptyText}</div>
      }

      return (
        <div class={styles.variableList}>
          <div class={styles.listHeader}>{renderSearchInput()}</div>
          <Alert theme="info">
            {t(
              readonlyVarType === VariablePanelTab.PLUGIN_OUTPUT
                ? 'flow.variable.pluginOutputVariableTips'
                : 'flow.variable.systemVariableTips',
            )}
          </Alert>
          <div class={styles.listContent}>
            <Collapse useBlockTheme list={variableGroups}>
              {{
                title: (group: ReadOnlyVariableGroup) => (
                  <div class={styles.collapseHeader}>
                    <span class={styles.categoryTitle}>{group.name}</span>
                    <span>{group.params.length}</span>
                  </div>
                ),
                content: (group: ReadOnlyVariableGroup) => (
                  <div class={styles.flatVariableList}>
                    {group.params.map((variable) => (
                      <ReadOnlyVariableItem
                        key={variable.id}
                        variable={variable}
                        type={readonlyVarType}
                        onCopy={handleCopyReference}
                      />
                    ))}
                  </div>
                ),
              }}
            </Collapse>
          </div>
        </div>
      )
    }

    return () => (
      <div class={[styles.variablePanel, isOpen.value && styles.panelOpen]}>
        {/* Toggle button */}
        <div
          class={[styles.toggleButton, !isOpen.value && styles.buttonClosed]}
          onClick={togglePanel}
        >
          <SvgIcon
            name="arrows-up"
            class={isOpen.value ? styles.rotate90deg : styles.rotate270deg}
            size={18}
          />
          {t('flow.variable.title')}
        </div>

        {/* Panel content */}
        {isOpen.value && (
          <div class={styles.panelContent}>
            {!isEditMode.value ? (
              // Variable list view with top-level tabs
              <Tab
                active={activePanelTab.value}
                type="unborder-card"
                onChange={handlePanelTabChange}
                class={styles.panelTab}
              >
                {/* Variables Tab */}
                <Tab.TabPanel
                  name={VariablePanelTab.VARIABLES}
                  label={t('flow.variable.variables')}
                >
                  <div class={styles.variableList}>
                    {/* Tips */}
                    <Alert theme="info">{t('flow.variable.variableTips')}</Alert>

                    {/* Action buttons */}
                    <div class={styles.actionButtons}>
                      {props.editable && (
                        <>
                          <Button
                            theme="primary"
                            onClick={() => handleAddVariable(VariableCategory.INPUT)}
                            class={styles.addButton}
                          >
                            {t('flow.variable.addVariable')}
                          </Button>
                          <Button
                            onClick={() => handleAddVariable(VariableCategory.CONSTANT)}
                            class={styles.addButton}
                          >
                            {t('flow.variable.addConstant')}
                          </Button>
                          {renderSearchInput()}
                        </>
                      )}
                    </div>

                    <div class={styles.listContent}>
                      <Collapse accordion={false} list={variableCategories.value} useBlockTheme>
                        {{
                          title: (item: CategoryItem) => (
                            <div class={styles.collapseHeader}>
                              <span class={styles.categoryTitle}>{item.name}</span>
                              <span class={styles.categorySum}>{item.totalCount}</span>
                            </div>
                          ),
                          content: (item: CategoryItem) =>
                            renderGroupedVariableList(
                              item.category,
                              item.variables,
                              item.emptyText,
                            ),
                        }}
                      </Collapse>
                    </div>
                  </div>
                </Tab.TabPanel>

                {/* Plugin Output Variables Tab */}
                <Tab.TabPanel
                  name={VariablePanelTab.PLUGIN_OUTPUT}
                  label={t('flow.variable.pluginOutputVariables')}
                >
                  {renderReadonlyVariables(
                    filteredPluginOutputVariables.value,
                    t('flow.variable.noPluginOutputVariables'),
                    VariablePanelTab.PLUGIN_OUTPUT,
                  )}
                </Tab.TabPanel>

                {/* System Variables Tab */}
                <Tab.TabPanel
                  name={VariablePanelTab.SYSTEM}
                  label={t('flow.variable.systemVariables')}
                >
                  {renderReadonlyVariables(
                    filteredSystemVariableGroups.value,
                    t('flow.variable.noSystemVariables'),
                    VariablePanelTab.SYSTEM,
                  )}
                </Tab.TabPanel>
              </Tab>
            ) : (
              // Variable edit form view
              <div class={styles.editFormContainer}>
                <div class={styles.editFormHeader}>
                  <span class={styles.editFormBackIcon} onClick={handleCancel}>
                    <SvgIcon name="arrows-left-shape" />
                  </span>
                  <span class={styles.editFormTitle}>
                    {editingVariable.value
                      ? t('flow.variable.editVariable')
                      : t('flow.variable.addVariable')}
                  </span>
                </div>
                <VariableForm
                  variable={editingVariable.value}
                  category={currentCategory.value}
                  existingIds={existingIds.value}
                  editable={props.editable}
                  onSave={handleSaveVariable}
                  onCancel={handleCancel}
                />
              </div>
            )}
          </div>
        )}
      </div>
    )
  },
})
