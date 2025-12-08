/**
 * Variable type definitions for devops-flow
 */

/**
 * Variable types
 */
export enum VariableType {
  STRING = 'STRING',
  TEXTAREA = 'TEXTAREA',
  BOOLEAN = 'BOOLEAN',
  ENUM = 'ENUM',
  MULTIPLE = 'MULTIPLE',
}

/**
 * Variable category
 */
export enum VariableCategory {
  INPUT = 'input', // 入参
  CONSTANT = 'constant', // 常量
  OTHER = 'other', // 其他变量
}

/**
 * Variable panel tab types
 */
export enum VariablePanelTab {
  VARIABLES = 'variables', // 变量
  PLUGIN_OUTPUT = 'plugin_output', // 插件输出变量
  SYSTEM = 'system', // 系统变量
}

/**
 * Variable data structure
 */
export interface FlowVariable {
  id: string // Variable ID (unique identifier)
  name: string // Variable alias (display name)
  type: VariableType // Variable type
  category: VariableCategory // Variable category
  defaultValue: string | boolean | string[] // Default value
  desc?: string // Description
  required?: boolean // Is required (for input params)
  readOnly?: boolean // Is read-only
  options?: VariableOption[] // Options for ENUM/MULTIPLE types
  valueNotEmpty?: boolean // Value cannot be empty (for input params)
  groupLabel?: string // Group label for categorization
  order?: number // Sort order within group
}

/**
 * Variable option for ENUM/MULTIPLE types
 */
export interface VariableOption {
  id: string
  label: string
}

/**
 * Plugin output variable
 */
export interface PluginOutputVariable {
  id: string // Variable ID
  name: string // Variable name
  desc?: string // Description
  stepId?: string // Step ID that outputs this variable
}

/**
 * System variable
 */
export interface SystemVariable {
  id: string // Variable ID
  name: string // Variable name
  desc?: string // Description
  remark?: string // Remark
  value?: string // Current value (if available)
}

/**
 * Default variable values by type
 */
export const DEFAULT_VARIABLE_VALUES: Record<VariableType, FlowVariable> = {
  [VariableType.STRING]: {
    id: '',
    name: '',
    type: VariableType.STRING,
    category: VariableCategory.OTHER,
    defaultValue: '',
    required: false,
    readOnly: false,
    order: 0,
  },
  [VariableType.TEXTAREA]: {
    id: '',
    name: '',
    type: VariableType.TEXTAREA,
    category: VariableCategory.OTHER,
    defaultValue: '',
    required: false,
    readOnly: false,
    order: 0,
  },
  [VariableType.BOOLEAN]: {
    id: '',
    name: '',
    type: VariableType.BOOLEAN,
    category: VariableCategory.OTHER,
    defaultValue: false,
    required: false,
    readOnly: false,
    order: 0,
  },
  [VariableType.ENUM]: {
    id: '',
    name: '',
    type: VariableType.ENUM,
    category: VariableCategory.OTHER,
    defaultValue: '',
    required: false,
    readOnly: false,
    options: [],
    order: 0,
  },
  [VariableType.MULTIPLE]: {
    id: '',
    name: '',
    type: VariableType.MULTIPLE,
    category: VariableCategory.OTHER,
    defaultValue: [],
    required: false,
    readOnly: false,
    options: [],
    order: 0,
  },
}

/**
 * Variable type list for selector
 */
export const VARIABLE_TYPE_LIST = [
  { id: VariableType.STRING, name: 'string' },
  { id: VariableType.TEXTAREA, name: 'textarea' },
  { id: VariableType.BOOLEAN, name: 'boolean' },
  { id: VariableType.ENUM, name: 'enum' },
  { id: VariableType.MULTIPLE, name: 'multiple' },
]

/**
 * Constant type list (subset of variable types)
 */
export const CONSTANT_TYPE_LIST = [
  VariableType.STRING,
  VariableType.TEXTAREA,
  VariableType.ENUM,
  VariableType.MULTIPLE,
]

/**
 * Validate variable ID
 * - Must start with letter or underscore
 * - Can contain letters, numbers, underscores
 * - For constants: must be all uppercase
 */
export function validateVariableId(id: string, isConstant: boolean): boolean {
  if (!id) return false

  // Basic pattern: start with letter or underscore, followed by letters, numbers, underscores
  const basicPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/
  if (!basicPattern.test(id)) return false

  // For constants: must be all uppercase
  if (isConstant) {
    return /^[A-Z_][A-Z0-9_]*$/.test(id)
  }

  return true
}

/**
 * Get variable type display name
 */
export function getVariableTypeName(type: VariableType): string {
  const typeItem = VARIABLE_TYPE_LIST.find(item => item.id === type)
  return typeItem?.name || type
}


/**
 * System variable group
 */
export interface ReadOnlyVariableGroup {
  hasStepId?: boolean // Whether any plugin output variable is missing stepId
  name: string // Group name
  params: SystemVariable[] // Variables in this group
}
