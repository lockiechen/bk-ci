import { post, get, del, put } from '@/utils/http'
import { PROCESS_API_URL_PREFIX } from '@/utils/apiUrlPrefix'
import { type FlowInfo, type ExecuteDetailData } from '@/types/flow'

/**
 * 重试流水线响应数据
 */
export interface RetryPipelineResponse {
  id: string // 构建ID
  executeCount: number // 执行次数
  projectId: string // 项目ID
  pipelineId: string // 流水线ID
  num: number // 构建编号
  code?: number // 错误码（可选）
  message?: string // 错误信息（可选）
}

/**
 * 重放创作流状态
 */
export type ReplayStatus =
  | 'CANNOT_REPLAY'
  | 'CAN_REPLAY'
  | 'REPLAY_SUCCESS'
  | 'REPLAYING'
  | 'REPLAY_FAILED'

/**
 * 重放创作流响应数据
 */
export interface ReplayPipelineResponse {
  status: ReplayStatus // 重放状态
  id: string // 构建ID
  code?: number // 错误码（可选）
  message?: string // 错误信息（可选）
}

/**
 * 构建启动参数项
 */
export interface BuildParamItem {
  key: string
  value?: any
  valueType?: string
  readOnly?: boolean
  desc?: string
  defaultValue?: any
}

/**
 * 获取当前参数组合
 */
export interface BuildParamProperty {
  id: string
  name?: string
  required?: boolean
  constant?: boolean
  type?: string
  defaultValue?: any
  value?: any
  desc?: string
  readOnly?: boolean
  valueNotEmpty?: boolean
  removeFlag?: boolean
}

/**
 * 获取执行历史构建详情数据
 * @param projectId 项目ID
 * @param buildNo 构建编号
 * @param pipelineId 流水线ID
 * @param executeCount 执行次数（可选）
 * @returns 构建详情数据
 */
export function requestPipelineExecDetail({
  projectId,
  buildNo,
  pipelineId,
  executeCount,
}: {
  projectId: string
  buildNo: string
  pipelineId: string
  executeCount?: number
}): Promise<ExecuteDetailData> {
  try {
    const url = executeCount
    ? `${PROCESS_API_URL_PREFIX}/user/builds/projects/${projectId}/pipelines/${pipelineId}/builds/${buildNo}/record?executeCount=${executeCount}`
    : `${PROCESS_API_URL_PREFIX}/user/builds/projects/${projectId}/pipelines/${pipelineId}/builds/${buildNo}/record`

    const res = get<ExecuteDetailData>(url)
    return res
  } catch (error) {
    throw error
  }
}

/**
 * 获取指定版本号的流水线编排版本信息
 */
export function requestFlowVersion({
  projectId,
  pipelineId,
  version,
}: {
  projectId: string
  pipelineId: string
  version: number
}): Promise<FlowInfo> {
  try {
    const res = get<FlowInfo>(`${PROCESS_API_URL_PREFIX}/user/version/projects/${projectId}/pipelines/${pipelineId}/versions/${version}/info`)
    return res
  } catch (error) {
    throw error
  }
}

/**
 * 终止创作流执行
 * @param projectId 项目ID
 * @param pipelineId 创作流ID
 * @param buildId 构建ID
 * @returns 是否成功终止
 */
export function requestTerminatePipeline({
  projectId,
  pipelineId,
  buildId,
}: {
  projectId: string
  pipelineId: string
  buildId: string
}): Promise<boolean> {
  // TODO: 调用实际接口
  // return http.post(`/user/builds/projects/${projectId}/${pipelineId}/${buildId}`)
  //   .then(res => res.data)

  // Mock 数据
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟成功终止
      resolve(true)
    }, 500)
  })
}

/**
 * 重试创作流
 */
export function retryFlow({
  projectId,
  pipelineId,
  buildId,
}: {
  projectId: string
  pipelineId: string
  buildId: string
}): Promise<RetryPipelineResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'b-d8311316d4a04e349f48102f9553b568',
        executeCount: 3,
        projectId: 'default-project',
        pipelineId: 'p-fc1ba8afdea34eed8a95e668879f4115',
        num: 3,
      })
    }, 500)
  })
}

/**
 * 重放创作流
 */
export function replayFlow({
  projectId,
  pipelineId,
  buildId,
}: {
  projectId: string
  pipelineId: string
  buildId: string
}): Promise<ReplayPipelineResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'b-d8311316d4a04e349f48102f9553b568',
        status: 'REPLAYING',
      })
    }, 500)
  })
}

/**
 * 获取启动参数值
 */
