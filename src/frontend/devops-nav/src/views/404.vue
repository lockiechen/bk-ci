<template>
    <bk-exception class="devops-exception" type="404">
        <span>{{ $t("exception.404") }}</span>
        <div class="text-wrap">
            <span class="text-btn">
                <router-link to="/console">{{ $t('exception.goBack') }}</router-link>
            </span>
        </div>
    </bk-exception>
</template>
