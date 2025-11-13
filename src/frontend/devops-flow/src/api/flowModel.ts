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
  labels: any[]
  instanceFromTemplate: boolean
  pipelineCreator: string
  events: Record<string, any>
  staticViews: any[]
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
  vmNames?: any[]
  maxQueueMinutes?: number
  maxRunningMinutes?: number
  buildEnv?: Record<string, any>
  dispatchType?: DispatchType
  showBuildResource?: boolean
  enableExternal?: boolean
  jobControlOption?: JobControlOption
  jobId?: string
  nfsSwitch?: boolean
  params?: any[]
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
  dependOnId: any[]
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
  triggerUsers: any[]
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
    }, 500)
  })
}

/**
 * 将 Pipeline 模型转换为 YAML 格式
 * @param model Pipeline 模型数据
 */
export function pipelineModelToYaml(model: PipelineModel): string {
  // TODO: 实现实际的转换逻辑
  // 这里简单返回 JSON 字符串作为示例
  return JSON.stringify(model, null, 2)
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
