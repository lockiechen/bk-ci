<template>
    <section>
        <bk-card
            v-for="card in notifyList"
            :key="card.type"
            :is-collapse="true"
            :collapse-icons="icons"
            :border="false"
            class="notify-item"
        >
            <div
                slot="header"
                class="item-header"
            >
                <span class="notify-title">{{ card.name }}</span>
                <bk-link
                    v-if="editable"
                    theme="primary"
                    icon="bk-icon icon-plus"
                    @click.stop="handleEdit(card.type, -1)"
                >
                    {{ $t('newui.addNotice') }}
                </bk-link>
            </div>
            <div class="item-content-area">
                <template v-for="(item, index) in getRenderInfo(card.type)">
                    <div
                        :key="index"
                        class="item-content"
                    >
                        <div
                            v-if="editable"
                            class="operate-icons"
                        >
                            <i
                                class="devops-icon icon-edit"
                                @click="handleEdit(card.type, index)"
                            ></i>
                            <bk-popover
                                class="setting-more-dot-menu"
                                placement="bottom-start"
                                theme="project-manage-more-dot-menu light"
                                trigger="click"
                                :arrow="false"
                                :distance="0"
                            >
                                <span class="more-menu-trigger">
                                    <i
                                        class="devops-icon icon-more"
                                        style="display: inline-block;margin-top: 2px;font-size: 18px"
                                    ></i>
                                </span>
                                <ul
                                    class="setting-menu-list"
                                    slot="content"
                                >
                                    <li
                                        @click="handleDelete(card.type, index)"
                                        style="padding: 0 2px;cursor: pointer;"
                                    >
                                        {{ $t('delete') }}
                                    </li>
                                </ul>
                            </bk-popover>
                        </div>
                        <template v-for="field in renderFields">
                            <div
                                class="item-info"
                                :key="field.col"
                            >
                                <div class="info-label">
                                    {{ field.label }}
                                </div>
                                <div class="info-content">
                                    {{ getShowContent(field.col, item[field.col]) }}
                                </div>
                            </div>
                        </template>
                        <div
                            class="item-info"
                            v-if="item.wechatGroupFlag && item.wechatGroup && item.types && item.types.includes('WEWORK')"
                        >
                            <div class="info-label">
                                {{ $t('weChatGroupID') }}
                            </div>
                            <div class="info-content">
                                {{ item.wechatGroup }}
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </bk-card>

        <bk-sideslider
            quick-close
            :width="640"
            :title="slideTitle"
            :is-show.sync="showSlider"
            ext-cls="edit-notify-container"
        >
            <div
                class="edit-notify-content"
                slot="content"
            >
                <notify-setting
                    ref="notifySettingTab"
                    :project-group-and-users="projectGroupAndUsers"
                    :subscription="sliderEditItem"
                    :update-subscription="updateEditItem"
                />
            </div>
            <div
                class="edit-notify-footer"
                slot="footer"
            >
                <bk-button
                    theme="primary"
                    @click="handleSaveNotify"
                >
                    {{ $t('confirm') }}
                </bk-button>
                <bk-button
                    style="margin-left: 4px;"
                    @click="hideSlider"
                >
                    {{ $t('cancel') }}
                </bk-button>
            </div>
        </bk-sideslider>
    </section>
</template>

