# devops-flow Hooks 和 Stores 重构指南

## 概述

本次重构主要解决以下问题：

1. 合并功能重复的 Hooks
2. 移除过度封装的代理层
3. 统一命名规范
4. 修复循环依赖
5. 创建统一的导出入口

## 新的目录结构

```
src/
├── hooks/
│   ├── index.ts              # 统一导出入口
│   ├── useAtom.ts            # 🆕 统一的插件管理 Hook
│   ├── useYamlHighlight.ts   # 🆕 统一的 YAML 高亮 Hook
│   ├── useFlowModel.ts       # 核心 Flow 模型管理
│   ├── useFlowVariables.ts   # Flow 变量管理
│   ├── useFlowListData.ts    # 创作流列表
│   ├── useFlowGroupData.ts   # 创作流分组
│   ├── useEditingPos.ts      # 编辑位置管理
│   ├── useDeleteConfirm.ts   # 删除确认弹窗
│   ├── useTableHeight.ts     # 表格高度自适应
│   ├── useNewFlow.ts         # 新建创作流
│   ├── useAddToGroup.ts      # 添加到分组
│   ├── useExecutionRecordData.ts  # 执行记录
│   └── useTriggerRecordData.ts    # 触发记录
│
└── stores/
    ├── index.ts              # 统一导出入口
    ├── flowModel.ts          # Flow 模型状态
    ├── atom.ts               # 插件配置缓存
    ├── flowGroup.ts          # 分组管理
    ├── flowContentList.ts    # 列表内容
    ├── executionRecord.ts    # 执行记录
    ├── executeDetail.ts      # 执行详情
    ├── triggerRecord.ts      # 触发记录
    ├── changeLog.ts          # 变更日志
    ├── permissionDelegation.ts # 权限代持
    ├── createFlowStore.ts    # 新建创作流
    ├── addToGroupStore.ts    # 添加到分组
    ├── flowInfoStore.ts      # 创作流信息
    ├── flowMode.ts           # 编辑模式
    ├── ui.ts                 # UI 状态
    ├── auth.ts               # 认证状态
    └── httpLog.ts            # HTTP 日志
```

## 迁移指南

### 1. 插件相关 Hooks 迁移

**之前 (3 个独立 Hook):**

```typescript
import { useAtomData } from '@/hooks/useAtomData'
import { useAtomManager } from '@/hooks/useAtomManager'
import { useAtomVersion } from '@/hooks/useAtomVersion'

const atomData = useAtomData({ projectCode })
const atomManager = useAtomManager({ projectCode })
const atomVersion = useAtomVersion({ projectCode })

// 获取分类
await atomManager.fetchClassifyList()
// 获取版本
const versions = await atomVersion.loadVersionList(atomCode)
// 获取默认版本
const defaultVersion = atomVersion.getDefaultVersion(versions)
```

**之后 (统一的 useAtom):**

```typescript
import { useAtom } from '@/hooks'

const atom = useAtom({ projectCode })

// 获取分类
await atom.fetchClassifyList()
// 获取版本
const versions = await atom.loadVersionList(atomCode)
// 获取默认版本
const defaultVersion = atom.getDefaultVersion(versions)
// 获取插件配置
const modal = await atom.loadAtomModal(atomCode, version)
```

### 2. YAML 高亮 Hooks 迁移

**之前:**

```typescript
import { useAuthoringEnv } from '@/hooks/useAuthoringEnv'
import { useFlowConfigCode } from '@/hooks/useFlowConfigCode'

const { authoringEnvHighlight, yamlContent } = useAuthoringEnv({ flowId })
const { sectionHighlight } = useFlowConfigCode({ flowId, section: 'trigger-event' })
```

**之后:**

```typescript
import { useYamlHighlight } from '@/hooks'

const yaml = useYamlHighlight({ flowId })

// 预设的高亮
const authoringHighlight = yaml.authoringEnvHighlight
const triggerHighlight = yaml.triggerEventHighlight

// 或动态获取
const noticeHighlight = yaml.getSectionHighlight('notice')
```

