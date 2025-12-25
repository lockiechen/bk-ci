/**
 * 状态常量定义
 * 统一管理所有状态值，避免 Magic string
 */
export const STATUS = {
  // 成功状态
  SUCCEED: 'SUCCEED',
  STAGE_SUCCESS: 'STAGE_SUCCESS',
  REVIEW_PROCESSED: 'REVIEW_PROCESSED',

  // 失败状态
  FAILED: 'FAILED',
  TERMINATE: 'TERMINATE',
  HEARTBEAT_TIMEOUT: 'HEARTBEAT_TIMEOUT',
  QUALITY_CHECK_FAIL: 'QUALITY_CHECK_FAIL',
  QUEUE_TIMEOUT: 'QUEUE_TIMEOUT',
  EXEC_TIMEOUT: 'EXEC_TIMEOUT',
  QUOTA_FAILED: 'QUOTA_FAILED',

  // 取消/警告状态
  CANCELED: 'CANCELED',
  REVIEW_ABORT: 'REVIEW_ABORT',

  // 运行中状态
  RUNNING: 'RUNNING',
  QUEUE: 'QUEUE',
  PREPARE_ENV: 'PREPARE_ENV',
  REVIEWING: 'REVIEWING',
  LOOP_WAITING: 'LOOP_WAITING',
  CALL_WAITING: 'CALL_WAITING',
  QUEUE_CACHE: 'QUEUE_CACHE',
  RETRY: 'RETRY',
  PAUSE: 'PAUSE',
  DEPENDENT_WAITING: 'DEPENDENT_WAITING',
  QUALITY_CHECK_PASS: 'QUALITY_CHECK_PASS',
  QUALITY_CHECK_WAIT: 'QUALITY_CHECK_WAIT',

  // 其他状态
  UNEXEC: 'UNEXEC',
  SKIP: 'SKIP',
  TRY_FINALLY: 'TRY_FINALLY',
  UNKNOWN: 'UNKNOWN',
} as const

/**
 * 状态类型定义
 * 基于 STATUS 常量生成类型
 */
export type StatusType = (typeof STATUS)[keyof typeof STATUS]

export enum RunLockType {
  MULTIPLE = 'MULTIPLE',
  GROUP_LOCK = 'GROUP_LOCK',
}

export enum BuildCancelPolicy {
  EXECUTE_PERMISSION = 'EXECUTE_PERMISSION',
  RESTRICTED = 'RESTRICTED',
}

// Stage 状态信息
export interface StageStatusInfo {
  stageId: string
  name: string
  status: StatusType
  startEpoch?: number
  elapsed?: number
}

// 执行记录
export interface ExecutionRecord {
  startUser: string
  timeCost: TimeCost
}

// 时间成本
export interface TimeCost {
  systemCost: number // 系统耗时（毫秒）
  executeCost: number // 执行耗时（毫秒）
  waitCost: number // 等待耗时（毫秒）
  queueCost: number // 排队耗时（毫秒）
  totalCost: number // 总耗时（毫秒）
}

// Stage 状态信息
export interface StageStatusInfo {
  stageId: string
  name: string
  status: StatusType
  startEpoch?: number
  elapsed?: number
  tag?: string[]
  timeCost?: TimeCost
  showMsg?: string
}

// 执行记录
export interface ExecutionRecord {
  startUser: string
  timeCost: TimeCost
}

// 质量红线
export interface ArtifactQuality {
  [key: string]: any
}

// 插件元素
export interface Element {
  '@type': string
  name: string
  id: string
  status: StatusType | ''
  executeCount?: number
  version?: string
  [key: string]: any
}

// 容器
export interface Container {
  '@type': string
  id: string
  name: string
  elements: Element[]
  status: StatusType
  startEpoch?: number
  systemElapsed?: number
  elementElapsed?: number
  canRetry?: boolean
  containerId: string
  containerHashId: string
  executeCount?: number
  timeCost?: TimeCost
  [key: string]: any
}

// Stage
export interface Stage {
  containers: Container[]
  id: string
  name: string
  status: StatusType
  elapsed?: number
  fastKill?: boolean
  finally?: boolean
  canRetry?: boolean
  executeCount?: number
  timeCost?: TimeCost
  startEpoch?: number
  [key: string]: any
}

// 创作流模型
export interface FlowModel {
  '@type'?: string
  name: string
  desc: string
  stages: Stage[]
  labels?: string[]
  instanceFromTemplate?: boolean
  creator?: string
  events?: Record<string, any>
  staticViews?: any[]
  timeCost?: TimeCost
  latestVersion?: number
  [key: string]: any
}

