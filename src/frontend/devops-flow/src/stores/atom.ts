import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchAtomModal, type AtomModal } from '@/api/atom'
import { getAtomModalKey } from '@/utils/atom'

/**
 * 插件配置状态管理 Store
 * 管理插件配置（atomModal）的缓存和加载状态
 */
export const useAtomStore = defineStore('atom', () => {
  // 插件配置缓存：atomCode@version -> AtomModal
  const atomModalMap = ref<Map<string, AtomModal>>(new Map())

  // 加载状态：atomCode@version -> loading
  const loadingMap = ref<Map<string, boolean>>(new Map())

  /**
   * 从缓存获取插件配置
   */
  function getCachedAtomModal(atomCode: string, version: string): AtomModal | null {
    const key = getAtomModalKey(atomCode, version)
    return atomModalMap.value.get(key) || null
  }

  /**
   * 检查是否正在加载
   */
  function isLoadingAtomModal(atomCode: string, version: string): boolean {
    const key = getAtomModalKey(atomCode, version)
    return loadingMap.value.get(key) || false
  }

  /**
   * 获取或加载插件配置
   */
  async function getAtomModal(
    atomCode: string,
    version: string,
    projectCode: string,
  ): Promise<AtomModal | null> {
    const key = getAtomModalKey(atomCode, version)

    // 先检查缓存
    if (atomModalMap.value.has(key)) {
      return atomModalMap.value.get(key)!
    }

    // 如果正在加载，等待加载完成
    if (loadingMap.value.get(key)) {
      // 简单的轮询等待（实际项目中可以使用更好的方式）
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!loadingMap.value.get(key)) {
            clearInterval(checkInterval)
            resolve(atomModalMap.value.get(key) || null)
          }
        }, 50)
      })
    }

    // 开始加载
    loadingMap.value.set(key, true)

    try {
      const atomModal = await fetchAtomModal({
        projectCode,
        atomCode,
        version,
        queryOfflineFlag: false,
      })

      // 缓存加载的配置
      atomModalMap.value.set(key, atomModal)
      return atomModal
    } catch (error) {
      console.error(`Failed to load atom modal for ${atomCode}@${version}:`, error)
      return null
    } finally {
      loadingMap.value.set(key, false)
    }
  }

  /**
   * 设置插件配置到缓存
   */
  function setAtomModal(atomCode: string, version: string, atomModal: AtomModal) {
    const key = getAtomModalKey(atomCode, version)
    atomModalMap.value.set(key, atomModal)
  }

  /**
   * 清除指定插件配置缓存
   */
  function clearAtomModal(atomCode: string, version: string) {
    const key = getAtomModalKey(atomCode, version)
    atomModalMap.value.delete(key)
    loadingMap.value.delete(key)
  }

  /**
   * 清除所有缓存
   */
  function clearAllCache() {
    atomModalMap.value.clear()
    loadingMap.value.clear()
  }

  return {
    // Getters
    getCachedAtomModal,
    isLoadingAtomModal,

    // Actions
    getAtomModal,
    setAtomModal,
    clearAtomModal,
    clearAllCache,
  }
})
