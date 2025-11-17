/**
 * 创作流模型相关 API
 */

/**
 * Pipeline 模型数据结构
 */
export interface PipelineModel {
  '@type': string
  name: string
  desc: string
  stages: Stage[]
  labels: string[]
  instanceFromTemplate: boolean
  pipelineCreator: string
  events: Record<string, string>
  staticViews: string[]
  latestVersion: number
}

/**
 * Stage 阶段数据结构
 */
export interface Stage {
  containers: Container[]
  id: string
  name: string
  tag: string[]
  fastKill: boolean
  finally: boolean
  stageControlOption?: StageControlOption
  checkIn?: CheckConfig
  checkOut?: CheckConfig
}

/**
 * Container 容器数据结构
 */
export interface Container {
  '@type': string
  id: string
  name: string
  elements: Element[]
  containerId: string
  containerHashId: string
  matrixGroupFlag: boolean
  classType: string
  baseOS?: string
  vmNames?: string[]
  maxQueueMinutes?: number
  maxRunningMinutes?: number
  buildEnv?: Record<string, string>
  dispatchType?: DispatchType
  showBuildResource?: boolean
  enableExternal?: boolean
  jobControlOption?: JobControlOption
  jobId?: string
  nfsSwitch?: boolean
  params?: Record<string, string>[]
}

/**
 * Element 元素数据结构
 */
export interface Element {
  '@type': string
  name: string
  id: string
  stepId?: string
  scriptType?: string
  script?: string
  continueNoneZero?: boolean
  enableArchiveFile?: boolean
  archiveFile?: string
  additionalOptions?: AdditionalOptions
  executeCount: number
  version: string
  classType: string
  atomCode: string
  taskAtom: string
  canElementSkip?: boolean
  useLatestParameters?: boolean
}

/**
 * 调度类型
 */
export interface DispatchType {
  buildType: string
  value: string
  performanceUid: string
  persistence: boolean
  imageType: string
  credentialId: string
  credentialProject: string
  imageCode: string
  imageVersion: string
  imageName: string
  dockerBuildVersion: string
  imagePublicFlag: boolean
  imageRDType: string
  recommendFlag: boolean
}

/**
 * Job 控制选项
 */
export interface JobControlOption {
  enable: boolean
  prepareTimeout: number
  timeout: number
  timeoutVar: string
  runCondition: string
  customVariables: CustomVariable[]
  customCondition: string
  dependOnType: string
  dependOnId: string[]
  dependOnName: string
  continueWhenFailed: boolean
}

/**
 * Stage 控制选项
 */
export interface StageControlOption {
  enable: boolean
  runCondition: string
  customVariables: CustomVariable[]
  customCondition: string
  manualTrigger: boolean
  triggerUsers: string[]
  timeout: number
}

/**
 * 检查配置
 */
export interface CheckConfig {
  manualTrigger: boolean
  timeout: number
  markdownContent: boolean
  notifyType: string[]
}

/**
 * 附加选项
 */
export interface AdditionalOptions {
  enable: boolean
  continueWhenFailed: boolean
  manualSkip: boolean
  retryWhenFailed: boolean
  retryCount: number
  manualRetry: boolean
  timeout: number
  timeoutVar: string
  runCondition: string
  pauseBeforeExec: boolean
  subscriptionPauseUser: string
  otherTask: string
  customVariables: CustomVariable[]
  customCondition: string
  enableCustomEnv: boolean
}

/**
 * 自定义变量
 */
export interface CustomVariable {
  key: string
  value: string
}

/**
 * 获取 Pipeline 模型数据
 * @param flowId 创作流 ID
 * @param version 版本号（可选）
 */
export async function getPipelineModel(flowId: string, version?: string): Promise<PipelineModel> {
  // TODO: 调用实际接口
  // const response = await http.get(`/api/flow/${flowId}/model`, { params: { version } });
  // return response.data;

  // Mock 数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockPipelineModel())
    }, 500)
  })
}

/**
 * 保存 Pipeline 模型数据
 * @param flowId 创作流 ID
 * @param model Pipeline 模型数据
 */
export async function savePipelineModel(flowId: string, model: PipelineModel): Promise<void> {
  // TODO: 调用实际接口
  // await http.put(`/api/flow/${flowId}/model`, model);

  // Mock 数据
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Pipeline model saved:', model)
      resolve()
    }, 2000)
  })
}

