/**
 * Hooks 统一导出
 * 
 * 优化后的 Hooks 结构：
 * - useAtom: 统一的插件数据管理（合并自 useAtomData、useAtomManager、useAtomVersion）
 * - useYamlHighlight: YAML 高亮管理（合并自 useAuthoringEnv、useFlowConfigCode）
 * - useFlowModel: Flow 模型管理（核心 hook）
 * - useFlowVariables: Flow 变量管理
 * - useFlowListData: 创作流列表数据管理
 * - useFlowGroupData: 创作流分组数据管理
 * - useDeleteConfirm: 删除确认弹窗
 * - useEditingPos: 编辑位置管理
 * - useTableHeight: 表格高度自适应
 * - useNewFlow: 新建创作流
 * - useAddToGroup: 添加到分组
 * - useExecutionRecordData: 执行记录数据
 * - useTriggerRecordData: 触发记录数据
 */

// 核心 Hooks
export { useEditingPos, type EditingPos } from './useEditingPos'
export { useFlowModel, type UseFlowModelOptions } from './useFlowModel'
export { useFlowVariables } from './useFlowVariables'

// 插件管理 - 统一入口
export { useAtom, type UseAtomOptions } from './useAtom'

// YAML 高亮 - 统一入口
export { useYamlHighlight, type FlowConfigSection, type UseYamlHighlightOptions } from './useYamlHighlight'

// 列表和分组
export { useFlowGroupData } from './useFlowGroupData'
export { useFlowListData, type Styles as FlowListStyles } from './useFlowListData'

// 记录管理
export { useExecutionRecordData } from './useExecutionRecordData'
export { useTriggerRecordData, type Styles as TriggerRecordStyles } from './useTriggerRecordData'

// 弹窗和交互
export { useAddToGroup } from './useAddToGroup'
export { useDeleteConfirm } from './useDeleteConfirm'
export { useNewFlow } from './useNewFlow'

// 工具 Hooks
export { useTableHeight } from './useTableHeight'

// ============================================================================
// 以下为兼容层，建议迁移到新的统一 Hook
// ============================================================================

/**
 * @deprecated 请使用 useAtom 替代
 * 将在下个大版本移除
 */
export { useAtomData } from './useAtomData'

/**
 * @deprecated 请使用 useAtom 替代
 * 将在下个大版本移除
 */
export { useAtomManager } from './useAtomManager'

/**
 * @deprecated 请使用 useAtom 替代，调用 loadVersionList 和 getDefaultVersion
 * 将在下个大版本移除
 */
export { DEFAULT_VERSION, useAtomVersion } from './useAtomVersion'

/**
 * @deprecated 请使用 useYamlHighlight 替代
 * 将在下个大版本移除
 */
export { useAuthoringEnv } from './useAuthoringEnv'

/**
 * @deprecated 请使用 useYamlHighlight 替代
 * 将在下个大版本移除
 */
export { useFlowConfigCode, type FlowConfigSection as DeprecatedFlowConfigSection } from './useFlowConfigCode'

/**
 * @deprecated 过度封装，请直接使用 useFlowInfoStore
 * 将在下个大版本移除
 */
export { useFlowInfo } from './useFlowInfo'

/**
 * @deprecated 过度封装，请直接使用 useExecuteDetailStore
 * 将在下个大版本移除
 */
export { useExecuteDetail, type ExecuteInfo } from './useExecuteDetail'

/**
 * @deprecated 过度封装，请直接使用 useChangeLogStore
 * 将在下个大版本移除
 */
export { useChangeLog } from './useChangeLog'

/**
 * @deprecated 过度封装，请直接使用 usePermissionDelegationStore
 * 将在下个大版本移除
 */
export { usePermissionDelegation } from './usePermissionDelegation'

