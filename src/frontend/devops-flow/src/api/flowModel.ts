/**
 * 创作流模型相关 API
 * 
 * NOTE: Core types (Stage, Container, Element, etc.) are defined in @/types/flow.ts
 * and re-exported here for backward compatibility.
 */

import { get } from '@/utils/http'
import type { FlowModel, FlowSettings } from '../types/flow'

// Re-export types from types/flow.ts for backward compatibility
export type {
  AdditionalOptions, CheckConfig, Container, CustomVariable,
  DispatchType, Element, FlowModel,
  FlowSettings, JobControlOption,
  MatrixControlOption,
  MutexGroup, Param, Stage, StageControlOption, Subscription
} from '../types/flow'

export interface FlowModelAndSetting {
  version: number
  versionName: string
  baseVersion: number
  baseVersionName: string
  modelAndSetting: {
    model: FlowModel
    setting: FlowSettings
  }
  yamlPreview: YamlPreview
  canDebug: boolean
  yamlSupported: boolean
  updater: string
  updateTime: number
}

export interface YamlPreview {
  yaml: string
  [key: string]: unknown
}

/**
 * 获取 Flow 模型数据
 * @param flowId 创作流 ID
 * @param version 版本号（可选）
 */
export async function getFlowModel(projectId: string, flowId: string, version?: string): Promise<FlowModelAndSetting> {
  const response = await get<FlowModelAndSetting>(`/process/api/user/version/projects/${projectId}/pipelines/${flowId}/versions/${version}`);
  return response;

  
}

/**
 * 保存 Flow 模型数据的请求参数
 */
export interface SaveFlowModelParams {
  projectId: string
  pipelineId?: string
  baseVersion?: string
  storageType?: 'MODEL' | 'YAML'
  modelAndSetting?: {
    model: FlowModel
    setting?: FlowSettings
  }
  yaml?: string
}

/**
 * 保存 Flow 模型数据的响应
 */
export interface SaveFlowModelResponse {
  version: string
  versionName: string
  flowId: string
}

/**
 * 保存 Flow 模型数据
 * @param params 保存参数
 */
export async function saveFlowModel(params: SaveFlowModelParams): Promise<SaveFlowModelResponse> {
  const { post } = await import('@/utils/http')
  const { projectId, ...restParams } = params

  const response = await post<SaveFlowModelResponse>(
    `/process/api/user/version/projects/${projectId}/saveDraft`,
    restParams,
  )

  return response
}

/**
 * 将 Flow 模型转换为 YAML 格式
 * @param model Flow 模型数据
 */
