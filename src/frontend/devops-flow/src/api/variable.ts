/**
 * Variable management API
 */
import {
  VariableCategory,
  VariableType,
  type FlowVariable,
  type PluginOutputVariable,
  type ReadOnlyVariableGroup,
} from '@/types/variable'
import type { FlowModel } from './flowModel'
import type { JobCategory } from './atom'

/**
 * Get flow variables
 * @param flowId Flow ID
 */
export async function getFlowVariables(flowId: string): Promise<FlowVariable[]> {
  // TODO: Call actual API
  // const response = await http.get(`/api/flow/${flowId}/variables`)
  // return response.data

  // Mock data for development
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockVariables())
    }, 500)
  })
}

/**
 * Save flow variable
 * @param flowId Flow ID
 * @param variable Variable data
 */
export async function saveFlowVariable(
  flowId: string,
  variable: FlowVariable,
): Promise<FlowVariable> {
  // TODO: Call actual API
  // const response = await http.post(`/api/flow/${flowId}/variables`, variable)
  // return response.data

  // Mock data for development
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Variable saved:', variable)
      resolve(variable)
    }, 500)
  })
}

/**
 * Update flow variable
 * @param flowId Flow ID
 * @param variableId Variable ID
 * @param variable Variable data
 */
export async function updateFlowVariable(
  flowId: string,
  variableId: string,
  variable: FlowVariable,
): Promise<FlowVariable> {
  // TODO: Call actual API
  // const response = await http.put(`/api/flow/${flowId}/variables/${variableId}`, variable)
  // return response.data

  // Mock data for development
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Variable updated:', variable)
      resolve(variable)
    }, 500)
  })
}

/**
 * Update variable order
 * @param flowId Flow ID
 * @param category Variable category
 * @param group Group name
 * @param variableIds Array of variable IDs in new order
 */
export async function updateVariableOrder(
  flowId: string,
  category: JobCategory,
  group: string,
  variableIds: string[],
): Promise<void> {
  // TODO: Call actual API
  // await http.put(`/api/flow/${flowId}/variables/order`, {
  //   category,
  //   group,
  //   variableIds
  // })

  // Mock data for development
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Variable order updated:', { flowId, category, group, variableIds })
      resolve()
    }, 300)
  })
}

/**
 * Delete flow variable
 * @param flowId Flow ID
 * @param variableId Variable ID
 */
export async function deleteFlowVariable(flowId: string, variableId: string): Promise<void> {
  // TODO: Call actual API
  // await http.delete(`/api/flow/${flowId}/variables/${variableId}`)

  // Mock data for development
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Variable deleted:', variableId)
      resolve()
    }, 500)
  })
}

/**
 * Get mock variables for development
 */
function getMockVariables(): FlowVariable[] {
  return [
    {
      id: 'input_param1',
      name: 'Input Parameter 1',
      type: VariableType.STRING,
      category: VariableCategory.INPUT,
      defaultValue: '',
      desc: 'This is an input parameter',
      required: true,
      valueNotEmpty: true,
      groupLabel: 'Input Group',
      order: 0,
    },
    {
      id: 'input_param2',
      name: 'Input Parameter 2',
      type: VariableType.BOOLEAN,
      category: VariableCategory.INPUT,
      defaultValue: false,
      desc: 'Boolean input parameter',
      required: true,
      groupLabel: 'Input Group',
      order: 1,
    },
    {
      id: 'MAX_COUNT',
      name: 'Maximum Count',
      type: VariableType.STRING,
      category: VariableCategory.CONSTANT,
      defaultValue: '100',
      desc: 'Maximum count constant',
      groupLabel: 'Configuration',
      order: 0,
    },
    {
      id: 'API_ENDPOINT',
      name: 'API Endpoint',
      type: VariableType.STRING,
      category: VariableCategory.CONSTANT,
      defaultValue: 'https://api.example.com',
      desc: 'API endpoint URL',
      groupLabel: 'Configuration',
      order: 1,
    },
    {
      id: 'other_var1',
      name: 'Other Variable 1',
      type: VariableType.STRING,
      category: VariableCategory.OTHER,
      defaultValue: 'default value',
      desc: 'Other variable example',
      groupLabel: 'Miscellaneous',
      order: 0,
    },
    {
      id: 'other_var2',
      name: 'Other Variable 2',
      type: VariableType.ENUM,
      category: VariableCategory.OTHER,
      defaultValue: 'option1',
      desc: 'Enum variable example',
      options: [
        { id: 'option1', label: 'Option 1' },
        { id: 'option2', label: 'Option 2' },
        { id: 'option3', label: 'Option 3' },
      ],
      groupLabel: 'Miscellaneous',
      order: 1,
    },
  ]
}

