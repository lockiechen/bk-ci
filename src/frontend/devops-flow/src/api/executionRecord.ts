/**
 * Execution record related APIs
 * Reference: devops-pipeline's /process/api/user/builds/{projectId}/{pipelineId}/history/new
 */

import { get } from '@/utils/http'

// Enable mock fallback for development
const ENABLE_MOCK_FALLBACK = false
const MOCK_API_DELAY = 300

/**
 * Stage status from API
 */
export interface StageStatusItem {
  stageId: string
  name: string
  status: string
  startEpoch?: number
  elapsed?: number
  tag?: string[]
}

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
  stageStatus: StageStatusItem[]
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
 * ExecutionRecord for display (converted from BuildRecord)
 */
export interface ExecutionRecord {
  id: string
  buildNo: number
  checked: boolean
  stageStatus: Array<{
    status: 'success' | 'failed' | 'pending' | 'running'
    progress?: number
  }>
  workflowNode: string
  triggerMethod: string
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
  keyword?: string
  status?: string[]
  trigger?: string[]
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
 * Convert API status to display status
 */
function convertStatus(status: string): 'success' | 'failed' | 'pending' | 'running' {
  const statusMap: Record<string, 'success' | 'failed' | 'pending' | 'running'> = {
    SUCCEED: 'success',
    SUCCEED_WITH_WARN: 'success',
    STAGE_SUCCESS: 'success',
    SUCCEED_WITH_QUALITY: 'success',
    SUCCEED_WITH_QUALITY_FAIL: 'success',
    FAILED: 'failed',
    TERMINATE: 'failed',
    HEARTBEAT_TIMEOUT: 'failed',
    QUALITY_CHECK_FAIL: 'failed',
    QUEUE_TIMEOUT: 'failed',
    EXEC_TIMEOUT: 'failed',
    QUEUE: 'pending',
    SKIP: 'pending',
    PAUSE: 'pending',
    CANCELED: 'pending',
    REVIEWING: 'pending',
    REVIEW_ABORT: 'pending',
    REVIEW_PROCESSED: 'pending',
    TRIGGER_REVIEWING: 'pending',
    RUNNING: 'running',
    PREPARE_ENV: 'running',
    CALL_WAITING: 'running',
    DEPENDENT_WAITING: 'running',
    LOOP_WAITING: 'running',
  }
  return statusMap[status] || 'pending'
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
  // Convert stage status
  const stageStatus = record.stageStatus?.map(stage => ({
    status: convertStatus(stage.status),
    progress: stage.status === 'RUNNING' ? Math.floor(Math.random() * 100) : undefined,
  })) || []

  // Get error code from errorInfoList
  const errorCode = record.errorInfoList?.[0]?.errorCode?.toString() || ''

  // Format trigger method
  const triggerMethodMap: Record<string, string> = {
    MANUAL: '手动触发',
    TIME_TRIGGER: '定时触发',
    REMOTE: '远程触发',
    SERVICE: '服务触发',
    PIPELINE: '流水线触发',
    CODE_GIT: 'Git Push',
    CODE_GITLAB: 'GitLab Push',
    CODE_SVN: 'SVN',
    CODE_TGIT: 'TGit',
    CODE_P4: 'P4',
    WEB_HOOK: 'WebHook',
  }
  const triggerDisplay = triggerMethodMap[record.trigger] || record.trigger || '--'
  const triggerMethod = ['MANUAL', 'REMOTE'].includes(record.trigger) && record.userId
    ? `${triggerDisplay}(${record.userId})`
    : triggerDisplay

  return {
    id: record.id,
    buildNo: record.buildNum,
    checked: false,
    stageStatus,
    workflowNode: record.material?.[0]?.branchName || '--',
    triggerMethod,
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
 * Generate mock data (for fallback only)
 */
function generateMockData(count: number): ExecutionRecord[] {
  const triggerMethods = ['手动触发', '定时触发', '远程触发', 'Git Push', 'Git Tag', '代码合并']
  const triggerUsers = ['fayewang', 'admin', 'zhangsan', 'lisi', 'wangwu', 'zhaoliu']
  const remarks = [
    '',
    '这是对执行结果的备注',
    '备注一下',
    '修复了bug',
    '功能优化',
    '性能提升',
    '代码重构',
  ]
  const errorCodes = ['', 'E001', 'E002', 'E100', 'E200']

  const statusTypes: Array<'success' | 'failed' | 'pending' | 'running'> = [
    'success',
    'failed',
    'pending',
    'running',
  ]

  const mockData: ExecutionRecord[] = []

  for (let i = 0; i < count; i++) {
    const buildNo = 200 - i
    const daysAgo = Math.floor(i / 5)
    const hoursAgo = i % 24
    const minutesAgo = (i * 7) % 60

    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    date.setHours(date.getHours() - hoursAgo)
    date.setMinutes(date.getMinutes() - minutesAgo)

    const formatDate = (d: Date) => {
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hour = String(d.getHours()).padStart(2, '0')
      const minute = String(d.getMinutes()).padStart(2, '0')
      return `${month}-${day} ${hour}:${minute}`
    }

    const startTime = formatDate(date)
    const endDate = new Date(date.getTime() + (Math.random() * 30 + 10) * 60 * 1000)
    const endTime = formatDate(endDate)

    const duration = Math.floor((endDate.getTime() - date.getTime()) / 1000)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    const durationStr = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`

    // Generate random stage status
    const stageCount = 6
    const stageStatus: ExecutionRecord['stageStatus'] = []
    for (let j = 0; j < stageCount; j++) {
      if (j < stageCount - 2) {
        stageStatus.push({ status: 'success' })
      } else if (j === stageCount - 2) {
        const rand = Math.random()
        if (rand < 0.3) {
          stageStatus.push({ status: 'running', progress: Math.floor(Math.random() * 100) })
        } else if (rand < 0.5) {
          stageStatus.push({ status: 'failed' })
        } else {
          stageStatus.push({ status: 'success' })
        }
      } else {
        stageStatus.push({ status: 'pending' })
      }
    }

    const triggerMethod = triggerMethods[i % triggerMethods.length] || '手动触发'
    const triggerUser = triggerUsers[i % triggerUsers.length] || 'admin'
    const triggerDisplay =
      triggerMethod === '手动触发' || triggerMethod === '远程触发'
        ? `${triggerMethod}(${triggerUser})`
        : triggerMethod

    const selectedRemark = remarks[i % remarks.length] || ''
    const selectedErrorCode = stageStatus.some((s) => s.status === 'failed')
      ? errorCodes[Math.floor(Math.random() * errorCodes.length)] || ''
      : ''
    const workflowNodeId = Math.random().toString(36).substring(2, 15)

    mockData.push({
      id: String(i + 1),
      buildNo,
      checked: false,
      stageStatus,
      workflowNode: `ins-${workflowNodeId}`,
      triggerMethod: triggerDisplay,
      triggerTime: startTime,
      startTime,
      endTime,
      totalDuration: durationStr,
      executionDuration: durationStr,
      remark: selectedRemark,
      errorCode: selectedErrorCode,
    })
  }

  return mockData
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
    if (ENABLE_MOCK_FALLBACK) {
      console.warn('[API Fallback] getExecutionRecords failed, using mock data:', error)
      // Fallback to mock data
      return new Promise((resolve) => {
        setTimeout(() => {
          const totalCount = 50
          const allMockData = generateMockData(totalCount)
          
          // Apply keyword filter if provided
          let filteredData = allMockData
          if (filterParams.keyword) {
            const keyword = filterParams.keyword.toLowerCase()
            filteredData = allMockData.filter(
              (item) =>
                item.buildNo.toString().includes(keyword) ||
                item.triggerMethod.toLowerCase().includes(keyword) ||
                item.workflowNode.toLowerCase().includes(keyword) ||
                item.remark.toLowerCase().includes(keyword) ||
                item.errorCode.toLowerCase().includes(keyword),
            )
          }

          const filteredCount = filteredData.length
          const startIndex = (page - 1) * pageSize
          const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)

          resolve({
            list: paginatedData,
            count: filteredCount,
            page,
            limit: pageSize,
            totalPages: Math.ceil(filteredCount / pageSize),
          })
        }, MOCK_API_DELAY)
      })
    }
    throw error
  }
}