export function flowModelToYaml(model: FlowModel): string {
  // TODO: 实现实际的转换逻辑
  // 这里简单返回 JSON 字符串作为示例
  return `version: v3.0
name: ${model.name || 'Sample Flow'}
desc: ${model.desc || 'Flow with authoring environment configuration'}

# Authoring Environment Configuration
authoring-env:
  name: 我的创作环境
  id: env-001
  creation-nodes:
    - id: ins-be4830935d0ed3db
      name: Node-1
      status: online
    - id: ins-be4830935d0ed3db
      name: Node-2
      status: online
    - id: ins-be4830935d0ed3db
      name: Node-3
      status: online
  workspace: 默认为<Agent安装目录>/workspace/<创作流ID>/
  description: Default authoring environment for development

on:
  manual: enabled
variables:
  gray_pod_num:
    value: "1"
    props:
      label: 灰度POD个数
      type: selector
      options:
      - id: "1"
        label: "1"
      - id: "2"
        label: "2"
      - id: "3"
        label: "3"
      required: true
  gray_version:
    value: ""
    props:
      label: 灰度版本
      type: selector
      options: []
      payload:
        type: remote
        url: xxx.com
        dataPath: data.data
        paramId: version
        paramName: version
stages:
- name: stage-1
  label:
  - Build
  jobs:
    job_Cww:
      name: 开始灰度
      steps:
      - name: Bash
        id: step1
        uses: linuxScript@1.*
        with:
          script: |-
            # 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell

            # 旧的$\{\}引用变量的方式已升级为$\{\{\}\}，避免和bash原生方式冲突

            # 通过::set-variable命令字设置/修改全局变量(在当前步骤执行完才生效)
            # echo "::set-variable name=<var_name>::<value>"
            # 在后续的插件表单中使用表达式$\{\{variables.<var_name>\}\}引用这个变量(<var_name>替换为真实变量)
            # 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用

            # 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖)
            # echo "::set-output name=<output_name>::<value>"
            # 在后续的插件表单中使用表达式$\{\{jobs.<job_id>.steps.<step_id>.outputs.<output_name>\}\}引用这个输出，其中job_id和step_id在对应的Job和Task上配置

            # 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值
            # setGateValue "CodeCoverage" $myValue
            # 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住

            # cd $\{\{ci.workspace\}\} 可进入当前工作空间目录

            echo $\{\{variables.gray_pod_num\}\}
            echo $\{\{variables.gray_version\}\}
- name: stage-2
  label:
  - Build
  jobs:
    job_rsr:
      name: 灰度审核
      runs-on:
        pool-name: agentless
      steps:
      - name: 人工审核
        uses: manualReviewUserTask@1.*
        with:
          reviewUsers:
          - crazyfu
          desc: 是否继续灰度
          namespace: gray
          notifyType:
          - RTX
          notifyTitle: 是否继续灰度
          markdownContent: true
        continue-on-error: true
- name: stage-3
  label:
  - Build
  jobs:
    job_Q4E:
      name: 继续灰度
      if:
        mode: RUN_WHEN_ALL_PARAMS_MATCH
        params:
          gray_MANUAL_REVIEW_RESULT: PROCESS
      steps:
      - name: Bash
        uses: linuxScript@1.*
        with:
          script: |-
            # 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell

            # 旧的$\{\}引用变量的方式已升级为$\{\{\}\}，避免和bash原生方式冲突

            # 通过::set-variable命令字设置/修改全局变量(在当前步骤执行完才生效)
            # echo "::set-variable name=<var_name>::<value>"
            # 在后续的插件表单中使用表达式$\{\{variables.<var_name>\}\}引用这个变量(<var_name>替换为真实变量)
            # 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用

            # 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖)
            # echo "::set-output name=<output_name>::<value>"
            # 在后续的插件表单中使用表达式$\{\{jobs.<job_id>.steps.<step_id>.outputs.<output_name>\}\}引用这个输出，其中job_id和step_id在对应的Job和Task上配置

            # 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值
            # setGateValue "CodeCoverage" $myValue
            # 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住

            # cd $\{\{ci.workspace\}\} 可进入当前工作空间目录

            echo "continue"
    job_fJk:
      name: 回退
      if:
        mode: RUN_WHEN_ALL_PARAMS_MATCH
        params:
          gray_MANUAL_REVIEW_RESULT: ABORT
      steps:
      - name: Bash
        uses: linuxScript@1.*
        with:
          script: |-
            # 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell

            # 旧的$\{\}引用变量的方式已升级为$\{\{\}\}，避免和bash原生方式冲突

            # 通过::set-variable命令字设置/修改全局变量(在当前步骤执行完才生效)
            # echo "::set-variable name=<var_name>::<value>"
            # 在后续的插件表单中使用表达式$\{\{variables.<var_name>\}\}引用这个变量(<var_name>替换为真实变量)
            # 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用

            # 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖)
            # echo "::set-output name=<output_name>::<value>"
            # 在后续的插件表单中使用表达式$\{\{jobs.<job_id>.steps.<step_id>.outputs.<output_name>\}\}引用这个输出，其中job_id和step_id在对应的Job和Task上配置

            # 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值
            # setGateValue "CodeCoverage" $myValue
            # 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住

            # cd $\{\{ci.workspace\}\} 可进入当前工作空间目录

            echo "rollback1"
- name: stage-4
  label:
  - Build
  if:
    mode: RUN_WHEN_ALL_PARAMS_MATCH
    params:
      gray_MANUAL_REVIEW_RESULT: PROCESS
  jobs:
    job_G2t:
      name: 全量审核
      runs-on:
        pool-name: agentless
      steps:
      - name: 人工审核
        uses: manualReviewUserTask@1.*
        with:
          reviewUsers:
          - crazyfu
          namespace: full
          notifyType:
          - RTX
          markdownContent: true
        continue-on-error: true
- name: stage-5
  label:
  - Build
  if:
    mode: RUN_WHEN_ALL_PARAMS_MATCH
    params:
      gray_MANUAL_REVIEW_RESULT: PROCESS
  jobs:
    job_tac:
      name: 全量发布
      if:
        mode: RUN_WHEN_ALL_PARAMS_MATCH
        params:
          full_MANUAL_REVIEW_RESULT: PROCESS
      steps:
      - name: Bash
        uses: linuxScript@1.*
        with:
          script: |-
            # 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell

            # 旧的$\{\}引用变量的方式已升级为$\{\{\}\}，避免和bash原生方式冲突

            # 通过::set-variable命令字设置/修改全局变量(在当前步骤执行完才生效)
            # echo "::set-variable name=<var_name>::<value>"
            # 在后续的插件表单中使用表达式$\{\{variables.<var_name>\}\}引用这个变量(<var_name>替换为真实变量)
            # 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用

            # 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖)
            # echo "::set-output name=<output_name>::<value>"
            # 在后续的插件表单中使用表达式$\{\{jobs.<job_id>.steps.<step_id>.outputs.<output_name>\}\}引用这个输出，其中job_id和step_id在对应的Job和Task上配置

            # 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值
            # setGateValue "CodeCoverage" $myValue
            # 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住

            # cd $\{\{ci.workspace\}\} 可进入当前工作空间目录

            echo "full"
    job_PfX:
      name: 回退
      if:
        mode: RUN_WHEN_ALL_PARAMS_MATCH
        params:
          full_MANUAL_REVIEW_RESULT: ABORT
      steps:
      - name: Bash
        uses: linuxScript@1.*
        with:
          script: |-
            # 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell

            # 旧的$\{\}引用变量的方式已升级为$\{\{\}\}，避免和bash原生方式冲突

            # 通过::set-variable命令字设置/修改全局变量(在当前步骤执行完才生效)
            # echo "::set-variable name=<var_name>::<value>"
            # 在后续的插件表单中使用表达式$\{\{variables.<var_name>\}\}引用这个变量(<var_name>替换为真实变量)
            # 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用

            # 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖)
            # echo "::set-output name=<output_name>::<value>"
            # 在后续的插件表单中使用表达式$\{\{jobs.<job_id>.steps.<step_id>.outputs.<output_name>\}\}引用这个输出，其中job_id和step_id在对应的Job和Task上配置

            # 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值
            # setGateValue "CodeCoverage" $myValue
            # 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住

            # cd $\{\{ci.workspace\}\} 可进入当前工作空间目录

            echo "rollback2"
notices:
- if: FAILURE
  type:
  - email
  - wework-message
  receivers:
  - "$\{\{ci.actor\}\}"
  content: "【$\{\{ci.project_name\}\}】- 【$\{\{ci.flow_name\}\}】#$\{\{ci.build_num\}\} 执行失败，耗时$\{\{ci.flow_execute_time\}\}, 触发人: $\{\{ci.actor\}\}。"
concurrency:
  queue-timeout-minutes: 10
syntax-dialect: INHERIT
`
}

