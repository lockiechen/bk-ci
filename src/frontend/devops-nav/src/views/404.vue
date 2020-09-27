<template>
    <div class="bk-exception bk-exception-center devops-404">
        <img :src="Img404">
        <h2 class="exception-text">
            <slot>
                <span>{{ $t("exception.404") }}</span>
                <router-link to="/console">{{ $t('exception.goBack') }}</router-link>
            </slot>
        </h2>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import { Component } from 'vue-property-decorator'
    import * as Img404 from '../assets/static/404.png'
    
    @Component
    export default class Exception503 extends Vue {
        get Img404 (): string {
            return Img404
        }
    }
</script>

<style lang="scss">
    .devops-404 {
        text-align: center;
        width: 500px;
        margin: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .exception-text {
            font-size: 20px;
            color: #979797;
            margin: 32px 0;
            font-weight: normal;
            > span {
              margin-right: 12px;
            }
        }
    }
</style>
