# bk-pipeline 验证指南

## 验证步骤

### 1. 启动开发服务器

```bash
cd src/frontend/devops-flow
pnpm dev
```

### 2. 打开浏览器控制台

打开应用后，在浏览器控制台中检查以下内容：

#### 2.1 检查 Vue 3 全局设置

在控制台中运行：

```javascript
console.log('Vue 3 check:', {
  Vue: !!window.Vue,
  ref: !!window.Vue?.ref,
  computed: !!window.Vue?.computed,
  provide: !!window.Vue?.provide,
  inject: !!window.Vue?.inject,
  defineProps: !!window.Vue?.defineProps,
  defineEmits: !!window.Vue?.defineEmits,
})
```

**预期结果**: 所有值都应该是 `true`

#### 2.2 检查 UMD 模块加载

在控制台中运行：

```javascript
console.log('UMD module check:', {
  bkPipeline: !!window.bkPipeline,
  default: !!window.bkPipeline?.default,
  install: typeof window.bkPipeline?.install,
})
```

**预期结果**:
- `bkPipeline: true`
- `default: true` 或 `install: 'function'`

#### 2.3 检查包装模块

在控制台中运行：

```javascript
// 检查包装模块是否正确导出
import('bkui-pipeline').then(module => {
  console.log('Wrapper module:', {
    default: !!module.default,
    loadI18nMessages: typeof module.loadI18nMessages,
    useLang: typeof module.useLang,
  })
})
```

**预期结果**: 所有值都应该存在且类型正确

### 3. 检查控制台日志

启动应用后，应该看到以下日志（按顺序）：

1. `[bk-pipeline] Vue 3 global setup: {...}` - 来自 `main.ts`
2. `[bk-pipeline] UMD module loaded successfully` - 来自 `index.html`
3. `[bk-pipeline] window.bkPipeline is available: {...}` - 来自 `index.html`

### 4. 功能验证

#### 4.1 访问 Flow Model 页面

导航到包含 `BkPipeline` 组件的页面（例如：Flow Detail -> Flow Model），检查：

1. **页面是否正常渲染** - 不应该有白屏或错误
2. **控制台是否有错误** - 不应该有 `Cannot read properties of undefined (reading 'ref')` 等错误
3. **组件是否正常显示** - Pipeline 可视化组件应该正常显示

#### 4.2 检查组件交互

1. 尝试与 Pipeline 组件交互（如果可编辑）
2. 检查是否有任何功能异常

### 5. 常见问题排查

#### 问题 1: `Cannot read properties of undefined (reading 'ref')`

**原因**: Vue 3 的 Composition API 没有正确挂载到全局

**解决方案**:
1. 检查 `main.ts` 中的 Vue 3 全局设置代码是否执行
2. 检查控制台是否有相关错误
3. 确保 `window.Vue.ref` 存在

#### 问题 2: `window.bkPipeline is not available`

**原因**: UMD 模块没有正确加载

**解决方案**:
1. 检查网络请求，确认 `/bk-pipeline.min.js` 是否成功加载
2. 检查文件是否存在：`src/frontend/bk-pipeline/dist/bk-pipeline.min.js`
3. 检查 Vite 插件是否正确配置

#### 问题 3: 组件无法导入

**原因**: 包装模块或别名配置有问题

**解决方案**:
1. 检查 `vite.config.ts` 中的别名配置
2. 检查 `bk-pipeline-wrapper.js` 是否正确导出
3. 检查导入语句：`import BkPipeline from 'bkui-pipeline'`

## 验证清单

- [ ] Vue 3 全局设置正确（`window.Vue` 存在且包含所有 Composition API）
- [ ] UMD 模块成功加载（`window.bkPipeline` 存在）
- [ ] 包装模块正确导出（可以通过 `import` 导入）
- [ ] 控制台无错误
- [ ] 页面正常渲染
- [ ] 组件功能正常

## 自动验证脚本

在浏览器控制台中运行以下脚本进行自动验证：

```javascript
(function verifyBkPipeline() {
  const checks = {
    vue3Global: false,
    vue3CompositionAPI: false,
    umdModuleLoaded: false,
  }

  // 检查 Vue 3 全局设置
  if (window.Vue) {
    checks.vue3Global = true
    const requiredAPIs = ['ref', 'computed', 'provide', 'inject', 'onMounted', 'defineProps', 'defineEmits']
    checks.vue3CompositionAPI = requiredAPIs.every(api => window.Vue[api])
  }

  // 检查 UMD 模块
  checks.umdModuleLoaded = !!window.bkPipeline

  // 输出结果
  console.log('=== bk-pipeline Verification ===')
  console.log('Vue 3 Global:', checks.vue3Global ? '✓' : '✗')
  console.log('Composition API:', checks.vue3CompositionAPI ? '✓' : '✗')
  console.log('UMD Module:', checks.umdModuleLoaded ? '✓' : '✗')

  const allPassed = Object.values(checks).every(check => check)
  console.log('Overall:', allPassed ? '✅ PASSED' : '❌ FAILED')

  return checks
})()
```