/**
 * 将 YAML 格式转换为 Flow 模型
 * @param yaml YAML 字符串
 */
export function yamlToFlowModel(yaml: string): FlowModel {
  // TODO: 实现实际的转换逻辑
  // 这里简单解析 JSON 字符串作为示例
  try {
    return JSON.parse(yaml)
  } catch (error) {
    console.error('Failed to parse YAML:', error)
    throw new Error('Invalid YAML format')
  }
}

/**
 * 获取 Mock Flow 数据
 */
export function getMockFlowModel(): FlowModelAndSetting {
  return {
    version: 8,
    versionName: '',
    baseVersion: 7,
    baseVersionName: 'V7(P7.T1.14)',
    modelAndSetting: {
      model: {
        '@type': 'Model',
        name: 'parameters',
        desc: '',
        stages: [
          {
            containers: [
              {
                '@type': 'trigger',
                id: '0',
                name: 'trigger',
                elements: [
                  {
                    '@type': 'manualTrigger',
                    name: '手动触发',
                    id: 'T-1-1-1',
                    canElementSkip: false,
                    useLatestParameters: false,
                    executeCount: 1,
                    version: '1.*',
                    classType: 'manualTrigger',
                    atomCode: 'manualTrigger',
                    taskAtom: '',
                  },
                ],
                params: [
                  {
                    id: 'URL',
                    name: '',
                    required: true,
                    constant: false,
                    type: 'ENUM',
                    defaultValue: 'dream_code',
                    options: [],
                    desc: '',
                    category: '',
                    readOnly: false,
                    valueNotEmpty: false,
                    payload: {
                      paramId: 'package_name',
                      paramName: 'package_name_desc',
                      type: 'remote',
                      url: 'https://api.wuji.qq.com/x/api/wuji_cache/object?appid=game_block_test&schemaid=yuanmeng_offline_package&schemakey=43847b782cb14eb9ae3651a0915ca387',
                    },
                  },
                  {
                    id: 'hello',
                    name: '',
                    required: true,
                    constant: false,
                    type: 'REPO_REF',
                    defaultValue: {
                      branch: 'master',
                      'repo-name': 'lockiechen/awesome-proj',
                    },
                    category: '',
                    readOnly: false,
                    valueNotEmpty: false,
                  },
                  {
                    id: 'a',
                    name: '',
                    required: true,
                    constant: false,
                    type: 'CONTAINER_TYPE',
                    defaultValue: 'BUILD_mqngglvp_9.77.80.88',
                    options: [],
                    desc: '',
                    category: '',
                    readOnly: false,
                    valueNotEmpty: false,
                  },
                  {
                    id: 'sssd',
                    name: '',
                    required: true,
                    constant: false,
                    type: 'ENUM',
                    defaultValue: '',
                    options: [
                      {
                        key: 'ab',
                        value: 'ab',
                      },
                      {
                        key: 'c',
                        value: 'c',
                      },
                      {
                        key: 'd',
                        value: 'd',
                      },
                      {
                        key: 'e',
                        value: 'e',
                      },
                      {
                        key: 'wf',
                        value: 'wf',
                      },
                      {
                        key: 's',
                        value: 's',
                      },
                    ],
                    desc: '',
                    category: '',
                    readOnly: false,
                    valueNotEmpty: false,
                  },
                  {
                    id: 'git',
                    name: '',
                    required: true,
                    constant: false,
                    type: 'GIT_REF',
                    defaultValue: 'abc',
                    options: [],
                    desc: '',
                    category: '',
                    readOnly: false,
                    valueNotEmpty: false,
                  },
                  {
                    id: 'codelib',
                    name: '',
                    required: true,
                    constant: false,
                    type: 'CODE_LIB',
                    defaultValue: 'bkdevops/bkci_app_sign',
                    options: [],
                    desc: '',
                    category: '',
                    readOnly: false,
                    valueNotEmpty: false,
                  },
                  {
                    id: 'bool',
                    name: '',
                    required: true,
                    constant: false,
                    type: 'BOOLEAN',
                    defaultValue: true,
                    desc: '',
                    category: '',
                    displayCondition: {},
                    readOnly: false,
                    valueNotEmpty: false,
                  },
                  {
                    id: 'relky',
                    name: '',
                    required: true,
                    constant: false,
                    type: 'STRING',
                    defaultValue: '',
                    desc: '',
                    category: '',
                    displayCondition: {
                      bool: 'true',
                      sssd: 'ab',
                    },
                    readOnly: false,
                    valueNotEmpty: false,
                  },
                  {
                    id: 'file',
                    name: '',
                    required: true,
                    constant: false,
                    type: 'CUSTOM_FILE',
                    defaultValue: '',
                    desc: '',
                    category: '',
                    displayCondition: {},
                    readOnly: false,
                    valueNotEmpty: false,
                  },
                ],
                containerId: '0',
                containerHashId: 'c-4b479f010d284408a923ad87621af684',
                matrixGroupFlag: false,
                classType: 'trigger',
              },
            ],
            id: 'stage-1',
            name: 'stage-1',
            tag: ['28ee946a59f64949a74f3dee40a1bda4'],
            fastKill: false,
            finally: false,
          },
          {
            containers: [
              {
                '@type': 'vmBuild',
                id: '1',
                name: '构建环境-Linux',
                mutexGroup: {
                  enable: true,
                  mutexGroupName: 'mutexGroup',
                  queueEnable: true,
                  timeoutVar: '10',
                  queue: 10,
                },
                matrixControlOption: {
                  strategyStr: 'strategyStr',
                  includeCaseStr: 'includeCaseStr',
                  excludeCaseStr: 'excludeCaseStr',
                  fastKill: false,
                  maxConcurrency: 10,
                },
                elements: [
                  {
                    '@type': 'linuxScript',
                    name: 'Bash',
                    id: 'e-b5aa9d78367f4ab9b8211e898a998fc0',
                    stepId: 'x_k',
                    scriptType: 'SHELL',
                    script: 'setEnv "abc" 123',
                    continueNoneZero: false,
                    enableArchiveFile: false,
                    archiveFile: '',
                    additionalOptions: {
                      enable: true,
                      continueWhenFailed: false,
                      manualSkip: false,
                      retryWhenFailed: false,
                      retryCount: 1,
                      manualRetry: false,
                      timeout: 900,
                      timeoutVar: '900',
                      runCondition: 'PRE_TASK_SUCCESS',
                      pauseBeforeExec: false,
                      subscriptionPauseUser: 'lockiechen',
                      otherTask: '',
                      customVariables: [
                        {
                          key: 'param1',
                          value: '',
                        },
                      ],
                      customCondition: '',
                      enableCustomEnv: true,
                    },
                    executeCount: 1,
                    version: '1.*',
                    classType: 'linuxScript',
                    atomCode: 'linuxScript',
                    taskAtom: '',
                  },
                  {
                    '@type': 'linuxScript',
                    name: 'Bash',
                    id: 'e-9920c0ce733b44da9fb1dda157a1ce93',
                    stepId: 'xa5',
                    scriptType: 'SHELL',
                    script: 'setEnv "abc" 123',
                    continueNoneZero: false,
                    enableArchiveFile: false,
                    archiveFile: '',
                    additionalOptions: {
                      enable: true,
                      continueWhenFailed: false,
                      manualSkip: false,
                      retryWhenFailed: false,
                      retryCount: 1,
                      manualRetry: false,
                      timeout: 900,
                      timeoutVar: '900',
                      runCondition: 'PRE_TASK_SUCCESS',
                      pauseBeforeExec: false,
                      subscriptionPauseUser: 'lockiechen',
                      otherTask: '',
                      customVariables: [
                        {
                          key: 'param1',
                          value: '',
                        },
                      ],
                      customCondition: '',
                      enableCustomEnv: true,
                    },
                    executeCount: 1,
                    version: '1.*',
                    classType: 'linuxScript',
                    atomCode: 'linuxScript',
                    taskAtom: '',
                  },
                  {
                    '@type': 'linuxScript',
                    name: 'Bash',
                    id: 'e-37a7768ab185416db9a4b255a6cb0749',
                    stepId: 'tdS',
                    scriptType: 'SHELL',
                    script: 'setEnv "abc" 123',
                    continueNoneZero: false,
                    enableArchiveFile: false,
                    archiveFile: '',
                    additionalOptions: {
                      enable: true,
                      continueWhenFailed: false,
                      manualSkip: false,
                      retryWhenFailed: false,
                      retryCount: 1,
                      manualRetry: false,
                      timeout: 900,
                      timeoutVar: '900',
                      runCondition: 'PRE_TASK_SUCCESS',
                      pauseBeforeExec: false,
                      subscriptionPauseUser: 'lockiechen',
                      otherTask: '',
                      customVariables: [
                        {
                          key: 'param1',
                          value: '',
                        },
                      ],
                      customCondition: '',
                      enableCustomEnv: true,
                    },
                    executeCount: 1,
                    version: '1.*',
                    classType: 'linuxScript',
                    atomCode: 'linuxScript',
                    taskAtom: '',
                  },
                ],
                baseOS: 'LINUX',
                vmNames: [],
                maxQueueMinutes: 60,
                maxRunningMinutes: 900,
                buildEnv: {},
                dispatchType: {
                  buildType: 'PUBLIC_DEVCLOUD',
                  value: 'tlinux3_ci',
                  performanceUid: '',
                  persistence: false,
                  imageType: 'BKSTORE',
                  credentialId: '',
                  credentialProject: '',
                  imageCode: 'tlinux3_ci',
                  imageVersion: '2.*',
                  imageName: 'tlinux3-CI镜像',
                  dockerBuildVersion: 'tlinux3_ci',
                  imagePublicFlag: false,
                  imageRDType: '',
                  recommendFlag: true,
                },
                showBuildResource: false,
                enableExternal: false,
                containerId: '1',
                containerHashId: 'c-e01c0da8e8fd455585c0e29ab416d2a0',
                jobControlOption: {
                  enable: true,
                  prepareTimeout: 10,
                  timeout: 900,
                  timeoutVar: '900',
                  runCondition: 'STAGE_RUNNING',
                  customVariables: [
                    {
                      key: 'param1',
                      value: '',
                    },
                  ],
                  customCondition: '',
                  dependOnType: 'ID',
                  dependOnId: [],
                  dependOnName: '',
                  continueWhenFailed: false,
                },
                jobId: 'job_hHM',
                matrixGroupFlag: false,
                nfsSwitch: false,
                classType: 'vmBuild',
              },
            ],
            id: 'stage-2',
            name: 'stage-1',
            tag: ['28ee946a59f64949a74f3dee40a1bda4'],
            fastKill: false,
            finally: false,
            stageControlOption: {
              enable: true,
              runCondition: 'AFTER_LAST_FINISHED',
              customVariables: [
                {
                  key: 'param1',
                  value: '',
                },
              ],
              customCondition: '',
              manualTrigger: false,
              triggerUsers: [],
              timeout: 24,
            },
            checkIn: {
              manualTrigger: false,
              timeout: 24,
              markdownContent: false,
              notifyType: ['RTX'],
            },
            checkOut: {
              manualTrigger: false,
              timeout: 24,
              markdownContent: false,
              notifyType: ['RTX'],
            },
          },
        ],
        labels: [],
        instanceFromTemplate: false,
        creator: 'lockiechen',
        events: {},
        staticViews: [],
        latestVersion: 7,
      },
      setting: {
        pipelineName: 'parameters',
        desc: '',
        runLockType: 'GROUP_LOCK',
        maxConRunningQueueSize: 10,
        waitQueueTimeMinute: 10,
        concurrencyGroup: '${{ci.flow_id}}',
        concurrencyCancelInProgress: false,
        successSubscriptionList: [
          {
            types: [],
            groups: [],
            users: '',
            wechatGroupFlag: false,
            wechatGroup: '',
            wechatGroupMarkdownFlag: false,
            detailFlag: false,
            content: '',
          },
        ],
        failSubscriptionList: [
          {
            types: ['EMAIL', 'RTX'],
            groups: [],
            users: '${{ci.actor}}',
            wechatGroupFlag: false,
            wechatGroup: '',
            wechatGroupMarkdownFlag: false,
            detailFlag: false,
            content:
              '【${{ci.project_name}}】- 【${{ci.pipeline_name}}】#${{ci.build_num}} 执行失败，耗时${{ci.pipeline_execute_time}}, 触发人: ${{ci.actor}}。',
          },
        ],
        maxQueueSize: 10,
      },
    },
    yamlPreview: {
      yaml: 'version: v3.0\nname: parameters\non:\n  manual: enabled\nvariables:\n  URL:\n    value: dream_code\n    props:\n      type: selector\n      options: []\n      payload:\n        paramId: package_name\n        paramName: package_name_desc\n        type: remote\n        url: https://api.wuji.qq.com/x/api/wuji_cache/object?appid=game_block_test&schemaid=yuanmeng_offline_package&schemakey=43847b782cb14eb9ae3651a0915ca387\n  hello:\n    value:\n      branch: master\n      repo-name: lockiechen/awesome-proj\n    props:\n      type: repo-ref\n  a:\n    value: BUILD_mqngglvp_9.77.80.88\n    props:\n      type: container-type\n  sssd:\n    value: ""\n    props:\n      type: selector\n      options:\n      - id: ab\n        label: ab\n      - id: c\n        label: c\n      - id: d\n        label: d\n      - id: e\n        label: e\n      - id: wf\n        label: wf\n      - id: s\n        label: s\n  git:\n    value: abc\n    props:\n      type: git-ref\n      repo-id: yzygX\n  codelib:\n    value: bkdevops/bkci_app_sign\n    props:\n      type: code-lib\n      scm-type: git\n  bool:\n    value: "true"\n    props:\n      type: boolean\n  relky:\n    value: ""\n    if:\n      bool: "true"\n      sssd: ab\n  file:\n    value: ""\n    props:\n      type: custom-file\nstages:\n- name: stage-1\n  label:\n  - Build\n  jobs:\n    job_hHM:\n      name: 构建环境-Linux\n      steps:\n      - name: Bash\n        id: x_k\n        uses: linuxScript@1.*\n        with:\n          script: setEnv "abc" 123\n      - name: Bash\n        id: xa5\n        uses: linuxScript@1.*\n        with:\n          script: setEnv "abc" 123\n      - name: Bash\n        id: tdS\n        uses: linuxScript@1.*\n        with:\n          script: setEnv "abc" 123\nnotices:\n- if: FAILURE\n  type:\n  - email\n  - wework-message\n  receivers:\n  - "${{ci.actor}}"\n  content: "【${{ci.project_name}}】- 【${{ci.pipeline_name}}】#${{ci.build_num}} 执行失败，耗时${{ci.pipeline_execute_time}}, 触发人: ${{ci.actor}}。"\nconcurrency:\n  group: "${{ci.pipeline_id}}"\n  queue-timeout-minutes: 10\nsyntax-dialect: INHERIT\n',
      pipeline: [
        {
          startMark: {
            line: 66,
            column: 0,
          },
          endMark: {
            line: 88,
            column: 0,
          },
        },
      ],
      trigger: [
        {
          startMark: {
            line: 3,
            column: 2,
          },
          endMark: {
            line: 4,
            column: 0,
          },
        },
      ],
      notice: [
        {
          startMark: {
            line: 89,
            column: 0,
          },
          endMark: {
            line: 96,
            column: 0,
          },
        },
      ],
      setting: [
        {
          startMark: {
            line: 0,
            column: 9,
          },
          endMark: {
            line: 0,
            column: 13,
          },
        },
        {
          startMark: {
            line: 1,
            column: 6,
          },
          endMark: {
            line: 1,
            column: 16,
          },
        },
        {
          startMark: {
            line: 97,
            column: 2,
          },
          endMark: {
            line: 99,
            column: 0,
          },
        },
      ],
    },
    canDebug: true,
    yamlSupported: true,
    updater: 'lockiechen',
    updateTime: 1765184414000,
  }
}