export function requestBuildParams({
  projectId,
  pipelineId,
  buildId,
}: {
  projectId: string
  pipelineId: string
  buildId: string
}): Promise<BuildParamItem[]> {
  // TODO: 接入真实接口：return get<BuildParamItem[]>(`/user/builds/${projectId}/${pipelineId}/${buildId}/parameters`, { params })
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          key: 'gdsag',
          value: 'gdsags',
          valueType: 'STRING',
          readOnly: false,
          desc: 'gas',
          defaultValue: 'gdsags',
        },
        {
          key: 'wenjian',
          value: '/TestFile/task.json',
          valueType: 'CUSTOM_FILE',
          readOnly: false,
          desc: '',
          defaultValue: '/TestFile/task.json',
        },
        {
          key: 'jiaoben',
          value:
            '# 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell  # 旧的${}引用变量的方式已升级为${{}}，和bash原生引用变量的方式区分开  # 通过::set-variable命令字设置/修改全局变量 # echo "::set-variable name=<var_name>::<value>" # 在后续的插件表单中使用表达式${{variables.<var_name>}}引用这个变量 # 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用  # 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖) # echo "::set-output name=<output_name>::<value>" # 在后续的插件表单中使用表达式${{jobs.<job_id>.steps.<step_id>.outputs.<output_name>}}引用这个输出，其中job_id和step_id在对应的Job和Task上配置  # 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值 # setGateValue "CodeCoverage" $myValue # 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住  # cd $WORKSPACE 可进入当前工作空间目录',
          valueType: 'TEXTAREA',
          readOnly: false,
          desc: '',
          defaultValue:
            '# 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell  # 旧的${}引用变量的方式已升级为${{}}，和bash原生引用变量的方式区分开  # 通过::set-variable命令字设置/修改全局变量 # echo "::set-variable name=<var_name>::<value>" # 在后续的插件表单中使用表达式${{variables.<var_name>}}引用这个变量 # 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用  # 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖) # echo "::set-output name=<output_name>::<value>" # 在后续的插件表单中使用表达式${{jobs.<job_id>.steps.<step_id>.outputs.<output_name>}}引用这个输出，其中job_id和step_id在对应的Job和Task上配置  # 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值 # setGateValue "CodeCoverage" $myValue # 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住  # cd $WORKSPACE 可进入当前工作空间目录',
        },
        {
          key: 'FDDSA',
          value: 'FDSA',
          valueType: 'STRING',
          readOnly: false,
          desc: '65465',
          defaultValue: 'FDSA',
        },
        {
          key: 'GDFfds',
          value: 'gdsagdsadsagdsg',
          valueType: 'STRING',
          readOnly: true,
          desc: '',
          defaultValue: 'gdsagdsadsagdsg',
        },
        {
          key: 'gadsgdahhhh',
          value: 'gdsa',
          valueType: 'STRING',
          readOnly: true,
          desc: '',
          defaultValue: 'gdsa',
        },
      ])
    }, 300)
  })
}

/**
 * 获取启动参数组合
 */
export function requestBuildParamCombination({
  projectId,
  pipelineId,
  buildId,
}: {
  projectId: string
  pipelineId: string
  buildId: string
}): Promise<BuildParamProperty[]> {
  // TODO: 接入真实接口
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'gdsag',
          name: 'gdsag',
          required: false,
          constant: false,
          type: 'STRING',
          defaultValue: 'gdsags',
          value: 'gdsags',
          desc: 'gas',
          readOnly: false,
          valueNotEmpty: false,
          removeFlag: false,
        },
        {
          id: 'wenjian',
          name: 'wenjian',
          required: false,
          constant: false,
          type: 'CUSTOM_FILE',
          defaultValue: '/TestFile/task.json',
          value: '/TestFile/task.json',
          desc: '',
          readOnly: false,
          valueNotEmpty: false,
          removeFlag: false,
        },
        {
          id: 'jiaoben',
          name: 'jiaoben',
          required: true,
          constant: false,
          type: 'TEXTAREA',
          defaultValue:
            '# 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell  # 旧的${}引用变量的方式已升级为${{}}，和bash原生引用变量的方式区分开  # 通过::set-variable命令字设置/修改全局变量 # echo "::set-variable name=<var_name>::<value>" # 在后续的插件表单中使用表达式${{variables.<var_name>}}引用这个变量 # 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用  # 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖) # echo "::set-output name=<output_name>::<value>" # 在后续的插件表单中使用表达式${{jobs.<job_id>.steps.<step_id>.outputs.<output_name>}}引用这个输出，其中job_id和step_id在对应的Job和Task上配置  # 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值 # setGateValue "CodeCoverage" $myValue # 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住  # cd $WORKSPACE 可进入当前工作空间目录',
          value:
            '# 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell  # 旧的${}引用变量的方式已升级为${{}}，和bash原生引用变量的方式区分开  # 通过::set-variable命令字设置/修改全局变量 # echo "::set-variable name=<var_name>::<value>" # 在后续的插件表单中使用表达式${{variables.<var_name>}}引用这个变量 # 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用  # 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖) # echo "::set-output name=<output_name>::<value>" # 在后续的插件表单中使用表达式${{jobs.<job_id>.steps.<step_id>.outputs.<output_name>}}引用这个输出，其中job_id和step_id在对应的Job和Task上配置  # 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值 # setGateValue "CodeCoverage" $myValue # 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住  # cd $WORKSPACE 可进入当前工作空间目录',
          desc: '',
          readOnly: false,
          valueNotEmpty: true,
          removeFlag: false,
        },
        {
          id: 'FDDSA',
          name: 'FDSA',
          required: false,
          constant: true,
          type: 'STRING',
          defaultValue: 'FDSA',
          desc: '65465',
          readOnly: false,
          valueNotEmpty: false,
          removeFlag: false,
        },
        {
          id: 'GDFfds',
          name: '运行时只读运行时只读',
          required: true,
          constant: false,
          type: 'STRING',
          defaultValue: 'gdsagdsadsagdsg',
          value: 'gdsagdsadsagdsg',
          desc: '',
          readOnly: true,
          valueNotEmpty: false,
          removeFlag: false,
        },
        {
          id: 'gadsgdahhhh',
          name: '运行时只读',
          required: false,
          constant: false,
          type: 'STRING',
          defaultValue: 'gdsa',
          desc: '',
          readOnly: true,
          valueNotEmpty: false,
          removeFlag: false,
        },
      ])
    }, 300)
  })
}
