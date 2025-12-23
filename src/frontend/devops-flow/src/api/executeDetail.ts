import {
  STATUS,
  type ExecuteDetailData
} from '@/types/flow'

/**
 * 重试流水线响应数据
 */
export interface RetryPipelineResponse {
  id: string // 构建ID
  executeCount: number // 执行次数
  projectId: string // 项目ID
  pipelineId: string // 流水线ID
  num: number // 构建编号
  code?: number // 错误码（可选）
  message?: string // 错误信息（可选）
}

/**
 * 重放创作流状态
 */
export type ReplayStatus =
  | 'CANNOT_REPLAY'
  | 'CAN_REPLAY'
  | 'REPLAY_SUCCESS'
  | 'REPLAYING'
  | 'REPLAY_FAILED'

/**
 * 重放创作流响应数据
 */
export interface ReplayPipelineResponse {
  status: ReplayStatus // 重放状态
  id: string // 构建ID
  code?: number // 错误码（可选）
  message?: string // 错误信息（可选）
}

/**
 * 构建启动参数项
 */
export interface BuildParamItem {
  key: string
  value?: any
  valueType?: string
  readOnly?: boolean
  desc?: string
  defaultValue?: any
}

/**
 * 获取当前参数组合
 */
export interface BuildParamProperty {
  id: string
  name?: string
  required?: boolean
  constant?: boolean
  type?: string
  defaultValue?: any
  value?: any
  desc?: string
  readOnly?: boolean
  valueNotEmpty?: boolean
  removeFlag?: boolean
}

/**
 * 获取执行历史详情数据
 * @param projectId 项目ID
 * @param buildNo 构建编号
 * @param flowId 流水线ID
 * @param executeCount 执行次数（可选）
 * @returns 执行详情数据
 */