export interface ExecuteDetailData {
  id: string // 构建ID
  pipelineId: string // 流水线ID
  pipelineName: string // 流水线名称
  userId: string // 用户ID
  triggerUser: string // 触发用户
  trigger: string // 触发方式
  queueTime: number // 排队时间戳
  startTime: number // 开始时间戳
  queueTimeCost: number // 排队耗时
  endTime?: number // 结束时间戳
  status: StatusType // 构建状态
  model: FlowModel // 创作流模型
  currentTimestamp: number // 当前时间戳
  buildNum: number // 构建次数
  curVersion: number // 当前版本号
  curVersionName: string // 当前版本名称
  latestVersion: number // 最新版本号
  latestBuildNum: number // 最新构建次数
  lastModifyUser: string // 最后修改用户
  executeTime: number // 执行时间
  stageStatus: StageStatusInfo[] // Stage状态列表
  executeCount: number // 执行次数
  startUserList: string[] // 启动用户列表
  recordList: ExecutionRecord[] // 执行记录列表
  buildMsg: string // 构建消息
  debug: boolean // 是否调试模式
  artifactQuality?: ArtifactQuality // 制品质量信息
  versionChange: boolean // 版本是否变更
  webhookInfo?: Record<string, any> // Webhook信息
  materials?: Record<string, any>[] // 材料列表
  cancelBuildPerm: boolean // 是否有取消构建权限
  [key: string]: any
}

/**
 * 版本状态类型
 */
export type VersionStatus =
  | 'RELEASED'
  | 'COMMITTING'
  | 'BRANCH'
  | 'BRANCH_RELEASE'
  | 'DRAFT_RELEASE'
  | 'DELETE'
  | 'HIDDEN'

/**
 * 权限信息
 */
export interface FlowPermissions {
  canManage: boolean // 是否可管理
  canDelete: boolean // 是否可删除
  canView: boolean // 是否可查看
  canEdit: boolean // 是否可编辑
  canExecute: boolean // 是否可执行
  canDownload: boolean // 是否可下载
  canShare: boolean // 是否可分享
  canArchive: boolean // 是否可归档
}

/**
 * 创作流基本信息
 */
export interface FlowInfo {
  pipelineId: string // 流水线ID
  pipelineName: string // 流水线名称
  hasCollect: boolean // 是否已收藏
  canManualStartup: boolean // 是否可手动启动
  canDebug: boolean // 是否可调试
  canRelease: boolean // 是否可发布
  instanceFromTemplate: boolean // 是否从模板实例化
  version: number // 当前版本
  baseVersion: number // 基础版本
  baseVersionStatus: VersionStatus // 基础版本状态
  baseVersionName: string // 基础版本名称
  releaseVersion: number // 发布版本
  releaseVersionName: string // 发布版本名称
  hasPermission: boolean // 是否有权限
  pipelineDesc: string // 流水线描述
  creator: string // 创建人
  createTime: number // 创建时间戳
  updateTime: number // 更新时间戳
  permissions: FlowPermissions // 权限信息
  runLockType: RunLockType // 运行锁定类型
  latestVersionStatus: VersionStatus // 最新版本状态
  locked: boolean // 是否锁定
  buildCancelPolicy: BuildCancelPolicy // 取消构建策略
  description?: string
}

export interface FlowVersion {
  version: number
  versionName: string
  isLatest?: boolean
}

export interface Subscription {
  types: string[]
  groups: string[]
  users: string
  wechatGroupFlag: boolean
  wechatGroup: string
  wechatGroupMarkdownFlag: boolean
  detailFlag: boolean
  content: string
}

export interface FlowSettings {
  projectId: string
  pipelineId: string
  pipelineName: string
  version?: number
  desc?: string
  labels?: string[]
  labelNames?: string[]
  buildNumRule?: string
  successSubscription?: Subscription
  failSubscription?: Subscription
  successSubscriptionList?: Subscription[]
  failSubscriptionList?: Subscription[]
  runLockType?: string
  waitQueueTimeMinute?: number
  maxQueueSize?: number
  concurrencyGroup?: string
  concurrencyCancelInProgress?: boolean
  maxConRunningQueueSize?: number
  failIfVariableInvalid?: boolean
  buildCancelPolicy?: 'EXECUTE_PERMISSION' | 'RESTRICTED'
  maxPipelineResNum?: number
  cleanVariablesWhenRetry?: boolean
  pipelineAsCodeSettings?: {
    enable: boolean
    projectDialect: string
    inheritedDialect: boolean
    pipelineDialect: string
  }
  creator?: string
  updater?: string
  createdTime?: number
  updateTime?: number
  envName?: string
}
export interface ModelAndSetting {
  model: FlowModel
  setting: FlowSettings
}