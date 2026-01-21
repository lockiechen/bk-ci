/**
 * Execution record related APIs
 * Reference: devops-pipeline's /process/api/user/builds/{projectId}/{pipelineId}/history/new
 */

import type { StageStatusInfo } from '@/types/flow'
import { statusIconMap } from '@/utils/flowStatus'
import { get } from '@/utils/http'

/**
 * Build record from API (matching devops-pipeline format)
 */
export interface BuildRecord {
  id: string
  buildNum: number
  buildNumAlias?: string
  userId: string
  trigger: string
  status: string
  stageStatus: StageStatusInfo[]
  queueTime?: number
  startTime?: number
  endTime?: number
  totalTime?: number
  executeTime?: number
  errorInfoList?: Array<{
    errorType?: number
    errorCode?: number
    errorMsg?: string
  }>
  remark?: string
  material?: Array<{
    aliasName?: string
    branchName?: string
    newCommitId?: string
    newCommitComment?: string
    url?: string
  }>
  [key: string]: any
}


/**
 * API response from /process/api/user/builds/{projectId}/{pipelineId}/history/new
 */
export interface BuildHistoryResponse {
  records: BuildRecord[]
  count: number
  totalPages: number
  page?: number
  pageSize?: number
  hasDownloadPermission?: boolean
  pipelineVersion?: number
}

/**
 * Stage status item for StageSteps component
 */
export interface StageStatusStep {
  stageId: string
  name?: string
  status: string // 原始状态，如 'SUCCEED', 'FAILED', 'RUNNING' 等
  statusCls: string // 状态类名，用于样式
  icon: string // 图标名称
  tooltip?: string
  progress?: number
}

/**
 * ExecutionRecord for display (converted from BuildRecord)
 */
export interface ExecutionRecord {
  id: string
  buildNo: number
  checked: boolean
  status: string // 执行状态，用于显示颜色和图标
  stageStatus: StageStatusStep[] // StageSteps 组件需要的格式
  workflowNode: string
  triggerAndUser: string
  triggerTime: string
  startTime: string
  endTime: string
  totalDuration: string
  executionDuration: string
  remark: string
  errorCode: string
}

/**
 * Query parameters for execution records
 */
export interface ExecutionRecordQueryParams {
  projectId: string
  pipelineId: string
  page?: number
  pageSize?: number
  startTime?: string
  endTime?: string
  status?: string[]
  trigger?: string[]
  materialAlias?: string
  triggerAlias?: string
  materialCommitId?: string
  materialCommitMessage?: string
  triggerUser?: string
  materialBranch?: string
  triggerBranch?: string
  remark?: string
  artifactQuality?: string
  debug?: boolean
}

/**
 * Response format for execution record list
 */
export interface ExecutionRecordListResponse {
  list: ExecutionRecord[]
  count: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Convert timestamp to formatted time string
 */
function formatTime(timestamp?: number): string {
  if (!timestamp) return '--'
  const date = new Date(timestamp)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hour}:${minute}`
}

/**
 * Convert milliseconds to duration string
 */
function formatDuration(ms?: number): string {
  if (!ms || ms <= 0) return '--'
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}小时${minutes % 60}分${seconds % 60}秒`
  } else if (minutes > 0) {
    return `${minutes}分${seconds % 60}秒`
  } else {
    return `${seconds}秒`
  }
}

/**
 * Convert BuildRecord from API to ExecutionRecord for display
 */
function convertBuildRecordToExecutionRecord(record: BuildRecord): ExecutionRecord {
  // Convert stage status to StageSteps format
  const stageStatus = record.stageStatus?.map((stage, index) => {
    const originalStatus = stage.status || 'UNKNOWN'
    const statusCls = originalStatus
    const icon = statusIconMap[originalStatus as keyof typeof statusIconMap] || 'circle'
    
    return {
      stageId: stage.stageId || `stage-${index}`,
      name: stage.name,
      status: originalStatus,
      statusCls,
      showMsg: stage.showMsg,
      icon
    }
  }) || []

  // Get error code from errorInfoList
  const errorCode = record.errorInfoList?.[0]?.errorCode?.toString() || ''  
  const triggerAndUser = `${record.trigger}/${record.userId}`

  return {
    id: record.id,
    buildNo: record.buildNum,
    checked: false,
    status: record.status || 'UNKNOWN', // 保留状态字段
    stageStatus,
    workflowNode: record.material?.[0]?.branchName || '--',
    triggerAndUser,
    triggerTime: formatTime(record.queueTime),
    startTime: formatTime(record.startTime),
    endTime: formatTime(record.endTime),
    totalDuration: formatDuration(record.totalTime),
    executionDuration: formatDuration(record.executeTime),
    remark: record.remark || '',
    errorCode,
  }
}