export function requestPipelineExecDetail({
  projectId,
  buildNo,
  flowId,
  executeCount,
}: {
  projectId: string
  buildNo: string
  flowId: string
  executeCount?: number
}): Promise<ExecuteDetailData> {
  // TODO: 调用实际接口
  // const url = executeCount
  //   ? `/user/builds/projects/${projectId}/pipelines/${flowId}/builds/${buildNo}/record?executeCount=${executeCount}`
  //   : `/user/builds/projects/${projectId}/pipelines/${flowId}/builds/${buildNo}/record`
  // return http.get(url)

  // Mock 数据 - 扩展版本，包含更复杂的编排流程
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseTime = Date.now() - 3600000 // 1小时前
      resolve({
        id: 'b-d8311316d4a04e349f48102f9553b568',
        pipelineId: 'p-fc1ba8afdea34eed8a95e668879f4115',
        pipelineName: '复杂编排流程示例',
        userId: 'zhangsan',
        triggerUser: 'zhangsan',
        trigger: '手动',
        queueTime: baseTime,
        startTime: baseTime + 1485,
        queueTimeCost: 1485,
        endTime: baseTime + 224890,
        status: STATUS.SUCCEED,
        "model": {
            "@type": "Model",
            "name": "BK-CI通用MR代码检查",
            "desc": "【V2】MR并到Integration",
            "stages": [
                {
                    "containers": [
                        {
                            "@type": "trigger",
                            "id": "0",
                            "name": "构建触发",
                            "elements": [
                                {
                                    "@type": "codeGitWebHookTrigger",
                                    "name": "Git事件触发 ",
                                    "id": "e-3eff8793364646f18b58d09cfec65d80",
                                    "status": "SUCCEED",
                                    "repositoryHashId": "lyZj",
                                    "branchName": "integration,production",
                                    "excludeBranchName": "",
                                    "pathFilterType": "NamePrefixFilter",
                                    "includePaths": "",
                                    "excludePaths": "",
                                    "excludeUsers": [],
                                    "eventType": "MERGE_REQUEST",
                                    "block": true,
                                    "repositoryType": "ID",
                                    "repositoryName": "",
                                    "webhookQueue": false,
                                    "enableCheck": true,
                                    "enableThirdFilter": false,
                                    "skipWip": false,
                                    "executeCount": 1,
                                    "canRetry": false,
                                    "originVersion": "1.*",
                                    "version": "1.*",
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 0,
                                        "manualRetry": true,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "",
                                        "otherTask": "",
                                        "customVariables": [
                                            {
                                                "key": "param1",
                                                "value": ""
                                            }
                                        ],
                                        "customCondition": "",
                                        "enableCustomEnv": false
                                    },
                                    "asyncStatus": "",
                                    "classType": "codeGitWebHookTrigger",
                                    "atomCode": "codeGitWebHookTrigger",
                                    "taskAtom": ""
                                },
                                {
                                    "@type": "manualTrigger",
                                    "name": "手动触发",
                                    "id": "e-c7f11e5ffea144d2b561fa175e194182",
                                    "status": "",
                                    "canElementSkip": false,
                                    "useLatestParameters": true,
                                    "executeCount": 1,
                                    "canRetry": false,
                                    "originVersion": "1.*",
                                    "version": "1.*",
                                    "asyncStatus": "",
                                    "classType": "manualTrigger",
                                    "atomCode": "manualTrigger",
                                    "taskAtom": ""
                                }
                            ],
                            "status": "SUCCEED",
                            "startEpoch": 1766113162170,
                            "systemElapsed": 170,
                            "elementElapsed": 0,
                            "params": [
                                {
                                    "id": "BK_CI_REPO_GIT_WEBHOOK_SOURCE_BRANCH",
                                    "name": "BK_CI_REPO_GIT_WEBHOOK_SOURCE_BRANCH",
                                    "required": true,
                                    "constant": false,
                                    "type": "STRING",
                                    "defaultValue": "integration",
                                    "desc": "",
                                    "readOnly": false,
                                    "valueNotEmpty": false
                                },
                                {
                                    "id": "mysql_pwd",
                                    "name": "mysql_pwd",
                                    "required": true,
                                    "constant": false,
                                    "type": "STRING",
                                    "defaultValue": "bkci4PR@",
                                    "desc": "",
                                    "readOnly": false,
                                    "valueNotEmpty": false
                                }
                            ],
                            "templateParams": [],
                            "canRetry": false,
                            "containerId": "0",
                            "containerHashId": "c-38c44ca958044e5ba7bed3fe955279cf",
                            "startVMStatus": "SUCCEED",
                            "executeCount": 1,
                            "containPostTaskFlag": false,
                            "matrixGroupFlag": false,
                            "timeCost": {
                                "systemCost": 0,
                                "executeCost": 0,
                                "waitCost": 0,
                                "queueCost": 0,
                                "totalCost": 0
                            },
                            "classType": "trigger"
                        }
                    ],
                    "id": "stage-1",
                    "name": "stage-1",
                    "tag": [
                        "28ee946a59f64949a74f3dee40a1bda4"
                    ],
                    "status": "SUCCEED",
                    "elapsed": 170,
                    "fastKill": false,
                    "finally": false,
                    "canRetry": false,
                    "executeCount": 1,
                    "timeCost": {
                        "systemCost": 0,
                        "executeCost": 0,
                        "waitCost": 584,
                        "queueCost": 584,
                        "totalCost": 584
                    }
                },
                {
                    "containers": [
                        {
                            "@type": "vmBuild",
                            "id": "1",
                            "name": "代码检查",
                            "elements": [
                                {
                                    "@type": "marketBuild",
                                    "name": "Checkout",
                                    "id": "e-80e8899dc2b048389ed9405d1fe731c8",
                                    "status": "SUCCEED",
                                    "atomCode": "checkout",
                                    "version": "1.0.117",
                                    "stepId": "zW91ys",
                                    "data": {
                                        "input": {
                                            "repositoryType": "ID",
                                            "repositoryHashId": "lyZj",
                                            "repositoryName": "",
                                            "repositoryUrl": "",
                                            "authType": "TICKET",
                                            "persistCredentials": true,
                                            "pullType": "BRANCH",
                                            "refName": "${BK_CI_REPO_GIT_WEBHOOK_TARGET_BRANCH}",
                                            "localPath": "",
                                            "strategy": "REVERT_UPDATE",
                                            "fetchDepth": "",
                                            "fetchOnlyCurrentRef": false,
                                            "enableFetchRefSpec": false,
                                            "fetchRefSpec": "",
                                            "enablePartialClone": false,
                                            "enableTGitCache": false,
                                            "enableSparseCone": false,
                                            "includePath": "",
                                            "excludePath": "",
                                            "cachePath": "",
                                            "enableGitLfs": true,
                                            "enableGitLfsClean": false,
                                            "lfsConcurrentTransfers": "",
                                            "enableSubmodule": true,
                                            "submodulePath": "",
                                            "enableSubmoduleRemote": false,
                                            "enableSubmoduleRecursive": true,
                                            "submoduleJobs": "",
                                            "submoduleDepth": "",
                                            "enableVirtualMergeBranch": true,
                                            "enableServerPreMerge": true,
                                            "enableGitClean": true,
                                            "enableGitCleanIgnore": true,
                                            "enableGitCleanNested": false,
                                            "autoCrlf": "false",
                                            "enableTrace": false,
                                            "setSafeDirectory": false,
                                            "mainRepo": false,
                                            "accessToken": "******",
                                            "personalAccessToken": "******",
                                            "password": "******"
                                        },
                                        "output": {
                                            "BK_CI_GIT_REPO_URL": "string",
                                            "BK_CI_GIT_REPO_ALIAS_NAME": "string",
                                            "BK_CI_GIT_REPO_NAME": "string",
                                            "BK_CI_GIT_REPO_REF": "string",
                                            "BK_CI_GIT_REPO_CODE_PATH": "string",
                                            "BK_CI_GIT_REPO_LAST_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_MR_TARGET_HEAD_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_COMMENT": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_AUTHOR": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_COMMITTER": "string",
                                            "BK_CI_GIT_REPO_COMMITS": "string",
                                            "BK_CI_GIT_REPO_MR_SOURCE_HEAD_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_MR_SOURCE_HEAD_COMMIT_COMMENT": "string"
                                        },
                                        "namespace": ""
                                    },
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 1,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "irwinsun",
                                        "otherTask": "",
                                        "customVariables": [
                                            {
                                                "key": "param1",
                                                "value": ""
                                            }
                                        ],
                                        "customCondition": "",
                                        "enableCustomEnv": true
                                    },
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 6643,
                                    "startEpoch": 1766113172650,
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 6643,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 6643
                                    },
                                    "asyncStatus": "",
                                    "classType": "marketBuild",
                                    "autoAtomCode": "checkout",
                                    "taskAtom": ""
                                },
                                {
                                    "@type": "marketBuild",
                                    "name": "腾讯代码分析(官方-代码分析工作组)",
                                    "id": "e-48398a7c1b9d4d7e93ebbcfadfc81645",
                                    "status": "SUCCEED",
                                    "atomCode": "CodeccCheckAtomDebug",
                                    "version": "4.1.39",
                                    "data": {
                                        "input": {
                                            "beAutoLang": false,
                                            "languages": [
                                                "JAVA",
                                                "GOLANG",
                                                "KOTLIN"
                                            ],
                                            "checkerSetType": "normal",
                                            "tools": [
                                                "CLOC",
                                                "DUPC",
                                                "WOODPECKER_SENSITIVE",
                                                "CCN",
                                                "KTLINT",
                                                "SENSITIVE",
                                                "CHECKSTYLE",
                                                "BKCHECK",
                                                "GOML",
                                                "IP_CHECK",
                                                "HORUSPY",
                                                "PECKER_SECURITY",
                                                "DETEKT"
                                            ],
                                            "asyncTask": false,
                                            "asyncTaskId": "",
                                            "harmonyScanPath": "",
                                            "bk_atom_del_hook_url": "http://v2.idc.devops.oa.com/proxy-devnet?url=http%3A%2F%2Fv2.codecc.oa.com%2Ftask%2Fapi%2Fservice%2Ftask%2Fpipeline%2FstopSingle%3FpipelineId%3D%7BpipelineId%7D%26multiPipelineMark%3D%7BmultiPipelineMark%7D%26disabledReason%3Ddelete%26userName%3D%7BuserId%7D",
                                            "bk_atom_del_hook_url_method": "DELETE",
                                            "scriptType": "SHELL",
                                            "script": "# Coverity/Klocwork将通过调用编译脚本来编译您的代码，以追踪深层次的缺陷\n# 请使用依赖的构建工具如maven/cmake等写一个编译脚本build.sh\n# 确保build.sh能够编译代码\n# cd path/to/build.sh\n# sh build.sh",
                                            "languageRuleSetMap": {
                                                "JAVA_RULE": [
                                                    "bk_ci_java_sec_new"
                                                ],
                                                "KOTLIN_RULE": [
                                                    "bk_ci_kotlin_new",
                                                    "KTLint"
                                                ],
                                                "JS_RULE": [],
                                                "RUBY_RULE": [],
                                                "GOLANG_RULE": [
                                                    "codecc_default_go",
                                                    "bk_ci_go_sec_new"
                                                ]
                                            },
                                            "C_CPP_RULE": [],
                                            "checkerSetEnvType": "prod",
                                            "multiPipelineMark": "",
                                            "callbackEnabled": false,
                                            "callbackUrl": "",
                                            "callbackEvents": [
                                                "SCAN_FINISH"
                                            ],
                                            "rtxReceiverType": "3",
                                            "rtxReceiverList": [],
                                            "botWebhookUrl": "",
                                            "botRemindRange": "1",
                                            "botRemindSeverity": "7",
                                            "botRemaindTools": [],
                                            "emailReceiverType": "4",
                                            "emailReceiverList": [],
                                            "emailCCReceiverList": [],
                                            "instantReportStatus": "2",
                                            "reportDate": [],
                                            "reportTime": "",
                                            "reportTools": [],
                                            "toolScanType": "1",
                                            "diffType": "1",
                                            "diffCommit": "",
                                            "diffBranch": "",
                                            "diffByGranularity": false,
                                            "byFile": true,
                                            "byGranularity": false,
                                            "mrCommentEnable": true,
                                            "prohibitIgnore": false,
                                            "fileCacheEnable": false,
                                            "transferAuthorList": [
                                                {
                                                    "sourceAuthor": "fitzcao",
                                                    "targetAuthor": "stubenhuang"
                                                }
                                            ],
                                            "path": [],
                                            "customPath": [
                                                ".*/.*\\.svg",
                                                "/src/frontend",
                                                "/support-files",
                                                "/.ci",
                                                "/helm-charts/ext",
                                                "/src/app",
                                                "/src/gateway/ext"
                                            ],
                                            "scanTestSource": false,
                                            "openScanPrj": false,
                                            "openScanFilterEnable": false,
                                            "openScanScanConfigEnable": false,
                                            "issueSystem": "TAPD",
                                            "issueSubSystem": "",
                                            "issueResolvers": [],
                                            "issueReceivers": [],
                                            "issueFindByVersion": "",
                                            "maxIssue": 1000,
                                            "issueAutoCommit": true,
                                            "issueTools": [
                                                "ALL"
                                            ],
                                            "issueSeverities": [
                                                "1"
                                            ],
                                            "pyVersion": "py3",
                                            "newDefectJudgeFromDate": "2021-03-01",
                                            "JAVA_RULE": [
                                                "bk_ci_java_sec_new"
                                            ],
                                            "JAVA_TOOL": [
                                                {
                                                    "toolList": [
                                                        "SENSITIVE",
                                                        "CHECKSTYLE",
                                                        "WOODPECKER_SENSITIVE",
                                                        "BKCHECK"
                                                    ]
                                                }
                                            ],
                                            "KOTLIN_RULE": [
                                                "bk_ci_kotlin_new",
                                                "KTLint"
                                            ],
                                            "KOTLIN_TOOL": [
                                                {
                                                    "toolList": [
                                                        "SENSITIVE",
                                                        "PECKER_SECURITY",
                                                        "DUPC",
                                                        "DETEKT",
                                                        "WOODPECKER_SENSITIVE",
                                                        "IP_CHECK"
                                                    ]
                                                },
                                                {
                                                    "toolList": [
                                                        "KTLINT"
                                                    ]
                                                }
                                            ],
                                            "JS_RULE": [],
                                            "JS_TOOL": [
                                                {
                                                    "toolList": [
                                                        "CLOC",
                                                        "SENSITIVE",
                                                        "DUPC",
                                                        "CCN"
                                                    ]
                                                },
                                                {
                                                    "toolList": [
                                                        "ESLINT",
                                                        "DUPC",
                                                        "WOODPECKER_SENSITIVE",
                                                        "CCN"
                                                    ]
                                                }
                                            ],
                                            "RUBY_RULE": [],
                                            "RUBY_TOOL": [
                                                {
                                                    "toolList": [
                                                        "SENSITIVE",
                                                        "HORUSPY",
                                                        "COVERITY",
                                                        "CCN"
                                                    ]
                                                }
                                            ],
                                            "GOLANG_RULE": [
                                                "codecc_default_go",
                                                "bk_ci_go_sec_new"
                                            ],
                                            "GOLANG_TOOL": [
                                                {
                                                    "toolList": [
                                                        "CLOC",
                                                        "DUPC",
                                                        "WOODPECKER_SENSITIVE",
                                                        "CCN"
                                                    ]
                                                },
                                                {
                                                    "toolList": [
                                                        "SENSITIVE",
                                                        "DUPC",
                                                        "GOML",
                                                        "WOODPECKER_SENSITIVE",
                                                        "IP_CHECK",
                                                        "HORUSPY",
                                                        "CCN"
                                                    ]
                                                }
                                            ],
                                            "isInstanceTemplate": false,
                                            "toolCustomParamsObj": {
                                                "ESLINT": {
                                                    "eslintRule": "default"
                                                },
                                                "GOML": {
                                                    "go_path": "src/agent/src",
                                                    "goPath": ""
                                                },
                                                "BKCHECK": {
                                                    "bkcheckCompileScan": false,
                                                    "bkcheckDebug": false,
                                                    "bkcheckCustomMacros": [],
                                                    "enableLLMNegativeDefectFilter": false,
                                                    "env": ""
                                                }
                                            },
                                            "toolCustomParams": "{\"ESLINT\":{\"eslintRule\":\"default\"},\"GOML\":{\"go_path\":\"src/agent/src\"},\"BKCHECK\":{\"bkcheckCompileScan\":false,\"bkcheckDebug\":false,\"bkcheckCustomMacros\":[]}}"
                                        },
                                        "output": {
                                            "BK_CI_CODECC_TASK_ID": "string",
                                            "BK_CI_CODECC_TASK_STATUS": "string"
                                        },
                                        "namespace": ""
                                    },
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 1,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "irwinsun",
                                        "otherTask": "",
                                        "customVariables": [
                                            {
                                                "key": "param1",
                                                "value": ""
                                            }
                                        ],
                                        "customCondition": "",
                                        "enableCustomEnv": false
                                    },
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 259248,
                                    "startEpoch": 1766113179909,
                                    "originVersion": "4.*",
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 259248,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 259248
                                    },
                                    "asyncStatus": "",
                                    "classType": "marketBuild",
                                    "autoAtomCode": "CodeccCheckAtomDebug",
                                    "taskAtom": ""
                                },
                                {
                                    "@type": "qualityGateOutTask",
                                    "name": "质量红线(准出)",
                                    "id": "T-5184fd5762724b6d8d53d7b73eca5e86",
                                    "status": "REVIEW_PROCESSED",
                                    "interceptTask": "CodeccCheckAtomDebug",
                                    "interceptTaskId": "e-48398a7c1b9d4d7e93ebbcfadfc81645",
                                    "interceptTaskName": "腾讯代码分析(官方-代码分析工作组)",
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 5197,
                                    "startEpoch": 1766113439890,
                                    "version": "1.0.0",
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 5197,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 5197
                                    },
                                    "asyncStatus": "",
                                    "classType": "qualityGateOutTask",
                                    "taskAtom": "qualityGateOutTaskAtom",
                                    "atomCode": "qualityGateOutTask"
                                },
                                {
                                    "@type": "marketBuild",
                                    "name": "POST：Checkout",
                                    "id": "e-ae71f307cd73479b9d41eb22be8c6728",
                                    "status": "SUCCEED",
                                    "atomCode": "checkout",
                                    "version": "1.0.117",
                                    "stepId": "",
                                    "data": {
                                        "input": {
                                            "repositoryType": "ID",
                                            "repositoryHashId": "lyZj",
                                            "repositoryName": "",
                                            "repositoryUrl": "",
                                            "authType": "TICKET",
                                            "persistCredentials": true,
                                            "pullType": "BRANCH",
                                            "refName": "${BK_CI_REPO_GIT_WEBHOOK_TARGET_BRANCH}",
                                            "localPath": "",
                                            "strategy": "REVERT_UPDATE",
                                            "fetchDepth": "",
                                            "fetchOnlyCurrentRef": false,
                                            "enableFetchRefSpec": false,
                                            "fetchRefSpec": "",
                                            "enablePartialClone": false,
                                            "enableTGitCache": false,
                                            "enableSparseCone": false,
                                            "includePath": "",
                                            "excludePath": "",
                                            "cachePath": "",
                                            "enableGitLfs": true,
                                            "enableGitLfsClean": false,
                                            "lfsConcurrentTransfers": "",
                                            "enableSubmodule": true,
                                            "submodulePath": "",
                                            "enableSubmoduleRemote": false,
                                            "enableSubmoduleRecursive": true,
                                            "submoduleJobs": "",
                                            "submoduleDepth": "",
                                            "enableVirtualMergeBranch": true,
                                            "enableServerPreMerge": true,
                                            "enableGitClean": true,
                                            "enableGitCleanIgnore": true,
                                            "enableGitCleanNested": false,
                                            "autoCrlf": "false",
                                            "enableTrace": false,
                                            "setSafeDirectory": false,
                                            "mainRepo": false,
                                            "accessToken": "******",
                                            "personalAccessToken": "******",
                                            "password": "******"
                                        },
                                        "output": {
                                            "BK_CI_GIT_REPO_URL": "string",
                                            "BK_CI_GIT_REPO_ALIAS_NAME": "string",
                                            "BK_CI_GIT_REPO_NAME": "string",
                                            "BK_CI_GIT_REPO_REF": "string",
                                            "BK_CI_GIT_REPO_CODE_PATH": "string",
                                            "BK_CI_GIT_REPO_LAST_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_MR_TARGET_HEAD_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_COMMENT": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_AUTHOR": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_COMMITTER": "string",
                                            "BK_CI_GIT_REPO_COMMITS": "string",
                                            "BK_CI_GIT_REPO_MR_SOURCE_HEAD_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_MR_SOURCE_HEAD_COMMIT_COMMENT": "string"
                                        },
                                        "namespace": ""
                                    },
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": true,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 0,
                                        "manualRetry": true,
                                        "timeout": 100,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_FAILED_BUT_CANCEL",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "irwinsun",
                                        "otherTask": "",
                                        "customVariables": [
                                            {
                                                "key": "param1",
                                                "value": ""
                                            }
                                        ],
                                        "customCondition": "",
                                        "elementPostInfo": {
                                            "postEntryParam": "True",
                                            "postCondition": "always()",
                                            "parentElementId": "e-80e8899dc2b048389ed9405d1fe731c8",
                                            "parentElementName": "Checkout",
                                            "parentElementJobIndex": 0
                                        },
                                        "enableCustomEnv": true
                                    },
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 2332,
                                    "startEpoch": 1766113445559,
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 2332,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 2332
                                    },
                                    "asyncStatus": "",
                                    "classType": "marketBuild",
                                    "autoAtomCode": "checkout",
                                    "taskAtom": ""
                                }
                            ],
                            "status": "SUCCEED",
                            "startEpoch": 1766113171947,
                            "systemElapsed": 14596,
                            "elementElapsed": 273420,
                            "baseOS": "LINUX",
                            "vmNames": [],
                            "maxQueueMinutes": 60,
                            "maxRunningMinutes": 900,
                            "buildEnv": {
                                "jdk": "1.8.0_161"
                            },
                            "dispatchType": {
                                "buildType": "PUBLIC_DEVCLOUD",
                                "value": "tlinux_ci",
                                "performanceConfigId": "2",
                                "performanceUid": "",
                                "persistence": false,
                                "imageType": "BKSTORE",
                                "credentialId": "",
                                "credentialProject": "",
                                "imageCode": "tlinux_ci",
                                "imageVersion": "3.*",
                                "imageName": "tlinux_ci",
                                "dockerBuildVersion": "tlinux_ci",
                                "imagePublicFlag": false,
                                "imageRDType": "",
                                "recommendFlag": true
                            },
                            "showBuildResource": true,
                            "canRetry": false,
                            "enableExternal": false,
                            "containerId": "1",
                            "containerHashId": "c-ec7ee6f62ffa4f5db8e1d86ef87f8700",
                            "jobControlOption": {
                                "enable": true,
                                "prepareTimeout": 10,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "runCondition": "STAGE_RUNNING",
                                "customVariables": [
                                    {
                                        "key": "param1",
                                        "value": ""
                                    }
                                ],
                                "customCondition": "",
                                "dependOnType": "ID",
                                "dependOnId": [],
                                "dependOnName": "",
                                "continueWhenFailed": false
                            },
                            "mutexGroup": {
                                "enable": false,
                                "mutexGroupName": "",
                                "queueEnable": false,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "queue": 5,
                                "linkTip": "p-5ef04bbb79dd42a9941c9e535d81eeb7_Pipeline[BK-CI通用MR代码检查]Job[代码检查]"
                            },
                            "startVMStatus": "SUCCEED",
                            "executeCount": 1,
                            "jobId": "job_bAB",
                            "containPostTaskFlag": true,
                            "matrixGroupFlag": false,
                            "timeCost": {
                                "systemCost": 14596,
                                "executeCost": 273421,
                                "waitCost": 0,
                                "queueCost": 0,
                                "totalCost": 288017
                            },
                            "startVMTaskSeq": 1,
                            "matrixControlOption": {
                                "strategyStr": "",
                                "includeCaseStr": "",
                                "excludeCaseStr": "",
                                "fastKill": true,
                                "maxConcurrency": 5
                            },
                            "nfsSwitch": true,
                            "classType": "vmBuild"
                        },
                        {
                            "@type": "vmBuild",
                            "id": "2",
                            "name": "9.135.13.28",
                            "elements": [
                                {
                                    "@type": "marketBuild",
                                    "name": "Checkout",
                                    "id": "e-11a7483dde1f4aa0b8b61c7d2c253cad",
                                    "status": "SUCCEED",
                                    "atomCode": "checkout",
                                    "version": "1.0.117",
                                    "stepId": "EzD",
                                    "data": {
                                        "input": {
                                            "repositoryType": "ID",
                                            "repositoryHashId": "lyZj",
                                            "repositoryName": "",
                                            "repositoryUrl": "",
                                            "authType": "TICKET",
                                            "persistCredentials": true,
                                            "pullType": "BRANCH",
                                            "refName": "${BK_CI_REPO_GIT_WEBHOOK_TARGET_BRANCH}",
                                            "localPath": "",
                                            "strategy": "REVERT_UPDATE",
                                            "fetchDepth": "",
                                            "fetchOnlyCurrentRef": false,
                                            "enableFetchRefSpec": false,
                                            "fetchRefSpec": "",
                                            "enablePartialClone": false,
                                            "enableTGitCache": false,
                                            "enableSparseCone": false,
                                            "includePath": "",
                                            "excludePath": "",
                                            "cachePath": "",
                                            "enableGitLfs": true,
                                            "enableGitLfsClean": false,
                                            "lfsConcurrentTransfers": "",
                                            "enableSubmodule": true,
                                            "submodulePath": "",
                                            "enableSubmoduleRemote": false,
                                            "enableSubmoduleRecursive": true,
                                            "submoduleJobs": "",
                                            "submoduleDepth": "",
                                            "enableVirtualMergeBranch": true,
                                            "enableServerPreMerge": true,
                                            "enableGitClean": true,
                                            "enableGitCleanIgnore": true,
                                            "enableGitCleanNested": false,
                                            "autoCrlf": "false",
                                            "enableTrace": false,
                                            "setSafeDirectory": false,
                                            "mainRepo": false,
                                            "accessToken": "******",
                                            "personalAccessToken": "******",
                                            "password": "******"
                                        },
                                        "output": {
                                            "BK_CI_GIT_REPO_URL": "string",
                                            "BK_CI_GIT_REPO_ALIAS_NAME": "string",
                                            "BK_CI_GIT_REPO_NAME": "string",
                                            "BK_CI_GIT_REPO_REF": "string",
                                            "BK_CI_GIT_REPO_CODE_PATH": "string",
                                            "BK_CI_GIT_REPO_LAST_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_MR_TARGET_HEAD_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_COMMENT": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_AUTHOR": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_COMMITTER": "string",
                                            "BK_CI_GIT_REPO_COMMITS": "string",
                                            "BK_CI_GIT_REPO_MR_SOURCE_HEAD_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_MR_SOURCE_HEAD_COMMIT_COMMENT": "string"
                                        },
                                        "namespace": ""
                                    },
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 1,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "irwinsun",
                                        "otherTask": "",
                                        "customVariables": [
                                            {
                                                "key": "param1",
                                                "value": ""
                                            }
                                        ],
                                        "customCondition": "",
                                        "enableCustomEnv": true
                                    },
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 66177,
                                    "startEpoch": 1766113167283,
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 66177,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 66177
                                    },
                                    "asyncStatus": "",
                                    "classType": "marketBuild",
                                    "autoAtomCode": "checkout",
                                    "taskAtom": ""
                                },
                                {
                                    "@type": "linuxScript",
                                    "name": "判断是否后端提交",
                                    "id": "e-8d981c0f07ed4e569f791809ddf02ad7",
                                    "status": "SKIP",
                                    "scriptType": "SHELL",
                                    "script": "cd ${{ci.workspace}}\npwd\ndiff_file=${{BK_CI_BUILD_NUM}}_code_diff.txt\n\ngit diff origin/${BK_CI_REPO_GIT_WEBHOOK_TARGET_BRANCH}..devops-virtual-branch --name-only > $diff_file\n\ncat $diff_file\n\ngrep \"src/backend/ci\"  $diff_file || setEnv \"BACKEND\" \"false\"\n\nrm $diff_file",
                                    "continueNoneZero": false,
                                    "enableArchiveFile": false,
                                    "archiveFile": "",
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 0,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "",
                                        "otherTask": "",
                                        "customVariables": [
                                            {
                                                "key": "param1",
                                                "value": ""
                                            }
                                        ],
                                        "customCondition": "",
                                        "enableCustomEnv": false
                                    },
                                    "executeCount": 1,
                                    "canRetry": false,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 450,
                                    "startEpoch": 1766113234174,
                                    "originVersion": "1.*",
                                    "version": "1.*",
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 450,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 450
                                    },
                                    "asyncStatus": "",
                                    "classType": "linuxScript",
                                    "atomCode": "linuxScript",
                                    "taskAtom": ""
                                },
                                {
                                    "@type": "linuxScript",
                                    "name": "后端编译和单元测试",
                                    "id": "e-43324314fce6400b8955cb068284286d",
                                    "status": "SUCCEED",
                                    "stepId": "Z_y",
                                    "scriptType": "SHELL",
                                    "script": "# 您可以通过setEnv函数设置原子间传递的参数\n# setEnv \"FILENAME\" \"package.zip\"\n# 然后在后续的原子的表单中使用${FILENAME}引用这个变量\n\n# cd ${WORKSPACE} 可进入当前工作空间目录\n\ncd src/backend/ci/ext/tencent\n\n#gradle clean -Dorg.gradle.daemon=false -DmysqlURL=gamedb.test.devops.db:10001 -DmysqlUser=landun_test -DmysqlPasswd=ITDev@db2 -DmysqlPrefix=devops_ classes\nmysqlURL=gamedb.test.devops.db:10001\nmysqlUser=landun_test\nmysqlPasswd=ITDev@db2\nsetEnv \"processMysqlURL\" \"gamedb.test.devops.db:10001,gamedb.test2.devops.db:10000\"\nsetEnv \"processArchiveMysqlURL\" \"gamedb.test2.devops.db:10000\"\nsetEnv \"metricsMysqlURL\" \"gamedb.test.devops.db:10001,gamedb.test2.devops.db:10000\"\n\n# 使用jdk17版本\nexport JAVA_HOME=/usr/java/jdk17\nexport PATH=$JAVA_HOME/bin:$PATH\n\n\n${WORKSPACE}/src/backend/ci/gradlew -DmysqlURL=$mysqlURL -DmysqlUser=$mysqlUser -DmysqlPasswd=$mysqlPasswd  -DenvironmentMysqlURL=$mysqlURL -DenvironmentMysqlUser=$mysqlUser -DenvironmentMysqlPasswd=$mysqlPasswd -DprojectMysqlURL=$mysqlURL -DprojectMysqlUser=$mysqlUser -DprojectMysqlPasswd=$mysqlPasswd -DmysqlPrefix=devops_ test --no-daemon\n\n",
                                    "continueNoneZero": false,
                                    "enableArchiveFile": false,
                                    "archiveFile": "",
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 0,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "CUSTOM_VARIABLE_MATCH_NOT_RUN",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "",
                                        "otherTask": "",
                                        "customVariables": [
                                            {
                                                "key": "BACKEND",
                                                "value": "false"
                                            }
                                        ],
                                        "customCondition": "",
                                        "enableCustomEnv": false
                                    },
                                    "executeCount": 1,
                                    "canRetry": false,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 177108,
                                    "startEpoch": 1766113235344,
                                    "originVersion": "1.*",
                                    "version": "1.*",
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 177108,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 177108
                                    },
                                    "asyncStatus": "",
                                    "classType": "linuxScript",
                                    "atomCode": "linuxScript",
                                    "taskAtom": ""
                                },
                                {
                                    "@type": "marketBuild",
                                    "name": "生成不规范提交报告",
                                    "id": "e-44e426ef78924223850c051ae4905e38",
                                    "status": "SKIP",
                                    "atomCode": "devopsPub",
                                    "version": "3.0.34",
                                    "data": {
                                        "input": {
                                            "operate": "GENERATE_REPORT",
                                            "sourceRef": "devops-virtual-branch",
                                            "targetRef": "${BK_CI_REPO_GIT_WEBHOOK_TARGET_BRANCH}",
                                            "localPath": "",
                                            "specifyPath": "",
                                            "changeLog": "",
                                            "workflow": "BK",
                                            "githubRepo": "Tencent/bk-ci",
                                            "githubTicketId": "github_bot_token",
                                            "milestones": "",
                                            "githubStatusLabelJson": "",
                                            "githubAreaLabelJson": "",
                                            "excludeGithubLabels": "",
                                            "canPublicGithubStatus": "",
                                            "changeLogIncludeGithubLabels": "",
                                            "bkCanPublicGithubStatus": "",
                                            "bkChangeLogIncludeGithubLabels": [],
                                            "waitMergeGithubStatus": "",
                                            "githubPublicStatus": "",
                                            "githubAcceptanceStatus": "",
                                            "bkGithubPublicStatus": "",
                                            "bkGithubAcceptanceStatus": "",
                                            "githubIssueStatus": "open",
                                            "tgitRepo": "",
                                            "waitDeployTgitTargetBranch": "integration",
                                            "tapdWorkspaceIds": "",
                                            "tapdStatusDescJson": "",
                                            "needUpdateTapdIds": "",
                                            "waitMergeTapdStatus": "",
                                            "tapdCustomFieldName": "",
                                            "canPublicTapdStatus": "",
                                            "changeLogIncludeTapdIds": "",
                                            "changeLogIncludeTapdStatus": "",
                                            "bkCanPublicTapdStatus": "",
                                            "bkChangeLogIncludeTapdStatus": [],
                                            "tapdPublicBeforerStatus": "",
                                            "tapdPublicAfterStatus": "",
                                            "tapdAcceptanceStatus": "",
                                            "bkTapdPublicBeforerStatus": [],
                                            "bkTapdPublicAfterStatus": "",
                                            "bkTapdAcceptanceStatus": ""
                                        },
                                        "output": {},
                                        "namespace": ""
                                    },
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 1,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "mingshewhe",
                                        "otherTask": "",
                                        "customVariables": [
                                            {
                                                "key": "BACKEND",
                                                "value": "false"
                                            }
                                        ],
                                        "customCondition": "",
                                        "enableCustomEnv": false
                                    },
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 8359,
                                    "startEpoch": 1766113413020,
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 8359,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 8359
                                    },
                                    "asyncStatus": "",
                                    "classType": "marketBuild",
                                    "autoAtomCode": "devopsPub",
                                    "taskAtom": ""
                                },
                                {
                                    "@type": "linuxScript",
                                    "name": "检查不规范提交",
                                    "id": "e-3ce1a733c478487d90c971ce35c6a3b0",
                                    "status": "SUCCEED",
                                    "scriptType": "SHELL",
                                    "script": "cd report\nif [[ -f \"illegal-commit-message.txt\" ]]; then\n\n\n    illegalMessage=$(<illegal-commit-message.txt)\n    echo \"illegalMessage is:\"\n    echo $illegalMessage\n    if [[ -z \"$illegalMessage\" ]]; then\n        echo \"ok\"\n    else \n        echo \"构建链接: <a href='${{BK_CI_BUILD_URL}}'>${{BK_CI_BUILD_URL}}</a>\" >> illegal-commit-message.txt\n        exit 1\n    fi\nfi",
                                    "continueNoneZero": false,
                                    "enableArchiveFile": false,
                                    "archiveFile": "",
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": true,
                                        "manualSkip": true,
                                        "retryWhenFailed": false,
                                        "retryCount": 1,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "mingshewhe",
                                        "otherTask": "",
                                        "customVariables": [
                                            {
                                                "key": "param1",
                                                "value": ""
                                            }
                                        ],
                                        "customCondition": "",
                                        "enableCustomEnv": false
                                    },
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 418,
                                    "startEpoch": 1766113421938,
                                    "version": "1.*",
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 418,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 418
                                    },
                                    "asyncStatus": "",
                                    "classType": "linuxScript",
                                    "atomCode": "linuxScript",
                                    "taskAtom": ""
                                },
                                {
                                    "@type": "linuxScript",
                                    "name": "清理磁盘",
                                    "id": "e-1e61148c1d6540a0beef3fd52d7cacb2",
                                    "status": "SUCCEED",
                                    "scriptType": "SHELL",
                                    "script": "# 您可以通过setEnv函数设置插件间传递的参数\n# setEnv \"FILENAME\" \"package.zip\"\n# 然后在后续的插件的表单中使用${FILENAME}引用这个变量\n\n# 您可以在质量红线中创建自定义指标，然后通过setGateValue函数设置指标值\n# setGateValue \"CodeCoverage\" $myValue\n# 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住\n\n# cd ${WORKSPACE} 可进入当前工作空间目录\n\nls -al \ncd ../\nrm -rf ${BK_CI_BUILD_NUM}\n\nls -al ",
                                    "continueNoneZero": false,
                                    "enableArchiveFile": false,
                                    "archiveFile": "",
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 0,
                                        "manualRetry": true,
                                        "timeout": 10,
                                        "timeoutVar": "10",
                                        "runCondition": "PRE_TASK_FAILED_EVEN_CANCEL",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "",
                                        "otherTask": "",
                                        "customVariables": [
                                            {
                                                "key": "hasIllegalMessage",
                                                "value": "true"
                                            }
                                        ],
                                        "customCondition": "",
                                        "enableCustomEnv": false
                                    },
                                    "executeCount": 1,
                                    "canRetry": false,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 1618,
                                    "startEpoch": 1766113422979,
                                    "originVersion": "1.*",
                                    "version": "1.*",
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 1618,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 1618
                                    },
                                    "asyncStatus": "",
                                    "classType": "linuxScript",
                                    "atomCode": "linuxScript",
                                    "taskAtom": ""
                                },
                                {
                                    "@type": "marketBuild",
                                    "name": "POST：Checkout",
                                    "id": "e-d967f1335c7945eda42af168d6c9e4c6",
                                    "status": "SUCCEED",
                                    "atomCode": "checkout",
                                    "version": "1.0.117",
                                    "stepId": "",
                                    "data": {
                                        "input": {
                                            "repositoryType": "ID",
                                            "repositoryHashId": "lyZj",
                                            "repositoryName": "",
                                            "repositoryUrl": "",
                                            "authType": "TICKET",
                                            "persistCredentials": true,
                                            "pullType": "BRANCH",
                                            "refName": "${BK_CI_REPO_GIT_WEBHOOK_TARGET_BRANCH}",
                                            "localPath": "",
                                            "strategy": "REVERT_UPDATE",
                                            "fetchDepth": "",
                                            "fetchOnlyCurrentRef": false,
                                            "enableFetchRefSpec": false,
                                            "fetchRefSpec": "",
                                            "enablePartialClone": false,
                                            "enableTGitCache": false,
                                            "enableSparseCone": false,
                                            "includePath": "",
                                            "excludePath": "",
                                            "cachePath": "",
                                            "enableGitLfs": true,
                                            "enableGitLfsClean": false,
                                            "lfsConcurrentTransfers": "",
                                            "enableSubmodule": true,
                                            "submodulePath": "",
                                            "enableSubmoduleRemote": false,
                                            "enableSubmoduleRecursive": true,
                                            "submoduleJobs": "",
                                            "submoduleDepth": "",
                                            "enableVirtualMergeBranch": true,
                                            "enableServerPreMerge": true,
                                            "enableGitClean": true,
                                            "enableGitCleanIgnore": true,
                                            "enableGitCleanNested": false,
                                            "autoCrlf": "false",
                                            "enableTrace": false,
                                            "setSafeDirectory": false,
                                            "mainRepo": false,
                                            "accessToken": "******",
                                            "personalAccessToken": "******",
                                            "password": "******"
                                        },
                                        "output": {
                                            "BK_CI_GIT_REPO_URL": "string",
                                            "BK_CI_GIT_REPO_ALIAS_NAME": "string",
                                            "BK_CI_GIT_REPO_NAME": "string",
                                            "BK_CI_GIT_REPO_REF": "string",
                                            "BK_CI_GIT_REPO_CODE_PATH": "string",
                                            "BK_CI_GIT_REPO_LAST_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_MR_TARGET_HEAD_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_COMMENT": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_AUTHOR": "string",
                                            "BK_CI_GIT_REPO_HEAD_COMMIT_COMMITTER": "string",
                                            "BK_CI_GIT_REPO_COMMITS": "string",
                                            "BK_CI_GIT_REPO_MR_SOURCE_HEAD_COMMIT_ID": "string",
                                            "BK_CI_GIT_REPO_MR_SOURCE_HEAD_COMMIT_COMMENT": "string"
                                        },
                                        "namespace": ""
                                    },
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": true,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 0,
                                        "manualRetry": true,
                                        "timeout": 100,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_FAILED_BUT_CANCEL",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "irwinsun",
                                        "otherTask": "",
                                        "customVariables": [
                                            {
                                                "key": "param1",
                                                "value": ""
                                            }
                                        ],
                                        "customCondition": "",
                                        "elementPostInfo": {
                                            "postEntryParam": "True",
                                            "postCondition": "always()",
                                            "parentElementId": "e-11a7483dde1f4aa0b8b61c7d2c253cad",
                                            "parentElementName": "Checkout",
                                            "parentElementJobIndex": 0
                                        },
                                        "enableCustomEnv": true
                                    },
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 2384,
                                    "startEpoch": 1766113425149,
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 2384,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 2384
                                    },
                                    "asyncStatus": "",
                                    "classType": "marketBuild",
                                    "autoAtomCode": "checkout",
                                    "taskAtom": ""
                                }
                            ],
                            "status": "SUCCEED",
                            "startEpoch": 1766113166704,
                            "systemElapsed": 0,
                            "elementElapsed": 256514,
                            "baseOS": "LINUX",
                            "vmNames": [],
                            "maxQueueMinutes": 60,
                            "maxRunningMinutes": 900,
                            "buildEnv": {},
                            "dispatchType": {
                                "buildType": "THIRD_PARTY_AGENT_ENV",
                                "value": "qpalgybm",
                                "workspace": "/data/devops/workspace/integration/${BK_CI_BUILD_NUM}",
                                "agentType": "ID",
                                "isEnv": true,
                                "isSingle": false
                            },
                            "showBuildResource": true,
                            "canRetry": false,
                            "enableExternal": false,
                            "containerId": "2",
                            "containerHashId": "c-4ee48713d8a64fdf9c077e1fb8777b03",
                            "jobControlOption": {
                                "enable": true,
                                "prepareTimeout": 10,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "runCondition": "STAGE_RUNNING",
                                "customVariables": [
                                    {
                                        "key": "param1",
                                        "value": ""
                                    }
                                ],
                                "customCondition": "",
                                "dependOnType": "ID",
                                "dependOnId": [],
                                "dependOnName": "",
                                "continueWhenFailed": false
                            },
                            "mutexGroup": {
                                "enable": false,
                                "mutexGroupName": "",
                                "queueEnable": false,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "queue": 5,
                                "linkTip": "p-5ef04bbb79dd42a9941c9e535d81eeb7_Pipeline[BK-CI通用MR代码检查]Job[后端编译检查]"
                            },
                            "startVMStatus": "SUCCEED",
                            "executeCount": 1,
                            "jobId": "job_JkQ",
                            "containPostTaskFlag": true,
                            "matrixGroupFlag": false,
                            "timeCost": {
                                "systemCost": 0,
                                "executeCost": 256518,
                                "waitCost": 0,
                                "queueCost": 267439,
                                "totalCost": 267914
                            },
                            "startVMTaskSeq": 1,
                            "matrixControlOption": {
                                "strategyStr": "",
                                "includeCaseStr": "",
                                "excludeCaseStr": "",
                                "fastKill": true,
                                "maxConcurrency": 5
                            },
                            "nfsSwitch": true,
                            "classType": "vmBuild"
                        }
                    ],
                    "id": "stage-2",
                    "name": "预合并检查",
                    "tag": [
                        "28ee946a59f64949a74f3dee40a1bda4"
                    ],
                    "status": "SUCCEED",
                    "startEpoch": 1766113162602,
                    "elapsed": 288924,
                    "fastKill": false,
                    "finally": false,
                    "canRetry": false,
                    "stageControlOption": {
                        "enable": true,
                        "runCondition": "AFTER_LAST_FINISHED",
                        "customVariables": [
                            {
                                "key": "param1",
                                "value": ""
                            }
                        ],
                        "manualTrigger": false,
                        "timeout": 24
                    },
                    "executeCount": 1,
                    "timeCost": {
                        "systemCost": 9342,
                        "executeCost": 279404,
                        "waitCost": 168,
                        "queueCost": 168,
                        "totalCost": 288914
                    }
                },
                {
                    "containers": [
                        {
                            "@type": "normal",
                            "id": "3",
                            "name": "无编译环境",
                            "elements": [
                                {
                                    "@type": "marketBuildLess",
                                    "name": "异步同步到test分支",
                                    "id": "e-b79a2ddcad044d338fcad9c3c53a2777",
                                    "status": "SKIP",
                                    "atomCode": "SubPipelineExec",
                                    "version": "5.0.6",
                                    "data": {
                                        "input": {
                                            "projectId": "bkdevops",
                                            "subPipelineType": "ID",
                                            "subPip": "p-29fe7b77303048e99e841ebf2313e820",
                                            "subPipelineName": "",
                                            "runMode": "asyn",
                                            "params": "[{\"key\":\"hookType\",\"value\":\"GIT\"},{\"key\":\"BK_CI_HOOK_SOURCE_URL\",\"value\":\"${{BK_CI_HOOK_SOURCE_URL}}\"},{\"key\":\"BK_CI_HOOK_SOURCE_BRANCH\",\"value\":\"${{BK_CI_HOOK_SOURCE_BRANCH}}\"},{\"key\":\"BK_CI_HOOK_TARGET_BRANCH\",\"value\":\"${{BK_CI_HOOK_TARGET_BRANCH}}\"},{\"key\":\"BK_CI_REPO_GIT_WEBHOOK_MR_NUMBER\",\"value\":\"${{BK_CI_REPO_GIT_WEBHOOK_MR_NUMBER}}\"},{\"key\":\"BK_CI_REPO_GIT_WEBHOOK_MR_ID\",\"value\":\"${{BK_CI_REPO_GIT_WEBHOOK_MR_ID}}\"},{\"key\":\"BK_CI_REPO_GIT_WEBHOOK_MR_AUTHOR\",\"value\":\"${{BK_CI_REPO_GIT_WEBHOOK_MR_AUTHOR}}\"}]"
                                        },
                                        "output": {
                                            "sub_pipeline_buildId": "string",
                                            "sub_pipeline_url": "string"
                                        },
                                        "namespace": ""
                                    },
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 3267,
                                    "startEpoch": 1766113453689,
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 1,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "mingshewhe",
                                        "otherTask": "",
                                        "customVariables": [
                                            {
                                                "key": "mergeable",
                                                "value": "true"
                                            }
                                        ],
                                        "customCondition": "",
                                        "enableCustomEnv": true
                                    },
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 3267,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 3267
                                    },
                                    "asyncStatus": "SUCCEED",
                                    "classType": "marketBuildLess",
                                    "autoAtomCode": "SubPipelineExec",
                                    "taskAtom": ""
                                }
                            ],
                            "status": "SUCCEED",
                            "startEpoch": 1766113453026,
                            "systemElapsed": 4640,
                            "elementElapsed": 3267,
                            "enableSkip": false,
                            "canRetry": false,
                            "containerId": "3",
                            "containerHashId": "c-3136ebedc3f54bbe8a778d227186ff21",
                            "maxQueueMinutes": 60,
                            "maxRunningMinutes": 1440,
                            "jobControlOption": {
                                "enable": true,
                                "prepareTimeout": 10,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "runCondition": "STAGE_RUNNING",
                                "customVariables": [
                                    {
                                        "key": "param1",
                                        "value": ""
                                    }
                                ],
                                "customCondition": "",
                                "dependOnType": "ID",
                                "dependOnId": [],
                                "dependOnName": "",
                                "continueWhenFailed": false
                            },
                            "mutexGroup": {
                                "enable": false,
                                "mutexGroupName": "",
                                "queueEnable": false,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "queue": 5,
                                "linkTip": "p-5ef04bbb79dd42a9941c9e535d81eeb7_Pipeline[BK-CI通用MR代码检查]Job[无编译环境]"
                            },
                            "startVMStatus": "SUCCEED",
                            "executeCount": 1,
                            "jobId": "job_b0F",
                            "containPostTaskFlag": false,
                            "matrixGroupFlag": false,
                            "timeCost": {
                                "systemCost": 4640,
                                "executeCost": 3268,
                                "waitCost": 0,
                                "queueCost": 0,
                                "totalCost": 7908
                            },
                            "startVMTaskSeq": 1,
                            "matrixControlOption": {
                                "strategyStr": "",
                                "includeCaseStr": "",
                                "excludeCaseStr": "",
                                "fastKill": true,
                                "maxConcurrency": 5
                            },
                            "classType": "normal"
                        }
                    ],
                    "id": "stage-3",
                    "name": "stage-2",
                    "tag": [
                        "28ee946a59f64949a74f3dee40a1bda4"
                    ],
                    "status": "SUCCEED",
                    "startEpoch": 1766113451882,
                    "elapsed": 8663,
                    "fastKill": false,
                    "finally": false,
                    "canRetry": false,
                    "stageControlOption": {
                        "enable": true,
                        "runCondition": "AFTER_LAST_FINISHED",
                        "customVariables": [
                            {
                                "key": "param1",
                                "value": ""
                            }
                        ],
                        "customCondition": "",
                        "manualTrigger": false,
                        "triggerUsers": [],
                        "timeout": 24
                    },
                    "checkIn": {
                        "manualTrigger": false,
                        "timeout": 24,
                        "markdownContent": false,
                        "notifyType": [
                            "RTX"
                        ]
                    },
                    "checkOut": {
                        "manualTrigger": false,
                        "timeout": 24,
                        "markdownContent": false,
                        "notifyType": [
                            "RTX"
                        ]
                    },
                    "executeCount": 1,
                    "timeCost": {
                        "systemCost": 5228,
                        "executeCost": 3268,
                        "waitCost": 158,
                        "queueCost": 158,
                        "totalCost": 8654
                    }
                },
                {
                    "containers": [
                        {
                            "@type": "vmBuild",
                            "id": "matrix-1",
                            "name": "矩阵构建组1",
                            "elements": [
                                {
                                    "@type": "marketBuild",
                                    "name": "Checkout",
                                    "id": "e-matrix1-checkout",
                                    "status": "SUCCEED",
                                    "atomCode": "checkout",
                                    "version": "1.0.117",
                                    "stepId": "matrix1-checkout",
                                    "data": {
                                        "input": {
                                            "repositoryType": "ID",
                                            "repositoryHashId": "lyZj",
                                            "pullType": "BRANCH",
                                            "refName": "master"
                                        },
                                        "output": {},
                                        "namespace": ""
                                    },
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 0,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "",
                                        "otherTask": "",
                                        "customVariables": [],
                                        "customCondition": "",
                                        "enableCustomEnv": false
                                    },
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 5000,
                                    "startEpoch": 1766113500000,
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 5000,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 5000
                                    },
                                    "asyncStatus": "",
                                    "classType": "marketBuild",
                                    "autoAtomCode": "checkout",
                                    "taskAtom": ""
                                },
                                {
                                    "@type": "linuxScript",
                                    "name": "构建脚本",
                                    "id": "e-matrix1-build",
                                    "status": "SUCCEED",
                                    "scriptType": "SHELL",
                                    "script": "echo 'Building matrix 1'",
                                    "continueNoneZero": false,
                                    "enableArchiveFile": false,
                                    "archiveFile": "",
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 0,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "",
                                        "otherTask": "",
                                        "customVariables": [],
                                        "customCondition": "",
                                        "enableCustomEnv": false
                                    },
                                    "executeCount": 1,
                                    "canRetry": false,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 3000,
                                    "startEpoch": 1766113505000,
                                    "originVersion": "1.*",
                                    "version": "1.*",
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 3000,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 3000
                                    },
                                    "asyncStatus": "",
                                    "classType": "linuxScript",
                                    "atomCode": "linuxScript",
                                    "taskAtom": ""
                                }
                            ],
                            "status": "SUCCEED",
                            "startEpoch": 1766113500000,
                            "systemElapsed": 0,
                            "elementElapsed": 8000,
                            "baseOS": "LINUX",
                            "vmNames": [],
                            "maxQueueMinutes": 60,
                            "maxRunningMinutes": 900,
                            "buildEnv": {},
                            "dispatchType": {
                                "buildType": "THIRD_PARTY_AGENT_ENV",
                                "value": "qpalgybm",
                                "workspace": "/data/devops/workspace/integration/${BK_CI_BUILD_NUM}",
                                "agentType": "ID",
                                "isEnv": true,
                                "isSingle": false
                            },
                            "showBuildResource": true,
                            "canRetry": false,
                            "enableExternal": false,
                            "containerId": "matrix-1",
                            "containerHashId": "c-matrix1-parent",
                            "jobControlOption": {
                                "enable": true,
                                "prepareTimeout": 10,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "runCondition": "STAGE_RUNNING",
                                "customVariables": [],
                                "customCondition": "",
                                "dependOnType": "ID",
                                "dependOnId": [],
                                "dependOnName": "",
                                "continueWhenFailed": false
                            },
                            "mutexGroup": {
                                "enable": false,
                                "mutexGroupName": "",
                                "queueEnable": false,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "queue": 5,
                                "linkTip": ""
                            },
                            "startVMStatus": "SUCCEED",
                            "executeCount": 1,
                            "jobId": "job_matrix1",
                            "containPostTaskFlag": false,
                            "matrixGroupFlag": true,
                            "timeCost": {
                                "systemCost": 0,
                                "executeCost": 8000,
                                "waitCost": 0,
                                "queueCost": 0,
                                "totalCost": 8000
                            },
                            "startVMTaskSeq": 1,
                            "matrixControlOption": {
                                "strategyStr": "",
                                "includeCaseStr": "",
                                "excludeCaseStr": "",
                                "fastKill": true,
                                "maxConcurrency": 5
                            },
                            "nfsSwitch": true,
                            "classType": "vmBuild",
                            "groupContainers": [
                                {
                                    "@type": "vmBuild",
                                    "id": "matrix-1-1",
                                    "name": "矩阵1-组合1 (OS: Linux, Node: 14)",
                                    "elements": [
                                        {
                                            "@type": "marketBuild",
                                            "name": "Checkout",
                                            "id": "e-matrix1-1-checkout",
                                            "status": "SUCCEED",
                                            "atomCode": "checkout",
                                            "version": "1.0.117",
                                            "stepId": "matrix1-1-checkout",
                                            "data": {
                                                "input": {
                                                    "repositoryType": "ID",
                                                    "repositoryHashId": "lyZj",
                                                    "pullType": "BRANCH",
                                                    "refName": "master"
                                                },
                                                "output": {},
                                                "namespace": ""
                                            },
                                            "additionalOptions": {
                                                "enable": true,
                                                "continueWhenFailed": false,
                                                "manualSkip": false,
                                                "retryWhenFailed": false,
                                                "retryCount": 0,
                                                "manualRetry": false,
                                                "timeout": 900,
                                                "timeoutVar": "900",
                                                "runCondition": "PRE_TASK_SUCCESS",
                                                "pauseBeforeExec": false,
                                                "subscriptionPauseUser": "",
                                                "otherTask": "",
                                                "customVariables": [],
                                                "customCondition": "",
                                                "enableCustomEnv": false
                                            },
                                            "executeCount": 1,
                                            "retryCount": 0,
                                            "retryCountManual": 0,
                                            "elapsed": 4500,
                                            "startEpoch": 1766113501000,
                                            "timeCost": {
                                                "systemCost": 0,
                                                "executeCost": 4500,
                                                "waitCost": 0,
                                                "queueCost": 0,
                                                "totalCost": 4500
                                            },
                                            "asyncStatus": "",
                                            "classType": "marketBuild",
                                            "autoAtomCode": "checkout",
                                            "taskAtom": ""
                                        },
                                        {
                                            "@type": "linuxScript",
                                            "name": "构建脚本",
                                            "id": "e-matrix1-1-build",
                                            "status": "SUCCEED",
                                            "scriptType": "SHELL",
                                            "script": "echo 'Building with OS: Linux, Node: 14'",
                                            "continueNoneZero": false,
                                            "enableArchiveFile": false,
                                            "archiveFile": "",
                                            "additionalOptions": {
                                                "enable": true,
                                                "continueWhenFailed": false,
                                                "manualSkip": false,
                                                "retryWhenFailed": false,
                                                "retryCount": 0,
                                                "manualRetry": false,
                                                "timeout": 900,
                                                "timeoutVar": "900",
                                                "runCondition": "PRE_TASK_SUCCESS",
                                                "pauseBeforeExec": false,
                                                "subscriptionPauseUser": "",
                                                "otherTask": "",
                                                "customVariables": [],
                                                "customCondition": "",
                                                "enableCustomEnv": false
                                            },
                                            "executeCount": 1,
                                            "canRetry": false,
                                            "retryCount": 0,
                                            "retryCountManual": 0,
                                            "elapsed": 2800,
                                            "startEpoch": 1766113505500,
                                            "originVersion": "1.*",
                                            "version": "1.*",
                                            "timeCost": {
                                                "systemCost": 0,
                                                "executeCost": 2800,
                                                "waitCost": 0,
                                                "queueCost": 0,
                                                "totalCost": 2800
                                            },
                                            "asyncStatus": "",
                                            "classType": "linuxScript",
                                            "atomCode": "linuxScript",
                                            "taskAtom": ""
                                        }
                                    ],
                                    "status": "SUCCEED",
                                    "startEpoch": 1766113501000,
                                    "systemElapsed": 0,
                                    "elementElapsed": 7300,
                                    "baseOS": "LINUX",
                                    "vmNames": [],
                                    "maxQueueMinutes": 60,
                                    "maxRunningMinutes": 900,
                                    "buildEnv": {
                                        "OS": "Linux",
                                        "NODE_VERSION": "14"
                                    },
                                    "dispatchType": {
                                        "buildType": "THIRD_PARTY_AGENT_ENV",
                                        "value": "qpalgybm",
                                        "workspace": "/data/devops/workspace/integration/${BK_CI_BUILD_NUM}",
                                        "agentType": "ID",
                                        "isEnv": true,
                                        "isSingle": false
                                    },
                                    "showBuildResource": true,
                                    "canRetry": false,
                                    "enableExternal": false,
                                    "containerId": "matrix-1-1",
                                    "containerHashId": "c-matrix1-1",
                                    "jobControlOption": {
                                        "enable": true,
                                        "prepareTimeout": 10,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "STAGE_RUNNING",
                                        "customVariables": [],
                                        "customCondition": "",
                                        "dependOnType": "ID",
                                        "dependOnId": [],
                                        "dependOnName": "",
                                        "continueWhenFailed": false
                                    },
                                    "mutexGroup": {
                                        "enable": false,
                                        "mutexGroupName": "",
                                        "queueEnable": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "queue": 5,
                                        "linkTip": ""
                                    },
                                    "startVMStatus": "SUCCEED",
                                    "executeCount": 1,
                                    "jobId": "job_matrix1_1",
                                    "containPostTaskFlag": false,
                                    "matrixGroupFlag": false,
                                    "matrixGroupId": "matrix-1",
                                    "matrixContext": {
                                        "OS": "Linux",
                                        "NODE_VERSION": "14"
                                    },
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 7300,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 7300
                                    },
                                    "startVMTaskSeq": 1,
                                    "matrixControlOption": {
                                        "strategyStr": "",
                                        "includeCaseStr": "",
                                        "excludeCaseStr": "",
                                        "fastKill": true,
                                        "maxConcurrency": 5
                                    },
                                    "nfsSwitch": true,
                                    "classType": "vmBuild"
                                },
                                {
                                    "@type": "vmBuild",
                                    "id": "matrix-1-2",
                                    "name": "矩阵1-组合2 (OS: Linux, Node: 16)",
                                    "elements": [
                                        {
                                            "@type": "marketBuild",
                                            "name": "Checkout",
                                            "id": "e-matrix1-2-checkout",
                                            "status": "SUCCEED",
                                            "atomCode": "checkout",
                                            "version": "1.0.117",
                                            "stepId": "matrix1-2-checkout",
                                            "data": {
                                                "input": {
                                                    "repositoryType": "ID",
                                                    "repositoryHashId": "lyZj",
                                                    "pullType": "BRANCH",
                                                    "refName": "master"
                                                },
                                                "output": {},
                                                "namespace": ""
                                            },
                                            "additionalOptions": {
                                                "enable": true,
                                                "continueWhenFailed": false,
                                                "manualSkip": false,
                                                "retryWhenFailed": false,
                                                "retryCount": 0,
                                                "manualRetry": false,
                                                "timeout": 900,
                                                "timeoutVar": "900",
                                                "runCondition": "PRE_TASK_SUCCESS",
                                                "pauseBeforeExec": false,
                                                "subscriptionPauseUser": "",
                                                "otherTask": "",
                                                "customVariables": [],
                                                "customCondition": "",
                                                "enableCustomEnv": false
                                            },
                                            "executeCount": 1,
                                            "retryCount": 0,
                                            "retryCountManual": 0,
                                            "elapsed": 4800,
                                            "startEpoch": 1766113502000,
                                            "timeCost": {
                                                "systemCost": 0,
                                                "executeCost": 4800,
                                                "waitCost": 0,
                                                "queueCost": 0,
                                                "totalCost": 4800
                                            },
                                            "asyncStatus": "",
                                            "classType": "marketBuild",
                                            "autoAtomCode": "checkout",
                                            "taskAtom": ""
                                        },
                                        {
                                            "@type": "linuxScript",
                                            "name": "构建脚本",
                                            "id": "e-matrix1-2-build",
                                            "status": "SKIP",
                                            "scriptType": "SHELL",
                                            "script": "echo 'Building with OS: Linux, Node: 16'",
                                            "continueNoneZero": false,
                                            "enableArchiveFile": false,
                                            "archiveFile": "",
                                            "additionalOptions": {
                                                "enable": true,
                                                "continueWhenFailed": false,
                                                "manualSkip": false,
                                                "retryWhenFailed": false,
                                                "retryCount": 0,
                                                "manualRetry": false,
                                                "timeout": 900,
                                                "timeoutVar": "900",
                                                "runCondition": "PRE_TASK_SUCCESS",
                                                "pauseBeforeExec": false,
                                                "subscriptionPauseUser": "",
                                                "otherTask": "",
                                                "customVariables": [],
                                                "customCondition": "",
                                                "enableCustomEnv": false
                                            },
                                            "executeCount": 1,
                                            "canRetry": false,
                                            "retryCount": 0,
                                            "retryCountManual": 0,
                                            "elapsed": 0,
                                            "startEpoch": 1766113506800,
                                            "originVersion": "1.*",
                                            "version": "1.*",
                                            "timeCost": {
                                                "systemCost": 0,
                                                "executeCost": 0,
                                                "waitCost": 0,
                                                "queueCost": 0,
                                                "totalCost": 0
                                            },
                                            "asyncStatus": "",
                                            "classType": "linuxScript",
                                            "atomCode": "linuxScript",
                                            "taskAtom": ""
                                        }
                                    ],
                                    "status": "SUCCEED",
                                    "startEpoch": 1766113502000,
                                    "systemElapsed": 0,
                                    "elementElapsed": 4800,
                                    "baseOS": "LINUX",
                                    "vmNames": [],
                                    "maxQueueMinutes": 60,
                                    "maxRunningMinutes": 900,
                                    "buildEnv": {
                                        "OS": "Linux",
                                        "NODE_VERSION": "16"
                                    },
                                    "dispatchType": {
                                        "buildType": "THIRD_PARTY_AGENT_ENV",
                                        "value": "qpalgybm",
                                        "workspace": "/data/devops/workspace/integration/${BK_CI_BUILD_NUM}",
                                        "agentType": "ID",
                                        "isEnv": true,
                                        "isSingle": false
                                    },
                                    "showBuildResource": true,
                                    "canRetry": false,
                                    "enableExternal": false,
                                    "containerId": "matrix-1-2",
                                    "containerHashId": "c-matrix1-2",
                                    "jobControlOption": {
                                        "enable": true,
                                        "prepareTimeout": 10,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "STAGE_RUNNING",
                                        "customVariables": [],
                                        "customCondition": "",
                                        "dependOnType": "ID",
                                        "dependOnId": [],
                                        "dependOnName": "",
                                        "continueWhenFailed": false
                                    },
                                    "mutexGroup": {
                                        "enable": false,
                                        "mutexGroupName": "",
                                        "queueEnable": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "queue": 5,
                                        "linkTip": ""
                                    },
                                    "startVMStatus": "SUCCEED",
                                    "executeCount": 1,
                                    "jobId": "job_matrix1_2",
                                    "containPostTaskFlag": false,
                                    "matrixGroupFlag": false,
                                    "matrixGroupId": "matrix-1",
                                    "matrixContext": {
                                        "OS": "Linux",
                                        "NODE_VERSION": "16"
                                    },
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 4800,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 4800
                                    },
                                    "startVMTaskSeq": 1,
                                    "matrixControlOption": {
                                        "strategyStr": "",
                                        "includeCaseStr": "",
                                        "excludeCaseStr": "",
                                        "fastKill": true,
                                        "maxConcurrency": 5
                                    },
                                    "nfsSwitch": true,
                                    "classType": "vmBuild"
                                }
                            ]
                        },
                        {
                            "@type": "vmBuild",
                            "id": "matrix-2",
                            "name": "矩阵构建组2",
                            "elements": [
                                {
                                    "@type": "marketBuild",
                                    "name": "Checkout",
                                    "id": "e-matrix2-checkout",
                                    "status": "SUCCEED",
                                    "atomCode": "checkout",
                                    "version": "1.0.117",
                                    "stepId": "matrix2-checkout",
                                    "data": {
                                        "input": {
                                            "repositoryType": "ID",
                                            "repositoryHashId": "lyZj",
                                            "pullType": "BRANCH",
                                            "refName": "master"
                                        },
                                        "output": {},
                                        "namespace": ""
                                    },
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 0,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "",
                                        "otherTask": "",
                                        "customVariables": [],
                                        "customCondition": "",
                                        "enableCustomEnv": false
                                    },
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 5200,
                                    "startEpoch": 1766113510000,
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 5200,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 5200
                                    },
                                    "asyncStatus": "",
                                    "classType": "marketBuild",
                                    "autoAtomCode": "checkout",
                                    "taskAtom": ""
                                }
                            ],
                            "status": "SUCCEED",
                            "startEpoch": 1766113510000,
                            "systemElapsed": 0,
                            "elementElapsed": 5200,
                            "baseOS": "LINUX",
                            "vmNames": [],
                            "maxQueueMinutes": 60,
                            "maxRunningMinutes": 900,
                            "buildEnv": {},
                            "dispatchType": {
                                "buildType": "THIRD_PARTY_AGENT_ENV",
                                "value": "qpalgybm",
                                "workspace": "/data/devops/workspace/integration/${BK_CI_BUILD_NUM}",
                                "agentType": "ID",
                                "isEnv": true,
                                "isSingle": false
                            },
                            "showBuildResource": true,
                            "canRetry": false,
                            "enableExternal": false,
                            "containerId": "matrix-2",
                            "containerHashId": "c-matrix2-parent",
                            "jobControlOption": {
                                "enable": true,
                                "prepareTimeout": 10,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "runCondition": "STAGE_RUNNING",
                                "customVariables": [],
                                "customCondition": "",
                                "dependOnType": "ID",
                                "dependOnId": [],
                                "dependOnName": "",
                                "continueWhenFailed": false
                            },
                            "mutexGroup": {
                                "enable": false,
                                "mutexGroupName": "",
                                "queueEnable": false,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "queue": 5,
                                "linkTip": ""
                            },
                            "startVMStatus": "SUCCEED",
                            "executeCount": 1,
                            "jobId": "job_matrix2",
                            "containPostTaskFlag": false,
                            "matrixGroupFlag": true,
                            "timeCost": {
                                "systemCost": 0,
                                "executeCost": 5200,
                                "waitCost": 0,
                                "queueCost": 0,
                                "totalCost": 5200
                            },
                            "startVMTaskSeq": 1,
                            "matrixControlOption": {
                                "strategyStr": "",
                                "includeCaseStr": "",
                                "excludeCaseStr": "",
                                "fastKill": true,
                                "maxConcurrency": 5
                            },
                            "nfsSwitch": true,
                            "classType": "vmBuild",
                            "groupContainers": [
                                {
                                    "@type": "vmBuild",
                                    "id": "matrix-2-1",
                                    "name": "矩阵2-组合1 (OS: Windows, Node: 18)",
                                    "elements": [
                                        {
                                            "@type": "marketBuild",
                                            "name": "Checkout",
                                            "id": "e-matrix2-1-checkout",
                                            "status": "SUCCEED",
                                            "atomCode": "checkout",
                                            "version": "1.0.117",
                                            "stepId": "matrix2-1-checkout",
                                            "data": {
                                                "input": {
                                                    "repositoryType": "ID",
                                                    "repositoryHashId": "lyZj",
                                                    "pullType": "BRANCH",
                                                    "refName": "master"
                                                },
                                                "output": {},
                                                "namespace": ""
                                            },
                                            "additionalOptions": {
                                                "enable": true,
                                                "continueWhenFailed": false,
                                                "manualSkip": false,
                                                "retryWhenFailed": false,
                                                "retryCount": 0,
                                                "manualRetry": false,
                                                "timeout": 900,
                                                "timeoutVar": "900",
                                                "runCondition": "PRE_TASK_SUCCESS",
                                                "pauseBeforeExec": false,
                                                "subscriptionPauseUser": "",
                                                "otherTask": "",
                                                "customVariables": [],
                                                "customCondition": "",
                                                "enableCustomEnv": false
                                            },
                                            "executeCount": 1,
                                            "retryCount": 0,
                                            "retryCountManual": 0,
                                            "elapsed": 5000,
                                            "startEpoch": 1766113511000,
                                            "timeCost": {
                                                "systemCost": 0,
                                                "executeCost": 5000,
                                                "waitCost": 0,
                                                "queueCost": 0,
                                                "totalCost": 5000
                                            },
                                            "asyncStatus": "",
                                            "classType": "marketBuild",
                                            "autoAtomCode": "checkout",
                                            "taskAtom": ""
                                        },
                                        {
                                            "@type": "linuxScript",
                                            "name": "构建脚本",
                                            "id": "e-matrix2-1-build",
                                            "status": "SUCCEED",
                                            "scriptType": "SHELL",
                                            "script": "echo 'Building with OS: Windows, Node: 18'",
                                            "continueNoneZero": false,
                                            "enableArchiveFile": false,
                                            "archiveFile": "",
                                            "additionalOptions": {
                                                "enable": true,
                                                "continueWhenFailed": false,
                                                "manualSkip": false,
                                                "retryWhenFailed": false,
                                                "retryCount": 0,
                                                "manualRetry": false,
                                                "timeout": 900,
                                                "timeoutVar": "900",
                                                "runCondition": "PRE_TASK_SUCCESS",
                                                "pauseBeforeExec": false,
                                                "subscriptionPauseUser": "",
                                                "otherTask": "",
                                                "customVariables": [],
                                                "customCondition": "",
                                                "enableCustomEnv": false
                                            },
                                            "executeCount": 1,
                                            "canRetry": false,
                                            "retryCount": 0,
                                            "retryCountManual": 0,
                                            "elapsed": 3200,
                                            "startEpoch": 1766113516000,
                                            "originVersion": "1.*",
                                            "version": "1.*",
                                            "timeCost": {
                                                "systemCost": 0,
                                                "executeCost": 3200,
                                                "waitCost": 0,
                                                "queueCost": 0,
                                                "totalCost": 3200
                                            },
                                            "asyncStatus": "",
                                            "classType": "linuxScript",
                                            "atomCode": "linuxScript",
                                            "taskAtom": ""
                                        }
                                    ],
                                    "status": "SUCCEED",
                                    "startEpoch": 1766113511000,
                                    "systemElapsed": 0,
                                    "elementElapsed": 8200,
                                    "baseOS": "WINDOWS",
                                    "vmNames": [],
                                    "maxQueueMinutes": 60,
                                    "maxRunningMinutes": 900,
                                    "buildEnv": {
                                        "OS": "Windows",
                                        "NODE_VERSION": "18"
                                    },
                                    "dispatchType": {
                                        "buildType": "THIRD_PARTY_AGENT_ENV",
                                        "value": "qpalgybm",
                                        "workspace": "/data/devops/workspace/integration/${BK_CI_BUILD_NUM}",
                                        "agentType": "ID",
                                        "isEnv": true,
                                        "isSingle": false
                                    },
                                    "showBuildResource": true,
                                    "canRetry": false,
                                    "enableExternal": false,
                                    "containerId": "matrix-2-1",
                                    "containerHashId": "c-matrix2-1",
                                    "jobControlOption": {
                                        "enable": true,
                                        "prepareTimeout": 10,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "STAGE_RUNNING",
                                        "customVariables": [],
                                        "customCondition": "",
                                        "dependOnType": "ID",
                                        "dependOnId": [],
                                        "dependOnName": "",
                                        "continueWhenFailed": false
                                    },
                                    "mutexGroup": {
                                        "enable": false,
                                        "mutexGroupName": "",
                                        "queueEnable": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "queue": 5,
                                        "linkTip": ""
                                    },
                                    "startVMStatus": "SUCCEED",
                                    "executeCount": 1,
                                    "jobId": "job_matrix2_1",
                                    "containPostTaskFlag": false,
                                    "matrixGroupFlag": false,
                                    "matrixGroupId": "matrix-2",
                                    "matrixContext": {
                                        "OS": "Windows",
                                        "NODE_VERSION": "18"
                                    },
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 8200,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 8200
                                    },
                                    "startVMTaskSeq": 1,
                                    "matrixControlOption": {
                                        "strategyStr": "",
                                        "includeCaseStr": "",
                                        "excludeCaseStr": "",
                                        "fastKill": true,
                                        "maxConcurrency": 5
                                    },
                                    "nfsSwitch": true,
                                    "classType": "vmBuild"
                                }
                            ]
                        },
                        {
                            "@type": "vmBuild",
                            "id": "matrix-3",
                            "name": "矩阵构建组3",
                            "elements": [
                                {
                                    "@type": "marketBuild",
                                    "name": "Checkout",
                                    "id": "e-matrix3-checkout",
                                    "status": "SUCCEED",
                                    "atomCode": "checkout",
                                    "version": "1.0.117",
                                    "stepId": "matrix3-checkout",
                                    "data": {
                                        "input": {
                                            "repositoryType": "ID",
                                            "repositoryHashId": "lyZj",
                                            "pullType": "BRANCH",
                                            "refName": "master"
                                        },
                                        "output": {},
                                        "namespace": ""
                                    },
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 0,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "",
                                        "otherTask": "",
                                        "customVariables": [],
                                        "customCondition": "",
                                        "enableCustomEnv": false
                                    },
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 5100,
                                    "startEpoch": 1766113520000,
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 5100,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 5100
                                    },
                                    "asyncStatus": "",
                                    "classType": "marketBuild",
                                    "autoAtomCode": "checkout",
                                    "taskAtom": ""
                                }
                            ],
                            "status": "SUCCEED",
                            "startEpoch": 1766113520000,
                            "systemElapsed": 0,
                            "elementElapsed": 5100,
                            "baseOS": "LINUX",
                            "vmNames": [],
                            "maxQueueMinutes": 60,
                            "maxRunningMinutes": 900,
                            "buildEnv": {},
                            "dispatchType": {
                                "buildType": "THIRD_PARTY_AGENT_ENV",
                                "value": "qpalgybm",
                                "workspace": "/data/devops/workspace/integration/${BK_CI_BUILD_NUM}",
                                "agentType": "ID",
                                "isEnv": true,
                                "isSingle": false
                            },
                            "showBuildResource": true,
                            "canRetry": false,
                            "enableExternal": false,
                            "containerId": "matrix-3",
                            "containerHashId": "c-matrix3-parent",
                            "jobControlOption": {
                                "enable": true,
                                "prepareTimeout": 10,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "runCondition": "STAGE_RUNNING",
                                "customVariables": [],
                                "customCondition": "",
                                "dependOnType": "ID",
                                "dependOnId": [],
                                "dependOnName": "",
                                "continueWhenFailed": false
                            },
                            "mutexGroup": {
                                "enable": false,
                                "mutexGroupName": "",
                                "queueEnable": false,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "queue": 5,
                                "linkTip": ""
                            },
                            "startVMStatus": "SUCCEED",
                            "executeCount": 1,
                            "jobId": "job_matrix3",
                            "containPostTaskFlag": false,
                            "matrixGroupFlag": true,
                            "timeCost": {
                                "systemCost": 0,
                                "executeCost": 5100,
                                "waitCost": 0,
                                "queueCost": 0,
                                "totalCost": 5100
                            },
                            "startVMTaskSeq": 1,
                            "matrixControlOption": {
                                "strategyStr": "",
                                "includeCaseStr": "",
                                "excludeCaseStr": "",
                                "fastKill": true,
                                "maxConcurrency": 5
                            },
                            "nfsSwitch": true,
                            "classType": "vmBuild",
                            "groupContainers": [
                                {
                                    "@type": "vmBuild",
                                    "id": "matrix-3-1",
                                    "name": "矩阵3-组合1 (OS: macOS, Node: 20)",
                                    "elements": [
                                        {
                                            "@type": "marketBuild",
                                            "name": "Checkout",
                                            "id": "e-matrix3-1-checkout",
                                            "status": "SUCCEED",
                                            "atomCode": "checkout",
                                            "version": "1.0.117",
                                            "stepId": "matrix3-1-checkout",
                                            "data": {
                                                "input": {
                                                    "repositoryType": "ID",
                                                    "repositoryHashId": "lyZj",
                                                    "pullType": "BRANCH",
                                                    "refName": "master"
                                                },
                                                "output": {},
                                                "namespace": ""
                                            },
                                            "additionalOptions": {
                                                "enable": true,
                                                "continueWhenFailed": false,
                                                "manualSkip": false,
                                                "retryWhenFailed": false,
                                                "retryCount": 0,
                                                "manualRetry": false,
                                                "timeout": 900,
                                                "timeoutVar": "900",
                                                "runCondition": "PRE_TASK_SUCCESS",
                                                "pauseBeforeExec": false,
                                                "subscriptionPauseUser": "",
                                                "otherTask": "",
                                                "customVariables": [],
                                                "customCondition": "",
                                                "enableCustomEnv": false
                                            },
                                            "executeCount": 1,
                                            "retryCount": 0,
                                            "retryCountManual": 0,
                                            "elapsed": 4900,
                                            "startEpoch": 1766113521000,
                                            "timeCost": {
                                                "systemCost": 0,
                                                "executeCost": 4900,
                                                "waitCost": 0,
                                                "queueCost": 0,
                                                "totalCost": 4900
                                            },
                                            "asyncStatus": "",
                                            "classType": "marketBuild",
                                            "autoAtomCode": "checkout",
                                            "taskAtom": ""
                                        },
                                        {
                                            "@type": "linuxScript",
                                            "name": "构建脚本",
                                            "id": "e-matrix3-1-build",
                                            "status": "SKIP",
                                            "scriptType": "SHELL",
                                            "script": "echo 'Building with OS: macOS, Node: 20'",
                                            "continueNoneZero": false,
                                            "enableArchiveFile": false,
                                            "archiveFile": "",
                                            "additionalOptions": {
                                                "enable": true,
                                                "continueWhenFailed": false,
                                                "manualSkip": false,
                                                "retryWhenFailed": false,
                                                "retryCount": 0,
                                                "manualRetry": false,
                                                "timeout": 900,
                                                "timeoutVar": "900",
                                                "runCondition": "PRE_TASK_SUCCESS",
                                                "pauseBeforeExec": false,
                                                "subscriptionPauseUser": "",
                                                "otherTask": "",
                                                "customVariables": [],
                                                "customCondition": "",
                                                "enableCustomEnv": false
                                            },
                                            "executeCount": 1,
                                            "canRetry": false,
                                            "retryCount": 0,
                                            "retryCountManual": 0,
                                            "elapsed": 0,
                                            "startEpoch": 1766113525900,
                                            "originVersion": "1.*",
                                            "version": "1.*",
                                            "timeCost": {
                                                "systemCost": 0,
                                                "executeCost": 0,
                                                "waitCost": 0,
                                                "queueCost": 0,
                                                "totalCost": 0
                                            },
                                            "asyncStatus": "",
                                            "classType": "linuxScript",
                                            "atomCode": "linuxScript",
                                            "taskAtom": ""
                                        }
                                    ],
                                    "status": "SUCCEED",
                                    "startEpoch": 1766113521000,
                                    "systemElapsed": 0,
                                    "elementElapsed": 4900,
                                    "baseOS": "MACOS",
                                    "vmNames": [],
                                    "maxQueueMinutes": 60,
                                    "maxRunningMinutes": 900,
                                    "buildEnv": {
                                        "OS": "macOS",
                                        "NODE_VERSION": "20"
                                    },
                                    "dispatchType": {
                                        "buildType": "THIRD_PARTY_AGENT_ENV",
                                        "value": "qpalgybm",
                                        "workspace": "/data/devops/workspace/integration/${BK_CI_BUILD_NUM}",
                                        "agentType": "ID",
                                        "isEnv": true,
                                        "isSingle": false
                                    },
                                    "showBuildResource": true,
                                    "canRetry": false,
                                    "enableExternal": false,
                                    "containerId": "matrix-3-1",
                                    "containerHashId": "c-matrix3-1",
                                    "jobControlOption": {
                                        "enable": true,
                                        "prepareTimeout": 10,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "STAGE_RUNNING",
                                        "customVariables": [],
                                        "customCondition": "",
                                        "dependOnType": "ID",
                                        "dependOnId": [],
                                        "dependOnName": "",
                                        "continueWhenFailed": false
                                    },
                                    "mutexGroup": {
                                        "enable": false,
                                        "mutexGroupName": "",
                                        "queueEnable": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "queue": 5,
                                        "linkTip": ""
                                    },
                                    "startVMStatus": "SUCCEED",
                                    "executeCount": 1,
                                    "jobId": "job_matrix3_1",
                                    "containPostTaskFlag": false,
                                    "matrixGroupFlag": false,
                                    "matrixGroupId": "matrix-3",
                                    "matrixContext": {
                                        "OS": "macOS",
                                        "NODE_VERSION": "20"
                                    },
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 4900,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 4900
                                    },
                                    "startVMTaskSeq": 1,
                                    "matrixControlOption": {
                                        "strategyStr": "",
                                        "includeCaseStr": "",
                                        "excludeCaseStr": "",
                                        "fastKill": true,
                                        "maxConcurrency": 5
                                    },
                                    "nfsSwitch": true,
                                    "classType": "vmBuild"
                                }
                            ]
                        },
                        {
                            "@type": "vmBuild",
                            "id": "matrix-4",
                            "name": "矩阵构建组4",
                            "elements": [
                                {
                                    "@type": "marketBuild",
                                    "name": "Checkout",
                                    "id": "e-matrix4-checkout",
                                    "status": "SUCCEED",
                                    "atomCode": "checkout",
                                    "version": "1.0.117",
                                    "stepId": "matrix4-checkout",
                                    "data": {
                                        "input": {
                                            "repositoryType": "ID",
                                            "repositoryHashId": "lyZj",
                                            "pullType": "BRANCH",
                                            "refName": "master"
                                        },
                                        "output": {},
                                        "namespace": ""
                                    },
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 0,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "",
                                        "otherTask": "",
                                        "customVariables": [],
                                        "customCondition": "",
                                        "enableCustomEnv": false
                                    },
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 5300,
                                    "startEpoch": 1766113530000,
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 5300,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 5300
                                    },
                                    "asyncStatus": "",
                                    "classType": "marketBuild",
                                    "autoAtomCode": "checkout",
                                    "taskAtom": ""
                                }
                            ],
                            "status": "SUCCEED",
                            "startEpoch": 1766113530000,
                            "systemElapsed": 0,
                            "elementElapsed": 5300,
                            "baseOS": "LINUX",
                            "vmNames": [],
                            "maxQueueMinutes": 60,
                            "maxRunningMinutes": 900,
                            "buildEnv": {},
                            "dispatchType": {
                                "buildType": "THIRD_PARTY_AGENT_ENV",
                                "value": "qpalgybm",
                                "workspace": "/data/devops/workspace/integration/${BK_CI_BUILD_NUM}",
                                "agentType": "ID",
                                "isEnv": true,
                                "isSingle": false
                            },
                            "showBuildResource": true,
                            "canRetry": false,
                            "enableExternal": false,
                            "containerId": "matrix-4",
                            "containerHashId": "c-matrix4-parent",
                            "jobControlOption": {
                                "enable": true,
                                "prepareTimeout": 10,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "runCondition": "STAGE_RUNNING",
                                "customVariables": [],
                                "customCondition": "",
                                "dependOnType": "ID",
                                "dependOnId": [],
                                "dependOnName": "",
                                "continueWhenFailed": false
                            },
                            "mutexGroup": {
                                "enable": false,
                                "mutexGroupName": "",
                                "queueEnable": false,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "queue": 5,
                                "linkTip": ""
                            },
                            "startVMStatus": "SUCCEED",
                            "executeCount": 1,
                            "jobId": "job_matrix4",
                            "containPostTaskFlag": false,
                            "matrixGroupFlag": true,
                            "timeCost": {
                                "systemCost": 0,
                                "executeCost": 5300,
                                "waitCost": 0,
                                "queueCost": 0,
                                "totalCost": 5300
                            },
                            "startVMTaskSeq": 1,
                            "matrixControlOption": {
                                "strategyStr": "",
                                "includeCaseStr": "",
                                "excludeCaseStr": "",
                                "fastKill": true,
                                "maxConcurrency": 5
                            },
                            "nfsSwitch": true,
                            "classType": "vmBuild",
                            "groupContainers": [
                                {
                                    "@type": "vmBuild",
                                    "id": "matrix-4-1",
                                    "name": "矩阵4-组合1 (OS: Ubuntu, Node: 22)",
                                    "elements": [
                                        {
                                            "@type": "marketBuild",
                                            "name": "Checkout",
                                            "id": "e-matrix4-1-checkout",
                                            "status": "SUCCEED",
                                            "atomCode": "checkout",
                                            "version": "1.0.117",
                                            "stepId": "matrix4-1-checkout",
                                            "data": {
                                                "input": {
                                                    "repositoryType": "ID",
                                                    "repositoryHashId": "lyZj",
                                                    "pullType": "BRANCH",
                                                    "refName": "master"
                                                },
                                                "output": {},
                                                "namespace": ""
                                            },
                                            "additionalOptions": {
                                                "enable": true,
                                                "continueWhenFailed": false,
                                                "manualSkip": false,
                                                "retryWhenFailed": false,
                                                "retryCount": 0,
                                                "manualRetry": false,
                                                "timeout": 900,
                                                "timeoutVar": "900",
                                                "runCondition": "PRE_TASK_SUCCESS",
                                                "pauseBeforeExec": false,
                                                "subscriptionPauseUser": "",
                                                "otherTask": "",
                                                "customVariables": [],
                                                "customCondition": "",
                                                "enableCustomEnv": false
                                            },
                                            "executeCount": 1,
                                            "retryCount": 0,
                                            "retryCountManual": 0,
                                            "elapsed": 5100,
                                            "startEpoch": 1766113531000,
                                            "timeCost": {
                                                "systemCost": 0,
                                                "executeCost": 5100,
                                                "waitCost": 0,
                                                "queueCost": 0,
                                                "totalCost": 5100
                                            },
                                            "asyncStatus": "",
                                            "classType": "marketBuild",
                                            "autoAtomCode": "checkout",
                                            "taskAtom": ""
                                        },
                                        {
                                            "@type": "linuxScript",
                                            "name": "构建脚本",
                                            "id": "e-matrix4-1-build",
                                            "status": "SUCCEED",
                                            "scriptType": "SHELL",
                                            "script": "echo 'Building with OS: Ubuntu, Node: 22'",
                                            "continueNoneZero": false,
                                            "enableArchiveFile": false,
                                            "archiveFile": "",
                                            "additionalOptions": {
                                                "enable": true,
                                                "continueWhenFailed": false,
                                                "manualSkip": false,
                                                "retryWhenFailed": false,
                                                "retryCount": 0,
                                                "manualRetry": false,
                                                "timeout": 900,
                                                "timeoutVar": "900",
                                                "runCondition": "PRE_TASK_SUCCESS",
                                                "pauseBeforeExec": false,
                                                "subscriptionPauseUser": "",
                                                "otherTask": "",
                                                "customVariables": [],
                                                "customCondition": "",
                                                "enableCustomEnv": false
                                            },
                                            "executeCount": 1,
                                            "canRetry": false,
                                            "retryCount": 0,
                                            "retryCountManual": 0,
                                            "elapsed": 3100,
                                            "startEpoch": 1766113536100,
                                            "originVersion": "1.*",
                                            "version": "1.*",
                                            "timeCost": {
                                                "systemCost": 0,
                                                "executeCost": 3100,
                                                "waitCost": 0,
                                                "queueCost": 0,
                                                "totalCost": 3100
                                            },
                                            "asyncStatus": "",
                                            "classType": "linuxScript",
                                            "atomCode": "linuxScript",
                                            "taskAtom": ""
                                        }
                                    ],
                                    "status": "SUCCEED",
                                    "startEpoch": 1766113531000,
                                    "systemElapsed": 0,
                                    "elementElapsed": 8200,
                                    "baseOS": "LINUX",
                                    "vmNames": [],
                                    "maxQueueMinutes": 60,
                                    "maxRunningMinutes": 900,
                                    "buildEnv": {
                                        "OS": "Ubuntu",
                                        "NODE_VERSION": "22"
                                    },
                                    "dispatchType": {
                                        "buildType": "THIRD_PARTY_AGENT_ENV",
                                        "value": "qpalgybm",
                                        "workspace": "/data/devops/workspace/integration/${BK_CI_BUILD_NUM}",
                                        "agentType": "ID",
                                        "isEnv": true,
                                        "isSingle": false
                                    },
                                    "showBuildResource": true,
                                    "canRetry": false,
                                    "enableExternal": false,
                                    "containerId": "matrix-4-1",
                                    "containerHashId": "c-matrix4-1",
                                    "jobControlOption": {
                                        "enable": true,
                                        "prepareTimeout": 10,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "STAGE_RUNNING",
                                        "customVariables": [],
                                        "customCondition": "",
                                        "dependOnType": "ID",
                                        "dependOnId": [],
                                        "dependOnName": "",
                                        "continueWhenFailed": false
                                    },
                                    "mutexGroup": {
                                        "enable": false,
                                        "mutexGroupName": "",
                                        "queueEnable": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "queue": 5,
                                        "linkTip": ""
                                    },
                                    "startVMStatus": "SUCCEED",
                                    "executeCount": 1,
                                    "jobId": "job_matrix4_1",
                                    "containPostTaskFlag": false,
                                    "matrixGroupFlag": false,
                                    "matrixGroupId": "matrix-4",
                                    "matrixContext": {
                                        "OS": "Ubuntu",
                                        "NODE_VERSION": "22"
                                    },
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 8200,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 8200
                                    },
                                    "startVMTaskSeq": 1,
                                    "matrixControlOption": {
                                        "strategyStr": "",
                                        "includeCaseStr": "",
                                        "excludeCaseStr": "",
                                        "fastKill": true,
                                        "maxConcurrency": 5
                                    },
                                    "nfsSwitch": true,
                                    "classType": "vmBuild"
                                }
                            ]
                        },
                        {
                            "@type": "vmBuild",
                            "id": "matrix-5",
                            "name": "矩阵构建组5",
                            "elements": [
                                {
                                    "@type": "marketBuild",
                                    "name": "Checkout",
                                    "id": "e-matrix5-checkout",
                                    "status": "SUCCEED",
                                    "atomCode": "checkout",
                                    "version": "1.0.117",
                                    "stepId": "matrix5-checkout",
                                    "data": {
                                        "input": {
                                            "repositoryType": "ID",
                                            "repositoryHashId": "lyZj",
                                            "pullType": "BRANCH",
                                            "refName": "master"
                                        },
                                        "output": {},
                                        "namespace": ""
                                    },
                                    "additionalOptions": {
                                        "enable": true,
                                        "continueWhenFailed": false,
                                        "manualSkip": false,
                                        "retryWhenFailed": false,
                                        "retryCount": 0,
                                        "manualRetry": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "PRE_TASK_SUCCESS",
                                        "pauseBeforeExec": false,
                                        "subscriptionPauseUser": "",
                                        "otherTask": "",
                                        "customVariables": [],
                                        "customCondition": "",
                                        "enableCustomEnv": false
                                    },
                                    "executeCount": 1,
                                    "retryCount": 0,
                                    "retryCountManual": 0,
                                    "elapsed": 5400,
                                    "startEpoch": 1766113540000,
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 5400,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 5400
                                    },
                                    "asyncStatus": "",
                                    "classType": "marketBuild",
                                    "autoAtomCode": "checkout",
                                    "taskAtom": ""
                                }
                            ],
                            "status": "SUCCEED",
                            "startEpoch": 1766113540000,
                            "systemElapsed": 0,
                            "elementElapsed": 5400,
                            "baseOS": "LINUX",
                            "vmNames": [],
                            "maxQueueMinutes": 60,
                            "maxRunningMinutes": 900,
                            "buildEnv": {},
                            "dispatchType": {
                                "buildType": "THIRD_PARTY_AGENT_ENV",
                                "value": "qpalgybm",
                                "workspace": "/data/devops/workspace/integration/${BK_CI_BUILD_NUM}",
                                "agentType": "ID",
                                "isEnv": true,
                                "isSingle": false
                            },
                            "showBuildResource": true,
                            "canRetry": false,
                            "enableExternal": false,
                            "containerId": "matrix-5",
                            "containerHashId": "c-matrix5-parent",
                            "jobControlOption": {
                                "enable": true,
                                "prepareTimeout": 10,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "runCondition": "STAGE_RUNNING",
                                "customVariables": [],
                                "customCondition": "",
                                "dependOnType": "ID",
                                "dependOnId": [],
                                "dependOnName": "",
                                "continueWhenFailed": false
                            },
                            "mutexGroup": {
                                "enable": false,
                                "mutexGroupName": "",
                                "queueEnable": false,
                                "timeout": 900,
                                "timeoutVar": "900",
                                "queue": 5,
                                "linkTip": ""
                            },
                            "startVMStatus": "SUCCEED",
                            "executeCount": 1,
                            "jobId": "job_matrix5",
                            "containPostTaskFlag": false,
                            "matrixGroupFlag": true,
                            "timeCost": {
                                "systemCost": 0,
                                "executeCost": 5400,
                                "waitCost": 0,
                                "queueCost": 0,
                                "totalCost": 5400
                            },
                            "startVMTaskSeq": 1,
                            "matrixControlOption": {
                                "strategyStr": "",
                                "includeCaseStr": "",
                                "excludeCaseStr": "",
                                "fastKill": true,
                                "maxConcurrency": 5
                            },
                            "nfsSwitch": true,
                            "classType": "vmBuild",
                            "groupContainers": [
                                {
                                    "@type": "vmBuild",
                                    "id": "matrix-5-1",
                                    "name": "矩阵5-组合1 (OS: CentOS, Node: 12)",
                                    "elements": [
                                        {
                                            "@type": "marketBuild",
                                            "name": "Checkout",
                                            "id": "e-matrix5-1-checkout",
                                            "status": "SUCCEED",
                                            "atomCode": "checkout",
                                            "version": "1.0.117",
                                            "stepId": "matrix5-1-checkout",
                                            "data": {
                                                "input": {
                                                    "repositoryType": "ID",
                                                    "repositoryHashId": "lyZj",
                                                    "pullType": "BRANCH",
                                                    "refName": "master"
                                                },
                                                "output": {},
                                                "namespace": ""
                                            },
                                            "additionalOptions": {
                                                "enable": true,
                                                "continueWhenFailed": false,
                                                "manualSkip": false,
                                                "retryWhenFailed": false,
                                                "retryCount": 0,
                                                "manualRetry": false,
                                                "timeout": 900,
                                                "timeoutVar": "900",
                                                "runCondition": "PRE_TASK_SUCCESS",
                                                "pauseBeforeExec": false,
                                                "subscriptionPauseUser": "",
                                                "otherTask": "",
                                                "customVariables": [],
                                                "customCondition": "",
                                                "enableCustomEnv": false
                                            },
                                            "executeCount": 1,
                                            "retryCount": 0,
                                            "retryCountManual": 0,
                                            "elapsed": 5200,
                                            "startEpoch": 1766113541000,
                                            "timeCost": {
                                                "systemCost": 0,
                                                "executeCost": 5200,
                                                "waitCost": 0,
                                                "queueCost": 0,
                                                "totalCost": 5200
                                            },
                                            "asyncStatus": "",
                                            "classType": "marketBuild",
                                            "autoAtomCode": "checkout",
                                            "taskAtom": ""
                                        },
                                        {
                                            "@type": "linuxScript",
                                            "name": "构建脚本",
                                            "id": "e-matrix5-1-build",
                                            "status": "SKIP",
                                            "scriptType": "SHELL",
                                            "script": "echo 'Building with OS: CentOS, Node: 12'",
                                            "continueNoneZero": false,
                                            "enableArchiveFile": false,
                                            "archiveFile": "",
                                            "additionalOptions": {
                                                "enable": true,
                                                "continueWhenFailed": false,
                                                "manualSkip": false,
                                                "retryWhenFailed": false,
                                                "retryCount": 0,
                                                "manualRetry": false,
                                                "timeout": 900,
                                                "timeoutVar": "900",
                                                "runCondition": "PRE_TASK_SUCCESS",
                                                "pauseBeforeExec": false,
                                                "subscriptionPauseUser": "",
                                                "otherTask": "",
                                                "customVariables": [],
                                                "customCondition": "",
                                                "enableCustomEnv": false
                                            },
                                            "executeCount": 1,
                                            "canRetry": false,
                                            "retryCount": 0,
                                            "retryCountManual": 0,
                                            "elapsed": 0,
                                            "startEpoch": 1766113546200,
                                            "originVersion": "1.*",
                                            "version": "1.*",
                                            "timeCost": {
                                                "systemCost": 0,
                                                "executeCost": 0,
                                                "waitCost": 0,
                                                "queueCost": 0,
                                                "totalCost": 0
                                            },
                                            "asyncStatus": "",
                                            "classType": "linuxScript",
                                            "atomCode": "linuxScript",
                                            "taskAtom": ""
                                        }
                                    ],
                                    "status": "SUCCEED",
                                    "startEpoch": 1766113541000,
                                    "systemElapsed": 0,
                                    "elementElapsed": 5200,
                                    "baseOS": "LINUX",
                                    "vmNames": [],
                                    "maxQueueMinutes": 60,
                                    "maxRunningMinutes": 900,
                                    "buildEnv": {
                                        "OS": "CentOS",
                                        "NODE_VERSION": "12"
                                    },
                                    "dispatchType": {
                                        "buildType": "THIRD_PARTY_AGENT_ENV",
                                        "value": "qpalgybm",
                                        "workspace": "/data/devops/workspace/integration/${BK_CI_BUILD_NUM}",
                                        "agentType": "ID",
                                        "isEnv": true,
                                        "isSingle": false
                                    },
                                    "showBuildResource": true,
                                    "canRetry": false,
                                    "enableExternal": false,
                                    "containerId": "matrix-5-1",
                                    "containerHashId": "c-matrix5-1",
                                    "jobControlOption": {
                                        "enable": true,
                                        "prepareTimeout": 10,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "runCondition": "STAGE_RUNNING",
                                        "customVariables": [],
                                        "customCondition": "",
                                        "dependOnType": "ID",
                                        "dependOnId": [],
                                        "dependOnName": "",
                                        "continueWhenFailed": false
                                    },
                                    "mutexGroup": {
                                        "enable": false,
                                        "mutexGroupName": "",
                                        "queueEnable": false,
                                        "timeout": 900,
                                        "timeoutVar": "900",
                                        "queue": 5,
                                        "linkTip": ""
                                    },
                                    "startVMStatus": "SUCCEED",
                                    "executeCount": 1,
                                    "jobId": "job_matrix5_1",
                                    "containPostTaskFlag": false,
                                    "matrixGroupFlag": false,
                                    "matrixGroupId": "matrix-5",
                                    "matrixContext": {
                                        "OS": "CentOS",
                                        "NODE_VERSION": "12"
                                    },
                                    "timeCost": {
                                        "systemCost": 0,
                                        "executeCost": 5200,
                                        "waitCost": 0,
                                        "queueCost": 0,
                                        "totalCost": 5200
                                    },
                                    "startVMTaskSeq": 1,
                                    "matrixControlOption": {
                                        "strategyStr": "",
                                        "includeCaseStr": "",
                                        "excludeCaseStr": "",
                                        "fastKill": true,
                                        "maxConcurrency": 5
                                    },
                                    "nfsSwitch": true,
                                    "classType": "vmBuild"
                                }
                            ]
                        }
                    ],
                    "id": "stage-4",
                    "name": "矩阵构建阶段",
                    "tag": [
                        "28ee946a59f64949a74f3dee40a1bda4"
                    ],
                    "status": "SUCCEED",
                    "startEpoch": 1766113500000,
                    "elapsed": 50000,
                    "fastKill": false,
                    "finally": false,
                    "canRetry": false,
                    "stageControlOption": {
                        "enable": true,
                        "runCondition": "AFTER_LAST_FINISHED",
                        "customVariables": [],
                        "customCondition": "",
                        "manualTrigger": false,
                        "triggerUsers": [],
                        "timeout": 24
                    },
                    "executeCount": 1,
                    "timeCost": {
                        "systemCost": 0,
                        "executeCost": 50000,
                        "waitCost": 0,
                        "queueCost": 0,
                        "totalCost": 50000
                    }
                }
            ],
            "labels": [],
            "instanceFromTemplate": false,
            "pipelineCreator": "ddlin",
            "events": {},
            "staticViews": [],
            "timeCost": {
                "systemCost": 14272,
                "executeCost": 282672,
                "waitCost": 910,
                "queueCost": 375,
                "totalCost": 298764
            },
            "overrideTemplateField": {},
            "latestVersion": 196
        },
        currentTimestamp: Date.now(),
        buildNum: 3,
        curVersion: 4,
        curVersionName: 'V2(P2.T2.2)',
        latestVersion: 4,
        latestBuildNum: 3,
        lastModifyUser: 'zhangsan',
        executeTime: 66750,
        stageStatus: [
          {
            stageId: 'stage-1',
            name: '构建触发',
            status: STATUS.SUCCEED,
            startEpoch: baseTime + 1485,
            elapsed: 507,
          },
          {
            stageId: 'stage-2',
            name: '代码检查与构建',
            status: STATUS.SUCCEED,
            startEpoch: baseTime + 5000,
            elapsed: 18774,
          },
          {
            stageId: 'stage-3',
            name: '多环境构建',
            status: STATUS.SUCCEED,
            startEpoch: baseTime + 45000,
            elapsed: 50700,
          },
          {
            stageId: 'stage-4',
            name: '矩阵构建阶段',
            status: STATUS.SUCCEED,
            startEpoch: baseTime + 100000,
            elapsed: 50000,
          },
          {
            stageId: 'stage-5',
            name: '质量检查',
            status: STATUS.SUCCEED,
            startEpoch: baseTime + 150000,
            elapsed: 24900,
          },
          {
            stageId: 'stage-6',
            name: '部署',
            status: STATUS.SUCCEED,
            startEpoch: baseTime + 175000,
            elapsed: 16000,
          },
          {
            stageId: 'stage-7',
            name: '清理和通知',
            status: STATUS.SUCCEED,
            startEpoch: baseTime + 195000,
            elapsed: 8800,
          },
        ],
        executeCount: 3,
        startUserList: ['zhangsan', 'lisi', 'wangwu'],
        recordList: [
          {
            startUser: 'zhangsan',
            timeCost: {
              systemCost: 155524,
              executeCost: 66750,
              waitCost: 1132,
              queueCost: 1485,
              totalCost: 224891,
            },
          },
          {
            startUser: 'lisi',
            timeCost: {
              systemCost: 148000,
              executeCost: 65000,
              waitCost: 1050,
              queueCost: 1400,
              totalCost: 215450,
            },
          },
          {
            startUser: 'wangwu',
            timeCost: {
              systemCost: 142000,
              executeCost: 63000,
              waitCost: 980,
              queueCost: 1200,
              totalCost: 207180,
            },
          },
        ],
        buildMsg: '手动触发 - 复杂编排流程测试',
        debug: false,
        versionChange: false,
        cancelBuildPerm: true,
        remark: '这是一个包含多个阶段、矩阵容器和并行任务的复杂编排流程示例',
        material: [
          {
            scmType: 'CODE_GIT',
            aliasName: 'bkdevops/ci-flow',
            url: 'http://git.woa.com/bkdevops/ci-flow.git',
            branchName: 'master',
            newCommitId: '21fe7ff0cf16b2cd44b5b8a6d0e52a1c27c7dc94',
            commitTimes: 1,
            mainRepo: true,
            createTime: 1755655572,
          },
          {
            scmType: 'CODE_GIT',
            aliasName: 'bkdevops/plugins',
            url: 'http://git.woa.com/bkdevops/plugins.git',
            branchName: 'develop',
            newCommitId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
            commitTimes: 1,
            mainRepo: false,
            createTime: 1755655603,
          },
        ],
        artifactQuality: {
          BK_CI_SIGNATURE: [
            {
              labelKey: 'BK_CI_SIGNATURE',
              value: 'IN_HOUSE',
              color: '#E1EBFF',
              count: 1,
            },
          ],
          AutoTest: [
            {
              labelKey: 'AutoTest',
              value: 'Pass',
              color: '#2CAF5E',
              count: 3,
            },
          ],
          CodeCoverage: [
            {
              labelKey: 'CodeCoverage',
              value: '85%',
              color: '#2CAF5E',
              count: 1,
            },
          ],
        },
        webhookInfo: {
          codeType: 'GIT',
          nameWithNamespace: 'silverye/stream_server',
          webhookRepoUrl: 'http://git.woa.com/silverye/stream_server.git',
          webhookBranch: 'dev_silver',
          webhookAliasName: 'silverye/stream_server',
          webhookType: 'GIT',
          webhookEventType: 'MERGE_REQUEST',
          webhookMessage: 'add redis clear',
          webhookCommitId: '0534f52fb98459e235cb832703817751ea9783b0',
          refId: '0534f52fb98459e235cb832703817751ea9783b0',
          webhookMergeCommitSha: '',
          webhookSourceBranch: 'feat/add_redis_clear',
          mrId: '22646451',
          mrIid: '192',
          mrUrl: 'http://git.woa.com/silverye/stream_server/merge_requests/192',
          repoAuthUser: 'silverye',
          reviewId: '113357206',
          linkUrl: 'http://git.woa.com/silverye/stream_server/merge_requests/192',
        },
        errorInfoList: [
          {
            errorType: 1,
            errorCode: 'BUILD_FAILED',
            errorMsg: '单元测试执行失败，请检查测试用例',
            taskName: '单元测试',
            stageId: 'stage-2',
            containerId: '1',
            taskId: 'e-test-001',
            matrixFlag: false,
          },
          {
            errorType: 2,
            errorCode: 'TIMEOUT',
            errorMsg: '健康检查超时，服务可能未正常启动',
            taskName: '健康检查',
            stageId: 'stage-5',
            containerId: '5',
            taskId: 'e-health-check-001',
            matrixFlag: false,
          },
        ],
      })
    }, 1000)
  })
}

