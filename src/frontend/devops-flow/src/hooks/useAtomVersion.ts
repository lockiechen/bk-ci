import { ref } from 'vue'
import { fetchAtomVersionList, fetchAtomModal, type AtomVersion, type AtomModal } from '@/api/atom'

/**
 * 插件版本管理 Hook
 * 负责版本列表获取、默认版本选择和配置加载
 */

export interface UseAtomVersionOptions {
  projectCode: string
}

export interface UseAtomVersionReturn {
  /** 加载版本列表 */
  loadVersionList: (atomCode: string) => Promise<AtomVersion[]>
  /** 获取默认版本 */
  getDefaultVersion: (versionList: AtomVersion[]) => string
  /** 加载插件配置 */
  loadAtomModal: (atomCode: string, version: string) => Promise<AtomModal>
  /** 加载状态 */
  isLoadingVersion: (atomCode: string) => boolean
  isLoadingModal: (atomCode: string, version: string) => boolean
}

/**
 * 版本选择策略：
 * 1. 优先选择 recommendFlag = true 的版本
 * 2. 其次选择 defaultFlag = true 的版本
 * 3. 再选择 latestFlag = true 的版本
 * 4. 最后选择列表第一个版本
 */
function selectDefaultVersion(versionList: AtomVersion[]): string {
  if (!versionList || versionList.length === 0) {
    return '1.*'
  }

  // 优先推荐版本
  const recommendVersion = versionList.find((v) => v.recommendFlag)
  if (recommendVersion) {
    return recommendVersion.version
  }

  // 其次默认版本
  const defaultVersion = versionList.find((v) => v.defaultFlag)
  if (defaultVersion) {
    return defaultVersion.version
  }

  // 再选最新版本
  const latestVersion = versionList.find((v) => v.latestFlag)
  if (latestVersion) {
    return latestVersion.version
  }

  // 最后返回第一个
  return versionList[0]?.version || '1.*'
}

export function useAtomVersion(options: UseAtomVersionOptions): UseAtomVersionReturn {
  const { projectCode } = options

  // 版本列表缓存：atomCode -> versions
  const versionListCache = ref<Map<string, AtomVersion[]>>(new Map())
  // 版本加载状态：atomCode -> loading
  const versionLoadingMap = ref<Map<string, boolean>>(new Map())

  // 插件配置缓存：atomCode@version -> modal
  const atomModalCache = ref<Map<string, AtomModal>>(new Map())
  // 配置加载状态：atomCode@version -> loading
  const modalLoadingMap = ref<Map<string, boolean>>(new Map())

  /**
   * 加载版本列表
   */
  const loadVersionList = async (atomCode: string): Promise<AtomVersion[]> => {
    // 检查缓存
    if (versionListCache.value.has(atomCode)) {
      return versionListCache.value.get(atomCode)!
    }

    // 设置加载状态
    versionLoadingMap.value.set(atomCode, true)

    try {
      const versionList = await fetchAtomVersionList({ projectCode, atomCode })
      versionListCache.value.set(atomCode, versionList)
      return versionList
    } catch (error) {
      console.error(`Failed to load version list for ${atomCode}:`, error)
      throw error
    } finally {
      versionLoadingMap.value.set(atomCode, false)
    }
  }

  /**
   * 获取默认版本
   */
  const getDefaultVersion = (versionList: AtomVersion[]): string => {
    return selectDefaultVersion(versionList)
  }

  /**
   * 加载插件配置
   */
  const loadAtomModal = async (atomCode: string, version: string): Promise<AtomModal> => {
    const cacheKey = `${atomCode}@${version}`

    // 检查缓存
    if (atomModalCache.value.has(cacheKey)) {
      return atomModalCache.value.get(cacheKey)!
    }

    // 设置加载状态
    modalLoadingMap.value.set(cacheKey, true)

    try {
      const atomModal = await fetchAtomModal({
        projectCode,
        atomCode,
        version,
        queryOfflineFlag: false,
      })
      atomModalCache.value.set(cacheKey, atomModal)
      return atomModal
    } catch (error) {
      console.error(`Failed to load atom modal for ${atomCode}@${version}:`, error)
      throw error
    } finally {
      modalLoadingMap.value.set(cacheKey, false)
    }
  }

  /**
   * 检查版本列表是否正在加载
   */
  const isLoadingVersion = (atomCode: string): boolean => {
    return versionLoadingMap.value.get(atomCode) || false
  }

  /**
   * 检查插件配置是否正在加载
   */
  const isLoadingModal = (atomCode: string, version: string): boolean => {
    const cacheKey = `${atomCode}@${version}`
    return modalLoadingMap.value.get(cacheKey) || false
  }

  return {
    loadVersionList,
    getDefaultVersion,
    loadAtomModal,
    isLoadingVersion,
    isLoadingModal,
  }
}
