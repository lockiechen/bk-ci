// 验证 bk-pipeline 是否正确加载和配置
// 这个文件可以在浏览器控制台中运行，用于验证配置

export function verifyBkPipeline() {
  const checks = {
    vue3Global: false,
    vue3CompositionAPI: false,
    umdModuleLoaded: false,
    wrapperModule: false,
  }

  // 检查 1: Vue 3 是否在全局可用
  if (typeof window !== 'undefined' && window.Vue) {
    checks.vue3Global = true
    console.log('✓ Vue 3 is available on window.Vue')

    // 检查 2: Composition API 是否可用
    const requiredAPIs = ['ref', 'computed', 'provide', 'inject', 'onMounted', 'defineProps', 'defineEmits']
    const missingAPIs = requiredAPIs.filter(api => !window.Vue[api])

    if (missingAPIs.length === 0) {
      checks.vue3CompositionAPI = true
      console.log('✓ All Composition API functions are available')
    } else {
      console.error('✗ Missing Composition API functions:', missingAPIs)
    }
  } else {
    console.error('✗ Vue 3 is not available on window.Vue')
  }

  // 检查 3: UMD 模块是否加载
  if (typeof window !== 'undefined' && window.bkPipeline) {
    checks.umdModuleLoaded = true
    console.log('✓ UMD module (window.bkPipeline) is loaded:', window.bkPipeline)
  } else {
    console.error('✗ UMD module (window.bkPipeline) is not loaded')
  }

  // 检查 4: 包装模块是否可以导入（需要在模块上下文中运行）
  try {
    // 这个检查需要在模块上下文中运行
    console.log('ℹ Wrapper module check should be done in module context')
  } catch (e) {
    console.error('✗ Wrapper module check failed:', e)
  }

  // 总结
  const allPassed = Object.values(checks).every(check => check === true)
  if (allPassed) {
    console.log('✅ All checks passed! bk-pipeline should work correctly.')
  } else {
    console.warn('⚠ Some checks failed. Please review the configuration.')
  }

  return checks
}

// 如果在浏览器环境中，自动运行验证
if (typeof window !== 'undefined') {
  // 等待一段时间后自动验证
  setTimeout(() => {
    console.log('[bk-pipeline] Running verification...')
    verifyBkPipeline()
  }, 2000)
}