/**
 * 终止创作流执行
 * @param projectId 项目ID
 * @param flowId 创作流ID
 * @param buildId 构建ID
 * @returns 是否成功终止
 */
export function requestTerminatePipeline({
  projectId,
  flowId,
  buildId,
}: {
  projectId: string
  flowId: string
  buildId: string
}): Promise<boolean> {
  // TODO: 调用实际接口
  // return http.post(`/user/builds/projects/${projectId}/${flowId}/${buildId}`)
  //   .then(res => res.data)

  // Mock 数据
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟成功终止
      resolve(true)
    }, 500)
  })
}

/**
 * 重试创作流
 */
export function retryFlow({
  projectId,
  flowId,
  buildId,
}: {
  projectId: string
  flowId: string
  buildId: string
}): Promise<RetryPipelineResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'b-d8311316d4a04e349f48102f9553b568',
        executeCount: 3,
        projectId: 'default-project',
        pipelineId: 'p-fc1ba8afdea34eed8a95e668879f4115',
        num: 3,
      })
    }, 500)
  })
}

/**
 * 重放创作流
 */
export function replayFlow({
  projectId,
  flowId,
  buildId,
}: {
  projectId: string
  flowId: string
  buildId: string
}): Promise<ReplayPipelineResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'b-d8311316d4a04e349f48102f9553b568',
        status: 'REPLAYING',
      })
    }, 500)
  })
}