/**
 * Get system variables (grouped)
 */
export async function getSystemVariables(): Promise<ReadOnlyVariableGroup[]> {
  // TODO: Call actual API to get system variables
  // const response = await http.get('/api/system/variables')
  // return response.data

  // Mock data for development
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockSystemVariableGroups())
    }, 300)
  })
}

/**
 * Get plugin output variables from flow model
 * @param model Flow model
 */
export function getPluginOutputVariablesFromModel(
  model: FlowModel | null,
): ReadOnlyVariableGroup[] {
  if (!model || !model.stages) {
    return []
  }

  const pluginVariables: ReadOnlyVariableGroup[] = []

  // Iterate through stages (skip trigger stage at index 0)
  model.stages.slice(1).forEach((stage) => {
    stage.containers.forEach((container) => {
      container.elements.forEach((element) => {
        pluginVariables.push({
          hasStepId: element.stepId && typeof element.stepId !== 'undefined' ? true : false,
          name: element.name,
          params: element.data?.output ?? [],
        })
      })
    })
  })
  console.log(pluginVariables)
  return pluginVariables
}

/**
 * Mock system variables (grouped)
 */
function getMockSystemVariableGroups(): ReadOnlyVariableGroup[] {
  return [
    {
      name: '流水线内置变量',
      params: [
        {
          id: 'ci.actor',
          name: 'ci.actor',
          desc: '当前构建的启动人',
        },
        {
          id: 'ci.build-no',
          name: 'ci.build-no',
          desc: '构建号，开启推荐版本号时有效',
        },
        {
          id: 'ci.build_id',
          name: 'ci.build_id',
          desc: '当前构建ID',
        },
        {
          id: 'ci.build_msg',
          name: 'ci.build_msg',
          desc: '构建信息, 最长 128 个字, 取值规则：<br/>- Push 事件：commit message<br/>- Mr 事件：Mr title<br/>- Note 事件：评论内容<br/>- Issue 事件：Issue标题<br/>- Cr 事件：Cr title<br/>- Tag 事件：Tag name<br/>- 手动触发：触发时页面上填写的构建信息',
        },
        {
          id: 'ci.build_num',
          name: 'ci.build_num',
          desc: '当前构建的唯一标示ID，从1开始自增',
        },
        {
          id: 'ci.build_start_type',
          name: 'ci.build_start_type',
          desc: '构建启动方式可能的值有 MANUAL、TIME_TRIGGER、WEB_HOOK、SERVICE、FLOW或者REMOTE',
        },
        {
          id: 'ci.failed_tasknames',
          name: 'ci.failed_tasknames',
          desc: '创作流执行失败的所有TASK，值格式：TASK别名,TASK别名,TASK别名',
        },
        {
          id: 'ci.failed_tasks',
          name: 'ci.failed_tasks',
          desc: '创作流执行失败的所有TASK，值格式：[STAGE别名][JOB别名]TASK别名。若有多个并发JOB失败，使用换行(\\n)分隔',
        },
        {
          id: 'ci.flow_creator',
          name: 'ci.flow_creator',
          desc: '创作流创建者',
        },
        {
          id: 'ci.flow_id',
          name: 'ci.flow_id',
          desc: '创作流ID',
        },
        {
          id: 'ci.flow_modifier',
          name: 'ci.flow_modifier',
          desc: '创作流最新修改者',
        },
        {
          id: 'ci.flow_name',
          name: 'ci.flow_name',
          desc: '创作流名称',
        },
        {
          id: 'ci.flow_version',
          name: 'ci.flow_version',
          desc: '创作流版本号',
        },
        {
          id: 'ci.project_id',
          name: 'ci.project_id',
          desc: '项目ID，项目的唯一标识',
        },
        {
          id: 'ci.project_name',
          name: 'ci.project_name',
          desc: '项目名称',
        },
        {
          id: 'ci.remark',
          name: 'ci.remark',
          desc: '流水线备注，可在脚本插件中通过 echo ::set-remark xxx 的方式设置值',
        },
        {
          id: 'ci.workspace',
          name: 'ci.workspace',
          desc: '当前 Job 的工作空间',
        },
      ],
    },
    {
      name: 'Job 内置变量',
      params: [
        {
          id: 'job.container.network',
          name: 'job.container.network',
          desc: '当前 job 所在的网络区域, 可能的取值为: IDC/DEVNET/OA',
        },
        {
          id: 'job.container.node_alias',
          name: 'job.container.node_alias',
          desc: '使用第三方构建机集群时生效, 当前job调度到的节点别名',
        },
        {
          id: 'job.id',
          name: 'job.id',
          desc: '当前创作流下 job 的唯一标识',
          remark: '当用户自定义标识时, 自行保证唯一性. 缺省时, 系统内置生成',
        },
        {
          id: 'job.index',
          name: 'job.index',
          desc: '在 matrix job 下, 从0开始的索引. 和 matrix job 解析出来的顺序有关',
          remark: '可以根据 index 去获取 matrix job 下指定 job 的具体步骤输出',
        },
        {
          id: 'job.name',
          name: 'job.name',
          desc: 'job 名称',
          remark: '缺省时, 按照配置顺序为 job-1、job-2……job-N',
        },
        {
          id: 'job.os',
          name: 'job.os',
          desc: '当前 job 执行机器的操作系统: LINUX/WINDOWS/MACOS',
        },
        {
          id: 'job.stage_id',
          name: 'job.stage_id',
          desc: 'job 所属的 stage id',
        },
        {
          id: 'job.stage_name',
          name: 'job.stage_name',
          desc: 'job 所属的 stage name',
        },
        {
          id: 'jobs.<job-id>.outcome',
          name: 'jobs.<job-id>.outcome',
          desc: '当前 job 的结果, 可能的取值为: SUCCEED/FAILED/CANCELED/SKIP',
          remark:
            '当 continue-on-error=true 且 job 执行失败时, status=SUCCEED, outcome=FAILED. 在下游步骤中才可以获取到.',
        },
        {
          id: 'jobs.<job-id>.status',
          name: 'jobs.<job-id>.status',
          desc: '当前 job 的状态, 可能的取值为: SUCCEED/FAILED/CANCELED/SKIP',
          remark:
            '当 continue-on-error=true 且 job 执行失败时, status=SUCCEED, outcome=FAILED. 在下游步骤中才可以获取到.',
        },
      ],
    },
    {
      name: 'Step 内置变量',
      params: [
        {
          id: 'step.id',
          name: 'step.id',
          desc: '当前插件 TASK ID, 32位, 全局唯一',
          remark: '系统自动生成 (e-开头)',
        },
        {
          id: 'step.name',
          name: 'step.name',
          desc: 'step 名称',
          remark: '缺省时, 为对应的插件的名称',
        },
        {
          id: 'step.retry-count-auto',
          name: 'step.retry-count-auto',
          desc: '当前步骤的自动重试次数',
        },
        {
          id: 'step.retry-count-manual',
          name: 'step.retry-count-manual',
          desc: '当前步骤的手动重试次数',
        },
        {
          id: 'steps.<step-id>.outcome',
          name: 'steps.<step-id>.outcome',
          desc: 'step 的结果, 可能的取值为: SUCCEED/FAILED/CANCELED/SKIP',
          remark:
            '当 continue-on-error=true 且 step 执行失败时, status=SUCCEED, outcome=FAILED. 在下游步骤中才可以获取到.',
        },
        {
          id: 'steps.<step-id>.status',
          name: 'steps.<step-id>.status',
          desc: 'step 的状态, 可能的取值为: SUCCEED/FAILED/CANCELED/SKIP',
          remark:
            '当 continue-on-error=true 且 step 执行失败时, status=SUCCEED, outcome=FAILED. 在下游步骤中才可以获取到.',
        },
      ],
    },
  ]
}