### 3. 过度封装的 Hooks 迁移

以下 Hooks 只是简单代理 Store，建议直接使用 Store：

**useFlowInfo → useFlowInfoStore:**

```typescript
// 之前
import { useFlowInfo } from '@/hooks/useFlowInfo'
const { flowInfo, flowVersionList, loading } = useFlowInfo()

// 之后
import { useFlowInfoStore } from '@/stores'
import { storeToRefs } from 'pinia'
const store = useFlowInfoStore()
const { flowInfo, flowVersionList, loading } = storeToRefs(store)
```

**useChangeLog → useChangeLogStore:**

```typescript
// 之前
import { useChangeLog } from '@/hooks/useChangeLog'
const { changeLogList, loading, init } = useChangeLog()

// 之后
import { useChangeLogStore } from '@/stores'
import { storeToRefs } from 'pinia'
const store = useChangeLogStore()
const { changeLogList, loading } = storeToRefs(store)
await Promise.all([store.loadOperators(), store.loadChangeLogList()])
```

### 4. 使用统一导出

**之前 (分散导入):**

```typescript
import { useFlowModel } from '@/hooks/useFlowModel'
import { useFlowVariables } from '@/hooks/useFlowVariables'
import { useFlowModelStore } from '@/stores/flowModel'
import { useAtomStore } from '@/stores/atom'
```

**之后 (统一导入):**

```typescript
import { useFlowModel, useFlowVariables } from '@/hooks'
import { useFlowModelStore, useAtomStore } from '@/stores'
```

## 命名规范

### Hooks

- 文件名：`use[Feature].ts`
- 函数名：`use[Feature]`
- 示例：`useFlowModel.ts` → `useFlowModel()`

### Stores

- 文件名：`[feature].ts` 或 `[feature]Store.ts`（保持兼容）
- 函数名：`use[Feature]Store`
- 示例：`flowModel.ts` → `useFlowModelStore()`

## 废弃 API 列表

以下 API 已标记为 `@deprecated`，将在下个大版本移除：

| 废弃 API                  | 替代方案                                |
| ------------------------- | --------------------------------------- |
| `useAtomData`             | `useAtom`                               |
| `useAtomManager`          | `useAtom`                               |
| `useAtomVersion`          | `useAtom`                               |
| `useAuthoringEnv`         | `useYamlHighlight`                      |
| `useFlowConfigCode`       | `useYamlHighlight`                      |
| `useFlowInfo`             | 直接使用 `useFlowInfoStore`             |
| `useExecuteDetail`        | 直接使用 `useExecuteDetailStore`        |
| `useChangeLog`            | 直接使用 `useChangeLogStore`            |
| `usePermissionDelegation` | 直接使用 `usePermissionDelegationStore` |

## 循环依赖修复

`createFlowStore` 之前导入了 `useFlowListData` Hook，导致潜在的循环依赖。

**修复方案：** Store 中直接调用 API 方法，不再依赖 Hook。

```typescript
// 之前 (有循环依赖风险)
import { useFlowListData } from '@/hooks/useFlowListData'
const { createNewContent } = useFlowListData()

// 之后 (直接调用 API)
import { createContent } from '@/api/flowContentList'
const result = await createContent(formData.value)
```

## 最佳实践

1. **Hooks vs Stores 选择原则：**
   - Store：管理全局状态、缓存、跨组件共享数据
   - Hook：封装业务逻辑、组合多个 Store、提供便捷的组件接口

2. **避免过度封装：**
   - 如果 Hook 只是 `storeToRefs + 暴露方法`，直接使用 Store
   - Hook 应该有实际的业务价值（数据转换、副作用处理、多 Store 组合）

3. **避免循环依赖：**
   - Store 中不要导入 Hook
   - Hook 可以导入多个 Store
   - Store 之间可以相互导入，但要注意不要形成环