/**
 * 获取启动参数值
 */
export function requestBuildParams({
  projectId,
  pipelineId,
  buildId,
}: {
  projectId: string
  pipelineId: string
  buildId: string
}): Promise<BuildParamItem[]> {
  // TODO: 接入真实接口：return get<BuildParamItem[]>(`/user/builds/${projectId}/${pipelineId}/${buildId}/parameters`, { params })
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          key: 'gdsag',
          value: 'gdsags',
          valueType: 'STRING',
          readOnly: false,
          desc: 'gas',
          defaultValue: 'gdsags',
        },
        {
          key: 'wenjian',
          value: '/TestFile/task.json',
          valueType: 'CUSTOM_FILE',
          readOnly: false,
          desc: '',
          defaultValue: '/TestFile/task.json',
        },
        {
          key: 'jiaoben',
          value:
            '# 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell  # 旧的${}引用变量的方式已升级为${{}}，和bash原生引用变量的方式区分开  # 通过::set-variable命令字设置/修改全局变量 # echo "::set-variable name=<var_name>::<value>" # 在后续的插件表单中使用表达式${{variables.<var_name>}}引用这个变量 # 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用  # 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖) # echo "::set-output name=<output_name>::<value>" # 在后续的插件表单中使用表达式${{jobs.<job_id>.steps.<step_id>.outputs.<output_name>}}引用这个输出，其中job_id和step_id在对应的Job和Task上配置  # 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值 # setGateValue "CodeCoverage" $myValue # 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住  # cd $WORKSPACE 可进入当前工作空间目录',
          valueType: 'TEXTAREA',
          readOnly: false,
          desc: '',
          defaultValue:
            '# 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell  # 旧的${}引用变量的方式已升级为${{}}，和bash原生引用变量的方式区分开  # 通过::set-variable命令字设置/修改全局变量 # echo "::set-variable name=<var_name>::<value>" # 在后续的插件表单中使用表达式${{variables.<var_name>}}引用这个变量 # 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用  # 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖) # echo "::set-output name=<output_name>::<value>" # 在后续的插件表单中使用表达式${{jobs.<job_id>.steps.<step_id>.outputs.<output_name>}}引用这个输出，其中job_id和step_id在对应的Job和Task上配置  # 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值 # setGateValue "CodeCoverage" $myValue # 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住  # cd $WORKSPACE 可进入当前工作空间目录',
        },
        {
          key: 'FDDSA',
          value: 'FDSA',
          valueType: 'STRING',
          readOnly: false,
          desc: '65465',
          defaultValue: 'FDSA',
        },
        {
          key: 'GDFfds',
          value: 'gdsagdsadsagdsg',
          valueType: 'STRING',
          readOnly: true,
          desc: '',
          defaultValue: 'gdsagdsadsagdsg',
        },
        {
          key: 'gadsgdahhhh',
          value: 'gdsa',
          valueType: 'STRING',
          readOnly: true,
          desc: '',
          defaultValue: 'gdsa',
        },
      ])
    }, 300)
  })
}

