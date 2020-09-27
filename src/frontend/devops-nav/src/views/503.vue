
<template>
    <bk-exception class="devops-exception" type="500">
        <span>{{ $t("maintaining") }}...</span>
        <div class="text-wrap">
            <span @click="refresh" class="text-btn">{{ $t('refresh') }}</span>
            <router-link class="text-btn" to="/console">{{ $t('exception.goBack') }}</router-link>
        </div>
    </bk-exception>
</template>

<script lang="ts">
    import Vue from 'vue'
    import { Component } from 'vue-property-decorator'
    
    @Component
    export default class Exception503 extends Vue {
        refresh () {
            location.reload()
        }
    }
</script>
