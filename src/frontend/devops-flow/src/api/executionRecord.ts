/**
 * 执行记录相关 API
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

export interface ExecutionRecordQueryParams {
  flowId: string
  page?: number
  limit?: number
  startTime?: string
  endTime?: string
  keyword?: string
}

export interface ExecutionRecordListResponse {
  list: ExecutionRecord[]
  count: number
  page: number
  limit: number
}

/**
 * 生成模拟数据
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
    '这是很长的一段备注备注备注备注,对执行结果的备注,真的很长很长很长很长很长很长很长很长很长很长很长长,最多可以显示三行...',
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

    // 生成随机的 stage 状态
    const stageCount = 6
    const stageStatus: ExecutionRecord['stageStatus'] = []
    for (let j = 0; j < stageCount; j++) {
      if (j < stageCount - 2) {
        // 前面的 stage 通常是 success
        stageStatus.push({ status: 'success' })
      } else if (j === stageCount - 2) {
        // 倒数第二个可能是 running 或 failed
        const rand = Math.random()
        if (rand < 0.3) {
          stageStatus.push({ status: 'running', progress: Math.floor(Math.random() * 100) })
        } else if (rand < 0.5) {
          stageStatus.push({ status: 'failed' })
        } else {
          stageStatus.push({ status: 'success' })
        }
      } else {
        // 最后一个通常是 pending
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
      checked: i % 3 === 0,
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
 * 获取执行记录列表
 */
export async function getExecutionRecords(
  params: ExecutionRecordQueryParams,
): Promise<ExecutionRecordListResponse> {
  // TODO: 调用实际接口
  // const response = await http.get('/api/flow/execution-records', { params });
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalCount = 198 // 总数据量

      // 生成所有模拟数据（只在第一次生成，实际应该缓存）
      const allMockData = generateMockData(totalCount)

      // 根据关键词过滤（如果提供）
      let filteredData = allMockData
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredData = allMockData.filter(
          (item) =>
            item.buildNo.toString().includes(keyword) ||
            item.triggerMethod.toLowerCase().includes(keyword) ||
            item.workflowNode.toLowerCase().includes(keyword) ||
            item.remark.toLowerCase().includes(keyword) ||
            item.errorCode.toLowerCase().includes(keyword),
        )
      }

      // 根据时间范围过滤（如果提供）
      if (params.startTime && params.endTime) {
        const start = new Date(params.startTime).getTime()
        const end = new Date(params.endTime).getTime()
        filteredData = filteredData.filter((item) => {
          // 简单的时间匹配，实际应该解析 triggerTime
          return true // 这里简化处理，实际应该解析时间字符串
        })
      }

      const filteredCount = filteredData.length

      // 返回所有过滤后的数据，让 Table 组件自己处理分页
      resolve({
        list: filteredData,
        count: filteredCount,
        page: params.page || 1,
        limit: params.limit || 10,
      })
    }, 300)
  })
}