/**
 * 将 Pipeline 模型转换为 YAML 格式
 * @param model Pipeline 模型数据
 */
export function pipelineModelToYaml(model: PipelineModel): string {
  // TODO: 实现实际的转换逻辑
  // 这里简单返回 JSON 字符串作为示例
  return `version: v3.0
name: ${model.name || 'Sample Pipeline'}
desc: ${model.desc || 'Pipeline with authoring environment configuration'}

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
        url: https://prod-bcs-api.open.woa.com/bcsapi/v4/helmmanager/v1/projects/wegamebasetech2019/repos/wegamebasetech2019/charts/account-safety-keeper/versions
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
  content: "【$\{\{ci.project_name\}\}】- 【$\{\{ci.pipeline_name\}\}】#$\{\{ci.build_num\}\} 执行失败，耗时$\{\{ci.pipeline_execute_time\}\}, 触发人: $\{\{ci.actor\}\}。"
concurrency:
  queue-timeout-minutes: 10
syntax-dialect: INHERIT
`
}

/**
 * 将 YAML 格式转换为 Pipeline 模型
 * @param yaml YAML 字符串
 */
export function yamlToPipelineModel(yaml: string): PipelineModel {
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
 * 获取 Mock Pipeline 数据
 */
export function getMockPipelineModel(): PipelineModel {
  return {
    '@type': 'Model',
    name: 'Sample Pipeline',
    desc: 'This is a sample pipeline for demonstration',
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
                name: 'Manual Trigger',
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
            params: [],
            containerId: '0',
            containerHashId: 'c-12c5598910ac44aab13b88ac52da8c6d',
            matrixGroupFlag: false,
            classType: 'trigger',
          },
        ],
        id: 'stage-1',
        name: 'Trigger Stage',
        tag: ['28ee946a59f64949a74f3dee40a1bda4'],
        fastKill: false,
        finally: false,
      },
      {
        containers: [
          {
            '@type': 'vmBuild',
            id: '1',
            name: 'Build Environment - Linux',
            elements: [
              {
                '@type': 'linuxScript',
                name: 'Build Script',
                id: 'e-79398191d99a4fc78d6c133d2d80fad4',
                scriptType: 'SHELL',
                script: "echo 'Starting build...'\nnpm install\nnpm run build\necho 'Build completed'",
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
                  subscriptionPauseUser: 'admin',
                  otherTask: '',
                  customVariables: [
                    {
                      key: 'NODE_ENV',
                      value: 'production',
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
                name: 'Test Script',
                id: 'e-715f3f3bf7744bba835e82bcfb1b6d20',
                stepId: 'TEST',
                scriptType: 'SHELL',
                script: "echo 'Running tests...'\nnpm run test\necho 'Tests completed'",
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
                  subscriptionPauseUser: 'admin',
                  otherTask: '',
                  customVariables: [
                    {
                      key: 'TEST_ENV',
                      value: 'ci',
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
              imageName: 'tlinux3-CI Image',
              dockerBuildVersion: 'tlinux3_ci',
              imagePublicFlag: false,
              imageRDType: '',
              recommendFlag: true,
            },
            showBuildResource: false,
            enableExternal: false,
            containerId: '1',
            containerHashId: 'c-97875d3e2cbc44a2b4244cbf76485df1',
            jobControlOption: {
              enable: true,
              prepareTimeout: 10,
              timeout: 900,
              timeoutVar: '900',
              runCondition: 'STAGE_RUNNING',
              customVariables: [
                {
                  key: 'BUILD_ENV',
                  value: 'production',
                },
              ],
              customCondition: '',
              dependOnType: 'ID',
              dependOnId: [],
              dependOnName: '',
              continueWhenFailed: false,
            },
            jobId: 'job_build',
            matrixGroupFlag: false,
            nfsSwitch: false,
            classType: 'vmBuild',
          },
        ],
        id: 'stage-2',
        name: 'Build Stage',
        tag: ['28ee946a59f64949a74f3dee40a1bda4'],
        fastKill: false,
        finally: false,
        stageControlOption: {
          enable: true,
          runCondition: 'AFTER_LAST_FINISHED',
          customVariables: [
            {
              key: 'STAGE_ENV',
              value: 'build',
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
    pipelineCreator: 'admin',
    events: {},
    staticViews: [],
    latestVersion: 1,
  }
}
