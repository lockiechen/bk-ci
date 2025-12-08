import { ref, computed, type Ref } from 'vue'
import { fetchAtoms, fetchAtomClassify, type AtomItem, type AtomClassify, JobType, JobCategory } from '@/api/atom'

interface AtomDataCache {
  [key: string]: {
    data: AtomItem[]
    hasMore: boolean
    page: number
    timestamp: number
  }
}

interface UseAtomDataOptions {
  projectCode: string
  jobType?: string
  os?: string[]
}

export const useAtomData = (options: UseAtomDataOptions) => {
  const { projectCode, jobType = JobType.AGENT, os = ['WINDOWS'] } = options

  // 缓存数据
  const atomCache = ref<AtomDataCache>({})
  const classifyList = ref<AtomClassify[]>([])
  const isLoadingClassify = ref(false)
  const isLoadingAtoms = ref(false)

  // 缓存过期时间（5分钟）
  const CACHE_EXPIRE_TIME = 5 * 60 * 1000

  // 生成缓存键
  const generateCacheKey = (params: {
    classifyId?: string
    keyword?: string
    category?: string
  }) => {
    const { classifyId = '', keyword = '', category = JobCategory.TASK } = params
    return `${classifyId}_${keyword}_${category}_${jobType}_${os.join(',')}`
  }

  // 检查缓存是否有效
  const isCacheValid = (cacheKey: string): boolean => {
    const cache = atomCache.value[cacheKey]
    if (!cache) return false
    return Date.now() - cache.timestamp < CACHE_EXPIRE_TIME
  }

  // 获取插件分类列表
  const fetchClassifyList = async (): Promise<AtomClassify[]> => {
    if (classifyList.value.length > 0) {
      return classifyList.value
    }

    isLoadingClassify.value = true
    try {
      const result = await fetchAtomClassify({
        category: JobCategory.TASK
      })
      classifyList.value = result
      return result
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
    category?: JobCategory
    page?: number
    pageSize?: number
    forceRefresh?: boolean
  } = {}): Promise<{
    records: AtomItem[]
    hasMore: boolean
    page: number
  }> => {
    const {
      classifyId = '',
      keyword = '',
      category = '',
      page = 1,
      pageSize = 20,
      forceRefresh = false
    } = params

    const cacheKey = generateCacheKey({ classifyId, keyword, category })

    // 如果是第一页且缓存有效，直接返回缓存数据
    if (page === 1 && !forceRefresh && isCacheValid(cacheKey)) {
      const cache = atomCache.value[cacheKey]
      return {
        records: cache?.data || [],
        hasMore: cache?.hasMore || false,
        page: cache?.page || 1
      }
    }

    isLoadingAtoms.value = true
    try {
        const result = await fetchAtoms({
          projectCode,
          category: JobCategory.TASK,
          jobType: JobType.AGENT,
          classifyId,
          os: os.join(','),
          keyword,
          page,
          pageSize
        })

      const records = result.records || []
        const hasMore = (result.records?.length || 0) >= pageSize

      if (page === 1) {
        // 第一页，重置缓存
        atomCache.value[cacheKey] = {
          data: records,
          hasMore,
          page: 1,
          timestamp: Date.now()
        }
      } else {
        // 后续页，追加数据
        const existingCache = atomCache.value[cacheKey]
        if (existingCache) {
          atomCache.value[cacheKey] = {
            ...existingCache,
            data: [...existingCache.data, ...records],
            hasMore,
            page,
            timestamp: Date.now()
          }
        }
      }

      return {
        records: atomCache.value[cacheKey]?.data || [],
        hasMore,
        page
      }
    } catch (error) {
      console.error('Failed to fetch atoms:', error)
      return {
        records: [],
        hasMore: false,
        page: 1
      }
    } finally {
      isLoadingAtoms.value = false
    }
  }

  // 获取缓存的插件列表
  const getCachedAtomList = (params: {
    classifyId?: string
    keyword?: string
    category?: JobCategory
  } = {}): AtomItem[] => {
    const cacheKey = generateCacheKey(params)
    return atomCache.value[cacheKey]?.data || []
  }

  // 清除缓存
  const clearCache = (params?: {
    classifyId?: string
    keyword?: string
    category?: JobCategory
  }) => {
    if (params) {
      const cacheKey = generateCacheKey(params)
      delete atomCache.value[cacheKey]
    } else {
      atomCache.value = {}
    }
  }

  // 刷新数据
  const refreshData = async (params: {
    classifyId?: string
    keyword?: string
    category?: JobCategory
  } = {}) => {
    return await fetchAtomList({ ...params, forceRefresh: true })
  }

  return {
    // 状态
    classifyList: computed(() => classifyList.value),
    isLoadingClassify: computed(() => isLoadingClassify.value),
    isLoadingAtoms: computed(() => isLoadingAtoms.value),

    // 方法
    fetchClassifyList,
    fetchAtomList,
    getCachedAtomList,
    clearCache,
    refreshData
  }
}
