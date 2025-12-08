export function throttle<T extends (...args: any[]) => any>(
  func: T,
  interval: number = 200,
): (...args: Parameters<T>) => void {
  let lastFunc: number | null = null
  let lastRan: number | null = null

  return function (this: any, ...args: Parameters<T>) {
    const context = this
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc)
      }
      lastFunc = setTimeout(
        () => {
          if (lastRan && Date.now() - lastRan >= interval) {
            func.apply(context, args)
            lastRan = Date.now()
          }
        },
        interval - (Date.now() - (lastRan || 0)),
      )
    }
  }
}

export function weekAgo() {
  // 获取当前日期
  const now = new Date()

  // 获取一周前的日期
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(now.getDate() - 7)

  // 创建开始和结束日期对象
  const start = new Date(oneWeekAgo.setHours(0, 0, 0))
  const end = new Date(now.setHours(23, 59, 59))
  return [start, end]
}

export function formatDate(
  timestamp: number,
  format: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss' | 'HH:mm:ss' = 'YYYY-MM-DD',
): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`
  } else if (format === 'YYYY-MM-DD HH:mm:ss') {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } else {
    return `${hours}:${minutes}:${seconds}`
  }
}

export function prezero(num: number) {
  num = Number(num)

  if (num < 10) {
    return '0' + num
  }

  return num
}

export function convertTime(ms: number) {
  if (!ms) return '--'
  const time = new Date(ms)

  return `${time.getFullYear()}-${prezero(time.getMonth() + 1)}-${prezero(time.getDate())} ${prezero(time.getHours())}:${prezero(time.getMinutes())}:${prezero(time.getSeconds())}`
}

interface MaterialIconMap {
  CODE_SVN: string
  CODE_GIT: string
  CODE_GITLAB: string
  GITHUB: string
  CODE_TGIT: string
  CODE_P4: string
  CODE_REMOTE: string
  CODE_SERVICE: string
}

export function getMaterialIconByType(type: string) {
  const materialIconMap: MaterialIconMap = {
    CODE_SVN: 'CODE_SVN',
    CODE_GIT: 'CODE_GIT',
    CODE_GITLAB: 'CODE_GITLAB',
    GITHUB: 'codeGithubWebHookTrigger',
    CODE_TGIT: 'CODE_GIT',
    CODE_P4: 'CODE_P4',
    CODE_REMOTE: 'remoteTrigger',
    CODE_SERVICE: 'openApi',
  }
  return materialIconMap[type as keyof MaterialIconMap] ?? 'CODE_GIT'
}