/**
 * Get execution records from API
 * API: GET /process/api/user/builds/{projectId}/{pipelineId}/history/new
 */
export async function getExecutionRecords(
  params: ExecutionRecordQueryParams,
): Promise<ExecutionRecordListResponse> {
  const { projectId, pipelineId, page = 1, pageSize = 20, debug = false, ...filterParams } = params

  // Build query parameters
  const queryParams = new URLSearchParams()
  queryParams.append('page', String(page))
  queryParams.append('pageSize', String(pageSize))
  
  if (debug) {
    queryParams.append('debug', 'true')
  }
  
  // Add filter parameters
  if (filterParams.status?.length) {
    filterParams.status.forEach(s => queryParams.append('status', s))
  }
  if (filterParams.trigger?.length) {
    filterParams.trigger.forEach(t => queryParams.append('trigger', t))
  }
  if (filterParams.materialAlias) {
    queryParams.append('materialAlias', filterParams.materialAlias)
  }
  if (filterParams.triggerAlias) {
    queryParams.append('triggerAlias', filterParams.triggerAlias)
  }
  if (filterParams.materialCommitId) {
    queryParams.append('materialCommitId', filterParams.materialCommitId)
  }
  if (filterParams.materialCommitMessage) {
    queryParams.append('materialCommitMessage', filterParams.materialCommitMessage)
  }
  if (filterParams.triggerUser) {
    queryParams.append('triggerUser', filterParams.triggerUser)
  }
  if (filterParams.materialBranch) {
    queryParams.append('materialBranch', filterParams.materialBranch)
  }
  if (filterParams.triggerBranch) {
    queryParams.append('triggerBranch', filterParams.triggerBranch)
  }
  if (filterParams.remark) {
    queryParams.append('remark', filterParams.remark)
  }
  if (filterParams.artifactQuality) {
    queryParams.append('artifactQuality', filterParams.artifactQuality)
  }
  if (filterParams.startTime) {
    queryParams.append('startTimeStartTime', filterParams.startTime)
  }
  if (filterParams.endTime) {
    queryParams.append('endTimeEndTime', filterParams.endTime)
  }

  try {
    const response = await get<BuildHistoryResponse>(
      `/process/api/user/builds/${projectId}/${pipelineId}/history/new`,
      { params: Object.fromEntries(queryParams) }
    )

    // Convert API records to display format
    const list = response.records.map(convertBuildRecordToExecutionRecord)
    return {
      list,
      count: response.count || list.length,
      page: response.page || page,
      limit: response.pageSize || pageSize,
      totalPages: response.totalPages || Math.ceil((response.count || list.length) / pageSize),
    }
  } catch (error) {
    console.error('Failed to get execution records:', error)
    throw error
  }
}

/**
 * Get history condition list
 */
export async function getHistoryConditionList(
  projectId: string,
  pipelineId: string,
  condition: string,
  query: Record<string, any> = {},
): Promise<any[]> {
  const queryParams = new URLSearchParams()
  Object.keys(query).forEach((key) => {
    if (query[key] !== undefined && query[key] !== null) {
      queryParams.append(key, String(query[key]))
    }
  })

  try {
    const response = await get<any[]>(
      `/process/api/user/builds/${projectId}/${pipelineId}/historyCondition/${condition}?${queryParams.toString()}`,
    )
    return response
  } catch (error) {
    console.error(`Failed to get history condition list for ${condition}:`, error)
    return []
  }
}