/**
 * 获取启动参数组合
 */
export function requestBuildParamCombination({
  projectId,
  pipelineId,
  buildId,
}: {
  projectId: string
  pipelineId: string
  buildId: string
}): Promise<BuildParamProperty[]> {
  // TODO: 接入真实接口
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'gdsag',
          name: 'gdsag',
          required: false,
          constant: false,
          type: 'STRING',
          defaultValue: 'gdsags',
          value: 'gdsags',
          desc: 'gas',
          readOnly: false,
          valueNotEmpty: false,
          removeFlag: false,
        },
        {
          id: 'wenjian',
          name: 'wenjian',
          required: false,
          constant: false,
          type: 'CUSTOM_FILE',
          defaultValue: '/TestFile/task.json',
          value: '/TestFile/task.json',
          desc: '',
          readOnly: false,
          valueNotEmpty: false,
          removeFlag: false,
        },
        {
          id: 'jiaoben',
          name: 'jiaoben',
          required: true,
          constant: false,
          type: 'TEXTAREA',
          defaultValue:
            '# 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell  # 旧的${}引用变量的方式已升级为${{}}，和bash原生引用变量的方式区分开  # 通过::set-variable命令字设置/修改全局变量 # echo "::set-variable name=<var_name>::<value>" # 在后续的插件表单中使用表达式${{variables.<var_name>}}引用这个变量 # 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用  # 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖) # echo "::set-output name=<output_name>::<value>" # 在后续的插件表单中使用表达式${{jobs.<job_id>.steps.<step_id>.outputs.<output_name>}}引用这个输出，其中job_id和step_id在对应的Job和Task上配置  # 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值 # setGateValue "CodeCoverage" $myValue # 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住  # cd $WORKSPACE 可进入当前工作空间目录',
          value:
            '# 通过./xxx.sh的方式执行脚本. 即若脚本中未指定解释器，则使用系统默认的shell  # 旧的${}引用变量的方式已升级为${{}}，和bash原生引用变量的方式区分开  # 通过::set-variable命令字设置/修改全局变量 # echo "::set-variable name=<var_name>::<value>" # 在后续的插件表单中使用表达式${{variables.<var_name>}}引用这个变量 # 注意：旧的通过setEnv设置变量的方式仍然保留，但存在一些历史问题，已停止迭代，不再推荐使用  # 通过::set-output命令字设置当前步骤的输出(变量隔离，不会被覆盖) # echo "::set-output name=<output_name>::<value>" # 在后续的插件表单中使用表达式${{jobs.<job_id>.steps.<step_id>.outputs.<output_name>}}引用这个输出，其中job_id和step_id在对应的Job和Task上配置  # 在质量红线中创建自定义指标后，通过setGateValue函数设置指标值 # setGateValue "CodeCoverage" $myValue # 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住  # cd $WORKSPACE 可进入当前工作空间目录',
          desc: '',
          readOnly: false,
          valueNotEmpty: true,
          removeFlag: false,
        },
        {
          id: 'FDDSA',
          name: 'FDSA',
          required: false,
          constant: true,
          type: 'STRING',
          defaultValue: 'FDSA',
          desc: '65465',
          readOnly: false,
          valueNotEmpty: false,
          removeFlag: false,
        },
        {
          id: 'GDFfds',
          name: '运行时只读运行时只读',
          required: true,
          constant: false,
          type: 'STRING',
          defaultValue: 'gdsagdsadsagdsg',
          value: 'gdsagdsadsagdsg',
          desc: '',
          readOnly: true,
          valueNotEmpty: false,
          removeFlag: false,
        },
        {
          id: 'gadsgdahhhh',
          name: '运行时只读',
          required: false,
          constant: false,
          type: 'STRING',
          defaultValue: 'gdsa',
          desc: '',
          readOnly: true,
          valueNotEmpty: false,
          removeFlag: false,
        },
      ])
    }, 300)
  })
}