<script>
    import NotifySetting from '@/components/pipelineSetting/NotifySetting'
    import { deepCopy } from '@/utils/util'
    import { mapActions } from 'vuex'
    const defalueValMap = {
        successSubscriptionList: {
            content: window.pipelineVue?.$i18n?.t('settings.defaultSuc')
        },

        failSubscriptionList: {
            content: window.pipelineVue?.$i18n?.t('settings.defaultFail')
        },

        canceledSubscriptionList: {
            content: window.pipelineVue?.$i18n?.t('settings.defaultCanceled')
        },

        releasedSubscriptionList: {
            users: '${{ci.pipeline_owner}}',
            content: window.pipelineVue?.$i18n?.t('settings.defaultReleased')
        },
        stageSuccessSubscriptionList: {
            content: window.pipelineVue?.$i18n?.t('settings.defaultStageSuccess')
        }
    }

    export default {
        name: 'notify-tab',
        components: {
            NotifySetting
        },
        props: {
            editable: {
                type: Boolean,
                default: true
            },
            notices: {
                type: Object,
                default: () => ({})
            },
            updateSubscription: Function
        },
        data () {
            return {
                showSlider: false,
                sliderEditItem: {},
                editType: '', // 当前编辑通知类型，成功或失败
                editIndex: -1, // 当前编辑哪一项通知， -1表示新增
                icons: ['icon-right-shape', 'icon-down-shape'],
                projectGroupAndUsers: [],
                notifyList: [
                    {
                        type: 'successSubscriptionList',
                        name: this.$t('settings.whenSuc')
                    },
                    {
                        type: 'stageSuccessSubscriptionList',
                        name: this.$t('settings.whenStageSuccess')
                    },
                    {
                        type: 'failSubscriptionList',
                        name: this.$t('settings.whenFail')
                    },
                    {
                        type: 'canceledSubscriptionList',
                        name: this.$t('settings.whenCanceled')
                    },
                    {
                        type: 'releasedSubscriptionList',
                        name: this.$t('settings.whenVersionReleased')
                    }
                ],
                renderFields: [
                    {
                        col: 'types',
                        label: this.$t('settings.noticeType')
                    },
                    {
                        col: 'groups',
                        label: this.$t('settings.noticeGroup')
                    },
                    {
                        col: 'users',
                        label: this.$t('settings.additionUser')
                    },
                    {
                        col: 'content',
                        label: this.$t('settings.noticeContent')
                    }
                ],
                notifyTypeMap: {
                    EMAIL: this.$t('settings.emailNotice'),
                    WEWORK: this.$t('settings.rtxNotice'),
                    RTX: this.$t('settings.rtxNotice'),
                    WEWORK_GROUP: this.$t('settings.weworkGroup'),
                    VOICE: this.$t('settings.voice'),
                    WECHAT: this.$t('settings.wechatNotice'),
                    SMS: this.$t('settings.smsNotice')
                }
            }
        },
        computed: {
            slideTitle () {
                const actionType = this.editIndex > -1 ? this.$t('newui.editNotice') : this.$t('newui.addNotice')
                const targetType = this.notifyList.find(item => item.type === this.editType)?.name ?? '--'
                return actionType + ' - ' + targetType
            }
        },
        async created () {
            this.projectGroupAndUsers = await this.requestProjectGroupAndUsers(this.$route.params)
        },
        methods: {
            ...mapActions('pipelines', [
                'requestProjectGroupAndUsers'
            ]),
            getRenderInfo (type) {
                return this.notices[type]
            },
            getShowContent (col, val) {
                let res = ''
                if (col === 'types') {
                    const showTypes = val.map(item => this.notifyTypeMap[item] || item)
                    return showTypes.join(',')
                } else if (col === 'groups') {
                    res = val.join(',')
                } else {
                    res = val
                }
                res = res || '--'
                return res
            },
            handleDelete (type, index) {
                this.notices[type].splice(index, 1)
                this.updateSubscription(type, this.notices[type])
            },
            handleEdit (type, index) {
                this.showSlider = true
                this.editType = type
                this.editIndex = index
                if (index > -1 && this.notices[type][index]) {
                    this.sliderEditItem = deepCopy(this.notices[type][index])
                } else {
                    this.sliderEditItem = deepCopy({
                        types: [],
                        groups: [],
                        users: '${{ci.actor}}',
                        wechatGroupFlag: false,
                        wechatGroup: '',
                        wechatGroupMarkdownFlag: false,
                        detailFlag: false,
                        ...defalueValMap[type]
                    })
                }
            },
            handleSaveNotify () {
                this.$refs?.notifySettingTab?.$refs?.notifyForm?.validate().then(() => {
                    let noticeList = this.notices[this.editType]
                    if (!Array.isArray(noticeList)) {
                        noticeList = []
                    }
                    if (this.editIndex > -1) {
                        noticeList[this.editIndex] = this.sliderEditItem
                    } else {
                        noticeList.push(this.sliderEditItem)
                    }
                    this.updateSubscription(this.editType, noticeList)
                    this.hideSlider()
                }).catch(err => {
                    console.log(err)
                })
            },
            updateEditItem (name, value) {
                Object.assign(this.sliderEditItem, { [name]: value })
            },
            hideSlider () {
                this.showSlider = false
                this.editType = ''
                this.editIndex = -1
                this.sliderEditItem = {}
            }
        }
    }
</script>

<style lang="scss">
    .notify-item {
        margin-bottom: 8px;
        box-shadow: none;
        &:hover {
            box-shadow: none;
        }
        .bk-card-head {
            background-color: #F5F7FA;
            height: 40px;
        }
        .bk-card-body {
            padding: 16px 24px 0;
        }
        .item-header {
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
        }
        .item-content-area {
            display: flex;
            flex-wrap: wrap;
            .item-content {
                position: relative;
                width: 600px;
                border: 1px solid #DCDEE5;
                padding: 24px 24px 8px;
                margin-bottom: 16px;
                .operate-icons {
                    position: absolute;
                    top: 10px;
                    right: 12px;
                    display: flex;
                    align-items: center;
                    grid-gap: 10px;
                    font-size: 16px;
                }
                &:nth-child(odd) {
                    margin-right: 140px;
                }
                .item-info {
                    display: flex;
                    font-size: 12px;
                    margin-bottom: 16px;
                    .info-label {
                        width: 100px;
                        color: #979BA5;
                    }
                    .info-content {
                        flex: 1;
                        color: #63656E;
                        word-break: break-all;
                    }
                }
            }
        }
    }
    .edit-notify-container {
        z-index: 2010;
        .edit-notify-content {
            padding: 20px 24px;
        }
        .bk-sideslider-footer {
            position: absolute;
            bottom: 0;
            .edit-notify-footer {
                margin-left: 24px;
            }
        }
    }

    @media screen and (max-width: 1496px) { /*当屏幕尺寸小于1496px时，应用下面的CSS样式*/
        .item-content {
            width: 520px !important;
            &:nth-child(odd) {
                margin-right: 80px !important;
            }
        }
    }

</style>
