<template>
    <span
        style="font-size:0"
        v-bind="$attrs"
        v-on="$listeners || listeners"
    >
        <svg
            :width="size"
            :height="size"
            style="fill: currentColor; stroke: currentColor"
        >
            <title v-if="title">{{ title }}</title>
            <use v-bind="{ 'xlink:href': svgHref }"></use>
        </svg>
    </span>
</template>

<script setup>
    import { computed, getCurrentInstance } from 'vue'

    const props = defineProps({
        name: String,
        size: {
            type: [String, Number],
            default: 18
        },
        title: {
            type: String
        }
    })

    // Vue 2.7 和 Vue 3 兼容：处理 $listeners
    // Vue 2.7: $listeners 在模板中直接可用，在 setup 中通过 getCurrentInstance 访问
    // Vue 3: 所有监听器都在 $attrs 中，但模板中可以直接使用 $attrs
    // 在模板中使用 $listeners (Vue 2.7) 或 listeners computed (Vue 3)
    const instance = getCurrentInstance()
    const listeners = computed(() => {
        // Vue 2.7: 使用 $listeners
        if (instance?.proxy?.$listeners) {
            return instance.proxy.$listeners
        }
        // Vue 3: 从 $attrs 中提取事件监听器
        // 注意：在 Vue 3 中，useAttrs() 可能不可用，我们使用 $attrs
        const attrs = instance?.attrs || {}
        const eventListeners = {}
        Object.keys(attrs).forEach(key => {
            if (key.startsWith('on') && typeof attrs[key] === 'function') {
                const eventName = key.slice(2).toLowerCase()
                eventListeners[eventName] = attrs[key]
            }
        })
        return eventListeners
    })

    const svgHref = computed(() => {
        const defaultId = '#bk-pipeline-order'
        if (typeof props.name !== 'string') {
            return defaultId
        }
        const id = `bk-pipeline-${props.name.toLowerCase()}`
        return document.getElementById(id) ? `#${id}` : defaultId
    })
</script>
