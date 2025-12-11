import {
  BuildCancelPolicy,
  RunLockType,
  type ExecuteDetailData,
  type FlowPermissions,
  type VersionStatus,
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
 * 获取执行历史详情数据
 * @param projectId 项目ID
 * @param buildNo 构建编号
 * @param flowId 流水线ID
 * @returns 执行详情数据
 */
export function requestPipelineExecDetail({
  projectId,
  buildNo,
  flowId,
}: {
  projectId: string
  buildNo: string
  flowId: string
}): Promise<ExecuteDetailData> {
  // TODO: 调用实际接口
  // return http.get(`/user/builds/projects/${projectId}/pipelines/${flowId}/builds/${buildNo}/record`)

  // Mock 数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'b-d8311316d4a04e349f48102f9553b568',
        pipelineId: 'p-fc1ba8afdea34eed8a95e668879f4115',
        pipelineName: '归档测试111',
        userId: 'zhangsan',
        triggerUser: 'zhangsan',
        trigger: '手动',
        queueTime: 1764838906410,
        startTime: 1764838907895,
        queueTimeCost: 1485,
        endTime: 1764838924876,
        status: 'SUCCEED',
        model: {
          '@type': 'Model',
          name: '归档测试111',
          desc: '',
          stages: [
            {
              containers: [
                {
                  '@type': 'trigger',
                  id: '0',
                  name: '构建触发',
                  elements: [
                    {
                      '@type': 'manualTrigger',
                      name: '手动触发',
                      id: 'T-1-1-1',
                      status: 'SUCCEED',
                      canElementSkip: false,
                      useLatestParameters: false,
                      executeCount: 3,
                      version: '1.*',
                      additionalOptions: {
                        enable: true,
                        continueWhenFailed: false,
                        retryWhenFailed: false,
                        retryCount: 0,
                        manualRetry: true,
                        timeout: 100,
                        timeoutVar: '100',
                        pauseBeforeExec: false,
                        subscriptionPauseUser: '',
                        customCondition: '',
                        enableCustomEnv: true,
                      },
                      asyncStatus: '',
                      classType: 'manualTrigger',
                      atomCode: 'manualTrigger',
                      taskAtom: '',
                    },
                    {
                      '@type': 'codeGitWebHookTrigger',
                      name: 'Git事件触发',
                      id: 'e-eafe4fd194dc4bf5b485a3e9c577c24b',
                      status: '',
                      pathFilterType: 'NamePrefixFilter',
                      eventType: 'PUSH',
                      repositoryType: 'NAME',
                      repositoryName: 'bkdevops-devx-dev/qqq4',
                      webhookQueue: false,
                      enableCheck: true,
                      includePushAction: ['push-file', 'new-branch'],
                      enableThirdFilter: false,
                      skipWip: false,
                      executeCount: 3,
                      version: '2.*',
                      additionalOptions: {
                        enable: true,
                        continueWhenFailed: false,
                        retryWhenFailed: false,
                        retryCount: 0,
                        manualRetry: true,
                        timeout: 100,
                        timeoutVar: '100',
                        runCondition: 'PRE_TASK_SUCCESS',
                        pauseBeforeExec: false,
                        subscriptionPauseUser: '',
                        customCondition: '',
                        enableCustomEnv: true,
                      },
                      asyncStatus: '',
                      classType: 'codeGitWebHookTrigger',
                      atomCode: 'codeGitWebHookTrigger',
                      taskAtom: '',
                    },
                  ],
                  status: 'SUCCEED',
                  startEpoch: 1764838907801,
                  systemElapsed: 1801,
                  elementElapsed: 0,
                  params: [],
                  canRetry: false,
                  containerId: '0',
                  containerHashId: 'c-a7a19916c56044d592280fbb31e081c5',
                  startVMStatus: 'SUCCEED',
                  executeCount: 3,
                  containPostTaskFlag: false,
                  matrixGroupFlag: false,
                  timeCost: {
                    systemCost: 0,
                    executeCost: 0,
                    waitCost: 0,
                    queueCost: 0,
                    totalCost: 0,
                  },
                  classType: 'trigger',
                },
              ],
              id: 'stage-1',
              name: 'stage-1',
              status: 'SUCCEED',
              elapsed: 507,
              fastKill: false,
              finally: false,
              canRetry: false,
              executeCount: 1,
              timeCost: {
                systemCost: 0,
                executeCost: 0,
                waitCost: 887,
                queueCost: 887,
                totalCost: 887,
              },
            },
            {
              containers: [
                {
                  '@type': 'vmBuild',
                  id: '1',
                  name: '构建环境-Linux',
                  elements: [
                    {
                      '@type': 'linuxScript',
                      name: 'Bash',
                      id: 'e-a83f43ab501c4110b41e17edef8b264f',
                      status: 'SUCCEED',
                      scriptType: 'SHELL',
                      script:
                        '# 通过./xx.sh的方式调起指定，可通过手动添加shebang的方式指定解释器\n# 您可以通过setEnv函数设置插件间传递的参数\n# setEnv "FILENAME" "package.zip"\n# 然后在后续的插件的表单中使用${FILENAME}引用这个变量\n\n# 您可以在质量红线中创建自定义指标，然后通过setGateValue函数设置指标值\n# setGateValue "CodeCoverage" $myValue\n# 然后在质量红线选择相应指标和阈值。若不满足，流水线在执行时将会被卡住\n\n# cd ${WORKSPACE} 可进入当前工作空间目录',
                      continueNoneZero: false,
                      enableArchiveFile: false,
                      additionalOptions: {
                        enable: true,
                        continueWhenFailed: false,
                        manualSkip: false,
                        retryWhenFailed: false,
                        retryCount: 0,
                        manualRetry: false,
                        timeout: 900,
                        timeoutVar: '900',
                        runCondition: 'PRE_TASK_SUCCESS',
                        pauseBeforeExec: false,
                        subscriptionPauseUser: 'zhangsan',
                        customCondition: '',
                        enableCustomEnv: true,
                      },
                      executeCount: 3,
                      retryCount: 2,
                      retryCountManual: 2,
                      elapsed: 651,
                      startEpoch: 1764838920157,
                      version: '1.*',
                      timeCost: {
                        systemCost: 0,
                        executeCost: 651,
                        waitCost: 0,
                        queueCost: 0,
                        totalCost: 651,
                      },
                      asyncStatus: '',
                      classType: 'linuxScript',
                      atomCode: 'linuxScript',
                      taskAtom: '',
                    },
                  ],
                  status: 'SUCCEED',
                  startEpoch: 1764838919287,
                  systemElapsed: 14324,
                  elementElapsed: 651,
                  baseOS: 'LINUX',
                  vmNames: [],
                  maxQueueMinutes: 60,
                  maxRunningMinutes: 900,
                  dispatchType: {
                    buildType: 'PUBLIC_DEVCLOUD',
                    value: 'tlinux_ci',
                    performanceConfigId: '0',
                    performanceUid: '',
                    persistence: false,
                    imageType: 'BKSTORE',
                    credentialId: '',
                    credentialProject: '',
                    imageCode: 'tlinux_ci',
                    imageVersion: '3.1.1',
                    imageName: 'tlinux_ci',
                    dockerBuildVersion: 'tlinux_ci',
                    imagePublicFlag: false,
                    imageRDType: '',
                    recommendFlag: true,
                  },
                  showBuildResource: false,
                  canRetry: false,
                  enableExternal: false,
                  containerId: '1',
                  containerHashId: 'c-2ab434d7271d48caa652e7e428212ba3',
                  jobControlOption: {
                    enable: true,
                    prepareTimeout: 10,
                    timeout: 900,
                    timeoutVar: '900',
                    runCondition: 'STAGE_RUNNING',
                    customVariables: [],
                    dependOnType: 'NAME',
                    continueWhenFailed: false,
                  },
                  startVMStatus: 'SUCCEED',
                  executeCount: 3,
                  jobId: 'job_FRn',
                  containPostTaskFlag: false,
                  matrixGroupFlag: false,
                  timeCost: {
                    systemCost: 14324,
                    executeCost: 652,
                    waitCost: 0,
                    queueCost: 0,
                    totalCost: 14976,
                  },
                  startVMTaskSeq: 1,
                  nfsSwitch: false,
                  classType: 'vmBuild',
                },
              ],
              id: 'stage-2',
              name: 'stage-1',
              tag: ['28ee946a59f64949a74f3dee40a1bda4'],
              status: 'SUCCEED',
              startEpoch: 1764838908417,
              elapsed: 16273,
              fastKill: false,
              finally: false,
              canRetry: false,
              stageControlOption: {
                enable: true,
                runCondition: 'AFTER_LAST_FINISHED',
                customVariables: [],
                manualTrigger: false,
              },
              executeCount: 3,
              timeCost: {
                systemCost: 15369,
                executeCost: 652,
                waitCost: 245,
                queueCost: 245,
                totalCost: 16266,
              },
            },
          ],
          labels: [],
          instanceFromTemplate: false,
          pipelineCreator: 'zhangsan',
          events: {},
          staticViews: [],
          timeCost: {
            systemCost: 17324,
            executeCost: 652,
            waitCost: 245,
            queueCost: 1485,
            totalCost: 18466,
          },
          latestVersion: 0,
        },
        currentTimestamp: 1764840067583,
        buildNum: 3,
        curVersion: 4,
        curVersionName: 'V2(P2.T2.2)',
        latestVersion: 4,
        latestBuildNum: 3,
        lastModifyUser: 'zhangsan',
        executeTime: 652,
        stageStatus: [
          {
            stageId: 'stage-2',
            name: 'stage-1',
            status: 'SUCCEED',
            startEpoch: 1764838908417,
            elapsed: 16273,
          },
        ],
        executeCount: 3,
        startUserList: ['zhangsan', 'zhangsan', 'zhangsan'],
        recordList: [
          {
            startUser: 'zhangsan',
            timeCost: {
              systemCost: 17324,
              executeCost: 652,
              waitCost: 245,
              queueCost: 1485,
              totalCost: 18466,
            },
          },
          {
            startUser: 'zhangsan',
            timeCost: {
              systemCost: 13472,
              executeCost: 595,
              waitCost: 238,
              queueCost: 1457,
              totalCost: 14543,
            },
          },
          {
            startUser: 'zhangsan',
            timeCost: {
              systemCost: 10233,
              executeCost: 555,
              waitCost: 1123,
              queueCost: 524,
              totalCost: 13034,
            },
          },
        ],
        buildMsg: '手动触发',
        debug: false,
        versionChange: false,
        cancelBuildPerm: true,
        remark: '我是一个备注',
        material: [
          {
            scmType: 'CODE_GIT',
            aliasName: '3gins-test/fdasdghyy2321',
            url: 'http://git.woa.com/bkdevops-plugins-test/fdasdghyy.git',
            branchName: 'master',
            newCommitId: '21fe7ff0cf16b2cd44b5b8a6d0e52a1c27c7dc94',
            commitTimes: 1,
            mainRepo: false,
            createTime: 1755655572,
          },
          {
            scmType: 'CODE_GIT',
            aliasName: '3gins-test/fdasdghyy2321',
            url: 'http://git.woa.com/bkdevops-plugins-test/fdasdghyy.git',
            branchName: 'master',
            newCommitId: '21fe7ff0cf16b2cd44b5b8a6d0e52a1c27c7dc94',
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
              value: 'Fail',
              color: '#FF5656',
              count: 1,
            },
            {
              labelKey: 'AutoTest',
              value: 'Pass',
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
