import {
    fetchAtomClassify,
    fetchAtoms,
    JobCategory,
    JobType,
    type AtomClassify,
    type AtomItem,
    type AtomModal,
    type AtomVersion,
} from '@/api/atom'
import { useAtomStore } from '@/stores/atom'
import { computed, reactive, ref } from 'vue'

interface AtomListCache {
  data: AtomItem[]
  hasMore: boolean
  page: number
  timestamp: number
  loading: boolean
}

interface UseAtomOptions {
  projectCode: string
  jobType?: JobType
  os?: string[]
  category?: JobCategory
}

// 缓存过期时间（10分钟）
const CACHE_EXPIRE_TIME = 10 * 60 * 1000
const DEFAULT_VERSION = '1.*'

/**
 * 统一的插件数据管理 Hook
 * 整合了插件列表、分类、版本和配置的管理
 */
export function useAtom(options: UseAtomOptions) {
  const {
    projectCode,
    jobType = JobType.AGENT,
    os = ['WINDOWS'],
    category = JobCategory.TASK,
  } = options

  const atomStore = useAtomStore()

  // 分类相关状态
  const classifyList = ref<AtomClassify[]>([])
  const isLoadingClassify = ref(false)

  // 插件列表缓存
  const atomCacheMap = reactive<Record<string, AtomListCache>>({})

  // 生成缓存键
  const generateCacheKey = (classifyId = '', keyword = '') => {
    return `${category}_${classifyId}_${keyword}_${jobType}_${os.join(',')}`
  }

  // 检查缓存是否有效
  const isCacheValid = (cacheKey: string): boolean => {
    const cache = atomCacheMap[cacheKey]
    return cache ? Date.now() - cache.timestamp < CACHE_EXPIRE_TIME : false
  }

  // 获取插件分类列表
  const fetchClassifyList = async (forceRefresh = false): Promise<AtomClassify[]> => {
    if (classifyList.value.length > 0 && !forceRefresh) {
      return classifyList.value
    }

    isLoadingClassify.value = true
    try {
      classifyList.value = await fetchAtomClassify({ category })
      return classifyList.value
    } catch (error) {
      console.error('Failed to fetch atom classify:', error)
      return []
    } finally {
      isLoadingClassify.value = false
    }
  }

  // 获取插件列表
  const fetchAtomList = async (params: {
    classifyId?: string
    keyword?: string
    page?: number
    pageSize?: number
    forceRefresh?: boolean
  } = {}) => {
    const { classifyId = '', keyword = '', page = 1, pageSize = 20, forceRefresh = false } = params
    const cacheKey = generateCacheKey(classifyId, keyword)

    // 初始化缓存
    if (!atomCacheMap[cacheKey]) {
      atomCacheMap[cacheKey] = { data: [], hasMore: true, page: 0, timestamp: 0, loading: false }
    }

    const cache = atomCacheMap[cacheKey]

    // 使用有效缓存
    if (page === 1 && !forceRefresh && isCacheValid(cacheKey) && cache.data.length > 0) {
      return { records: cache.data, hasMore: cache.hasMore, page: cache.page }
    }

    // 防止重复请求
    if (cache.loading) {
      return { records: cache.data, hasMore: cache.hasMore, page: cache.page }
    }

    cache.loading = true
    try {
      const result = await fetchAtoms({
        projectCode,
        category,
        jobType,
        classifyId,
        os: os.join(','),
        keyword,
        page,
        pageSize,
      })

      const records = result.records || []
      const hasMore = records.length >= pageSize

      if (page === 1 || forceRefresh) {
        cache.data = records
        cache.page = 1
      } else {
        cache.data = [...cache.data, ...records]
        cache.page = page
      }

      cache.hasMore = hasMore
      cache.timestamp = Date.now()

      return { records: cache.data, hasMore, page: cache.page }
    } catch (error) {
      console.error('Failed to fetch atoms:', error)
      return { records: cache.data, hasMore: false, page: cache.page }
    } finally {
      cache.loading = false
    }
  }

  // 获取缓存的插件列表
  const getCachedAtomList = (classifyId = '', keyword = ''): AtomItem[] => {
    return atomCacheMap[generateCacheKey(classifyId, keyword)]?.data || []
  }

  // 检查是否正在加载
  const isLoadingAtoms = (classifyId = '', keyword = '') => {
    return atomCacheMap[generateCacheKey(classifyId, keyword)]?.loading || false
  }

  // 清除缓存
  const clearCache = (classifyId?: string, keyword?: string) => {
    if (classifyId !== undefined) {
      delete atomCacheMap[generateCacheKey(classifyId, keyword)]
    } else {
      Object.keys(atomCacheMap).forEach((key) => delete atomCacheMap[key])
      classifyList.value = []
    }
  }

  // 版本选择策略
  const getDefaultVersion = (versionList: AtomVersion[]): string => {
    if (!versionList?.length) return DEFAULT_VERSION
    return (
      versionList.find((v) => v.recommendFlag)?.version ||
      versionList.find((v) => v.defaultFlag)?.version ||
      versionList.find((v) => v.latestFlag)?.version ||
      versionList[0]?.version ||
      DEFAULT_VERSION
    )
  }

  // 加载版本列表
  const loadVersionList = async (atomCode: string): Promise<AtomVersion[]> => {
    const versionList = await atomStore.getVersionList(atomCode, projectCode)
    if (!versionList) throw new Error(`Failed to load version list for ${atomCode}`)
    return versionList
  }

  // 加载插件配置
  const loadAtomModal = async (atomCode: string, version: string): Promise<AtomModal> => {
    const atomModal = await atomStore.getAtomModal(atomCode, version, projectCode)
    if (!atomModal) throw new Error(`Failed to load atom modal for ${atomCode}@${version}`)
    return atomModal
  }

  return {
    // 分类相关
    classifyList: computed(() => classifyList.value),
    isLoadingClassify: computed(() => isLoadingClassify.value),
    fetchClassifyList,

    // 分类选项（包含"全部"选项）
    classifyOptions: computed(() => {
      const options = [...classifyList.value]
      if (category !== JobCategory.TRIGGER) {
        options.unshift({ id: '', classifyCode: 'all', classifyName: '全部插件', weight: 0 } as AtomClassify)
      }
      return options
    }),

    // 分类映射
    classifyMap: computed(() => {
      const map: Record<string, AtomClassify> = {}
      classifyList.value.forEach((item) => (map[item.classifyCode] = item))
      return map
    }),

    // 插件列表相关
    fetchAtomList,
    getCachedAtomList,
    isLoadingAtoms,
    clearCache,

    // 版本和配置相关
    getDefaultVersion,
    loadVersionList,
    loadAtomModal,
    isLoadingVersion: (atomCode: string) => atomStore.isLoadingVersionList(atomCode),
    isLoadingModal: (atomCode: string, version: string) => atomStore.isLoadingAtomModal(atomCode, version),

    // 常量导出
    DEFAULT_VERSION,
  }
}

// 导出类型
export type { UseAtomOptions }




