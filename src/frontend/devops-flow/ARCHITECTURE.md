# DevOps Flow 页面架构说明

## 目录结构

```
src/
├── components/          # 组件目录
│   ├── Layout/         # 布局组件
│   ├── Header/         # 顶部导航栏
│   ├── Sidebar/        # 左侧边栏
│   └── Content/        # 主内容区
├── styles/             # 样式文件
│   ├── variables.css   # CSS 变量定义
│   ├── global.css      # 全局样式
│   └── utils.css       # 工具类
├── views/              # 视图组件
├── router/             # 路由配置
└── main.ts             # 入口文件
```

## 组件架构

### 1. Layout 组件
主布局组件，负责整体页面布局（Header + Sidebar + Content）

**位置**: `src/components/Layout/`

**结构**:
- `Layout/index.tsx` - 组件代码
- `Layout.module.css` - 组件样式

### 2. Header 组件
顶部导航栏，包含 Logo、标题和标签页切换

**位置**: `src/components/Header/`

**功能**:
- Logo 和标题显示
- 标签页切换（创作流/模板）
- 当前激活状态管理

### 3. Sidebar 组件
左侧导航栏，包含分组和导航项

**位置**: `src/components/Sidebar/`

**功能**:
- 可折叠的分组
- 导航项点击
- 操作按钮（如加号按钮）
- 计数显示

### 4. Content 组件
主内容区，显示表格和操作栏

**位置**: `src/components/Content/`

**功能**:
- 工具栏（标题、操作按钮、搜索框）
- 表格容器（预留）
- 分页（预留）

## 样式系统

### CSS 变量 (`variables.css`)
定义全局可用的 CSS 变量，包括：
- 颜色变量
- 间距变量
- 字体大小变量
- 阴影变量
- 布局变量
- 过渡时间变量

**使用方式**:
```css
.example {
  color: var(--color-primary);
  margin: var(--spacing-md);
}
```

### 全局样式 (`global.css`)
- 样式重置
- 滚动条样式
- 基础元素样式
- 工具类（省略号等）

### 工具类 (`utils.css`)
提供常用的工具类，包括：
- 布局工具类（flex, flex-column, flex-center 等）
- 间距工具类（m-*, mt-*, mb-*, p-*, pt-*, pb-*）
- 文字对齐（text-left, text-center, text-right）
- 字体大小（text-xs, text-sm 等）
- 字体粗细（font-normal, font-bold 等）
- 颜色类（text-primary, text-secondary 等）
- 显示隐藏（show, hide）
- 光标样式（cursor-pointer 等）
- 圆角（rounded, rounded-large 等）
- 阴影（shadow-sm, shadow-md, shadow-lg）
- 过渡效果（transition, transition-fast 等）

**使用方式**:
```html
<div class="flex-center p-md text-primary">
  <!-- content -->
</div>
```

### CSS 模块化
每个组件都使用 CSS 模块化，通过 `styles.module.css` 命名空间隔离样式。

**优点**:
- 样式隔离，避免冲突
- 更好的维护性
- 支持作用域样式

**使用方式**:
```tsx
import styles from './Component.module.css'

<div class={styles.container}>
  <!-- content -->
</div>
```

## 国际化支持

多语言文件位于 `src/frontend/locale/flow/`：
- `zh-CN.json` - 中文
- `en-US.json` - 英文
- `ja-JP.json` - 日文

**使用方式**:
```tsx
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
<span>{t('flow.title')}</span>
```

## 扩展指南

### 添加新组件

1. 在 `src/components/` 下创建组件文件夹
2. 创建 `index.tsx` 和 `Component.module.css`
3. 使用 CSS 变量和工具类

### 添加新页面

1. 在 `src/views/` 创建视图组件
2. 在 `src/router/index.ts` 添加路由
3. 使用 Layout 组件作为布局

### 修改样式

1. **全局样式**: 修改 `src/styles/variables.css`
2. **组件样式**: 修改对应的 `Component.module.css`
3. **工具类**: 需要新工具类时，在 `src/styles/utils.css` 添加

### 添加国际化文本

1. 在 `src/frontend/locale/flow/` 对应语言文件中添加
2. 使用 `useI18n()` 的 `t()` 函数获取文本

## 最佳实践

### 1. 使用 CSS 变量
优先使用 CSS 变量而不是硬编码值：
```css
/* ✅ 推荐 */
color: var(--color-primary);

/* ❌ 不推荐 */
color: #3a84ff;
```

### 2. 使用工具类
对于常用的样式组合，优先使用工具类：
```html
<!-- ✅ 推荐 -->
<div class="flex-center p-md">

<!-- ❌ 不推荐 -->
<div class="custom-wrapper">
```

### 3. CSS 模块化
每个组件使用独立的 CSS 模块：
```tsx
import styles from './Component.module.css'
```

### 4. 组件复用
将可复用的部分抽取为独立组件

### 5. 保持结构清晰
```
- 组件职责单一
- 文件结构清晰
- 命名规范统一
```

## 使用 bkui-vue 组件

项目使用 bkui-vue 作为 UI 组件库，示例：

```tsx
import { BkButton, BkInput, BkIcon } from 'bkui-vue'

<BkButton theme="primary">按钮</BkButton>
<BkInput placeholder="请输入" />
<BkIcon type="angle-right" />
```

更多组件文档请参考 bkui-vue 官方文档。
