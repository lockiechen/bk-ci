<template>
    <div class="devops-app">
        <router-view v-bkloading="{ isLoading: moduleLoading }" />
        <Announcement-dialog />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import { Component, Watch } from 'vue-property-decorator'
    import { State, Action } from 'vuex-class'
    import AnnouncementDialog from '../components/AnnouncementDialog/index.vue'
    
    @Component({
        components: {
            AnnouncementDialog
        }
    })
    export default class App extends Vue {
        @State('fetchError') fetchError
        @State('moduleLoading') moduleLoading

        @Action getAnnouncement
        @Action setAnnouncement

        @Watch('fetchError')
        handleFetchError (e) {
            if (e.status === 503) {
                this.$router.replace('/maintaining')
            }
            this.$bkMessage({
                message: e.message || this.$t('NetworkError'),
                theme: 'error'
            })
        }

        async created () {
            const announce = await this.getAnnouncement()
            if (announce && announce.id) {
                this.setAnnouncement(announce)
            }
        }
    }
</script>
