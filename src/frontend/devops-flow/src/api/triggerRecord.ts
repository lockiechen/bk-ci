import { type StatusType } from "@/api/flowContentList";
/**
 * 触发记录相关 API
 */
export interface TriggerRecordItem {
  detailId: number
  projectId: string
  eventId: number
  triggerType: 'CODE_GIT' | 'MANUAL' | 'TIMER' | 'REMOTE'
  eventSource: string
  eventType: string
  triggerUser: string
  eventDesc: string
  eventTime: number
  status: StatusType
  pipelineId: string
  pipelineName: string
  buildId?: string
  buildNum?: string
  reason?: string
  reasonDetailList?: string[]
}

export interface TriggerRecordParams {
  projectId: string
  pipelineId?: string
  page?: number
  pageSize?: number
  startTime?: number | undefined
  endTime?: number | undefined
  status?: string
  triggerUser?: string
  triggerType?: string
}

export interface TriggerRecordListResponse {
  records: TriggerRecordItem[]
  count: number
}

// 查询列表函数类型
export type QueryListFunction = (page: number, pageSize?: number, isRefresh?: boolean) => void

/**
 * 触发器和事件类型项
 */
export interface TypeItem {
  id: string
  value: string
}

/**
 * 获取触发记录列表
 */
export async function getTriggerRecords(
  params: TriggerRecordParams,
): Promise<TriggerRecordListResponse> {
  // TODO: 调用实际接口
  // const response = await http.get('/api/flow/trigger-records', { params });
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        count: 15,
        records: [
          {
            detailId: 1584588,
            projectId: 'fayetest1',
            eventId: 1586516,
            triggerType: 'CODE_GIT',
            eventSource: 'qPXM',
            eventType: 'PUSH',
            triggerUser: 'lockiechen',
            eventDesc:
              '[bk-ci-pipeline-p-83acfad57b0f49709e052abffed8f0c0-20] 提交 [<a href="http://git.woa.com/bkdevops-plugins-test/pythondemolint/commit/bac270b11383fb69d7f8122d90863d74a475c604" target="_blank">bac270b1</a>] 由 <span class="trigger-user">lockiechen</span> 推送 ',
            eventTime: 1713321835000,
            status: 'SUCCEED',
            pipelineId: 'p-83acfad57b0f49709e052abffed8f0c0',
            pipelineName: '0314验收',
            buildId: 'b-9a5d1c06a6c14c41b0caa60a49e71419',
            buildNum:
              '<a href="/console/pipeline/fayetest1/p-83acfad57b0f49709e052abffed8f0c0/detail/b-9a5d1c06a6c14c41b0caa60a49e71419/executeDetail" target="_blank">#40</a>',
            reason: '触发成功',
          },
          {
            detailId: 7556732,
            projectId: 'fayetest1',
            eventId: 7544328,
            triggerType: 'CODE_GIT',
            eventSource: 'G3vV',
            eventType: 'MERGE_REQUEST',
            triggerUser: 'fayewang',
            eventDesc:
              '合并请求 [<a href="http://git.woa.com/bk-ci-test/test/yamlv3/merge_requests/3" target="_blank">!3</a>] 由 <span class="trigger-user">fayewang</span> 重新打开',
            eventTime: 1736740197000,
            status: 'FAILED',
            pipelineId: 'p-50b0216d616c4d8181e83c394dd008ef',
            pipelineName: 'trigger/t-mr.yml',
            reason: '触发器不匹配',
            reasonDetailList: ['Git事件触发 | MR目标分支[dev]不满足触发条件'],
          },
          {
            detailId: 1584585,
            projectId: 'fayetest1',
            eventId: 1586515,
            triggerType: 'CODE_GIT',
            eventSource: 'qPXM',
            eventType: 'PUSH',
            triggerUser: 'lockiechen',
            eventDesc:
              '[bk-ci-pipeline-p-83acfad57b0f49709e052abffed8f0c0-20] 提交 [<a href="http://git.woa.com/bkdevops-plugins-test/pythondemolint/commit/b93702c9cca0f0856701ea280dbe92701e7eaab2" target="_blank">b93702c9</a>] 由 <span class="trigger-user">lockiechen</span> 推送 ',
            eventTime: 1713321834000,
            status: 'SUCCEED',
            pipelineId: 'p-83acfad57b0f49709e052abffed8f0c0',
            pipelineName: '0314验收',
            buildId: 'b-fc9b5e5d372e4ccf8eafe131c383b340',
            buildNum:
              '<a href="/console/pipeline/fayetest1/p-83acfad57b0f49709e052abffed8f0c0/detail/b-fc9b5e5d372e4ccf8eafe131c383b340/executeDetail" target="_blank">#39</a>',
            reason: '触发成功',
          },
          {
            detailId: 1584583,
            projectId: 'fayetest1',
            eventId: 1586514,
            triggerType: 'CODE_GIT',
            eventSource: 'qPXM',
            eventType: 'PUSH',
            triggerUser: 'lockiechen',
            eventDesc:
              '[master] 提交 [<a href="http://git.woa.com/bkdevops-plugins-test/pythondemolint/commit/b93702c9cca0f0856701ea280dbe92701e7eaab2" target="_blank">b93702c9</a>] 由 <span class="trigger-user">lockiechen</span> 推送 ',
            eventTime: 1713321816000,
            status: 'SUCCEED',
            pipelineId: 'p-83acfad57b0f49709e052abffed8f0c0',
            pipelineName: '0314验收',
            buildId: 'b-85381254369044a0a0d7cd623ed14f5a',
            buildNum:
              '<a href="/console/pipeline/fayetest1/p-83acfad57b0f49709e052abffed8f0c0/detail/b-85381254369044a0a0d7cd623ed14f5a/executeDetail" target="_blank">#38</a>',
            reason: '触发成功',
          },
          {
            detailId: 1574920,
            projectId: 'fayetest1',
            eventId: 1576915,
            triggerType: 'CODE_GIT',
            eventSource: 'qPXM',
            eventType: 'PUSH',
            triggerUser: 'lockiechen',
            eventDesc:
              '[master] 提交 [<a href="http://git.woa.com/bkdevops-plugins-test/pythondemolint/commit/0fa0d7be132378277950950fa4a35cbf5b3d6cbf" target="_blank">0fa0d7be</a>] 由 <span class="trigger-user">lockiechen</span> 推送 ',
            eventTime: 1713255775000,
            status: 'SUCCEED',
            pipelineId: 'p-83acfad57b0f49709e052abffed8f0c0',
            pipelineName: '0314验收',
            buildId: 'b-12be614d465a4df8a585c7037f10314d',
            buildNum:
              '<a href="/console/pipeline/fayetest1/p-83acfad57b0f49709e052abffed8f0c0/detail/b-12be614d465a4df8a585c7037f10314d/executeDetail" target="_blank">#37</a>',
            reason: '触发成功',
          },
          {
            detailId: 1574918,
            projectId: 'fayetest1',
            eventId: 1576913,
            triggerType: 'CODE_GIT',
            eventSource: 'qPXM',
            eventType: 'PUSH',
            triggerUser: 'lockiechen',
            eventDesc:
              '[bk-ci-pipeline-p-83acfad57b0f49709e052abffed8f0c0-17] 提交 [<a href="http://git.woa.com/bkdevops-plugins-test/pythondemolint/commit/353a10133c5cc5b3a7d24762033b1dfe470954da" target="_blank">353a1013</a>] 由 <span class="trigger-user">lockiechen</span> 推送 ',
            eventTime: 1713255734000,
            status: 'SUCCEED',
            pipelineId: 'p-83acfad57b0f49709e052abffed8f0c0',
            pipelineName: '0314验收',
            buildId: 'b-113dcbd4e6cb4e90a2b47690cde51440',
            buildNum:
              '<a href="/console/pipeline/fayetest1/p-83acfad57b0f49709e052abffed8f0c0/detail/b-113dcbd4e6cb4e90a2b47690cde51440/executeDetail" target="_blank">#36</a>',
            reason: '触发成功',
          },
          {
            detailId: 1574916,
            projectId: 'fayetest1',
            eventId: 1576912,
            triggerType: 'CODE_GIT',
            eventSource: 'qPXM',
            eventType: 'PUSH',
            triggerUser: 'lockiechen',
            eventDesc:
              '[bk-ci-pipeline-p-83acfad57b0f49709e052abffed8f0c0-17] 提交 [<a href="http://git.woa.com/bkdevops-plugins-test/pythondemolint/commit/aa7b0a9262e23d3222bdffb99678404708cfba72" target="_blank">aa7b0a92</a>] 由 <span class="trigger-user">lockiechen</span> 推送 ',
            eventTime: 1713255733000,
            status: 'SUCCEED',
            pipelineId: 'p-83acfad57b0f49709e052abffed8f0c0',
            pipelineName: '0314验收',
            buildId: 'b-deeae45e4abf4df7a8d1eeb43b0cab8f',
            buildNum:
              '<a href="/console/pipeline/fayetest1/p-83acfad57b0f49709e052abffed8f0c0/detail/b-deeae45e4abf4df7a8d1eeb43b0cab8f/executeDetail" target="_blank">#35</a>',
            reason: '触发成功',
          },
          {
            detailId: 1574704,
            projectId: 'fayetest1',
            eventId: 1576700,
            triggerType: 'CODE_GIT',
            eventSource: 'qPXM',
            eventType: 'PUSH',
            triggerUser: 'lockiechen',
            eventDesc:
              '[bk-ci-pipeline-p-83acfad57b0f49709e052abffed8f0c0-16] 提交 [<a href="http://git.woa.com/bkdevops-plugins-test/pythondemolint/commit/9fc41bed1baf7c481fb27c81c88c23d4b6655030" target="_blank">9fc41bed</a>] 由 <span class="trigger-user">lockiechen</span> 推送 ',
            eventTime: 1713254286000,
            status: 'SUCCEED',
            pipelineId: 'p-83acfad57b0f49709e052abffed8f0c0',
            pipelineName: '0314验收',
            buildId: 'b-b07f420ad99d47b9b3e040f1a0864efd',
            buildNum:
              '<a href="/console/pipeline/fayetest1/p-83acfad57b0f49709e052abffed8f0c0/detail/b-b07f420ad99d47b9b3e040f1a0864efd/executeDetail" target="_blank">#34</a>',
            reason: '触发成功',
          },
          {
            detailId: 1574702,
            projectId: 'fayetest1',
            eventId: 1576699,
            triggerType: 'CODE_GIT',
            eventSource: 'qPXM',
            eventType: 'PUSH',
            triggerUser: 'lockiechen',
            eventDesc:
              '[bk-ci-pipeline-p-83acfad57b0f49709e052abffed8f0c0-16] 提交 [<a href="http://git.woa.com/bkdevops-plugins-test/pythondemolint/commit/aa7b0a9262e23d3222bdffb99678404708cfba72" target="_blank">aa7b0a92</a>] 由 <span class="trigger-user">lockiechen</span> 推送 ',
            eventTime: 1713254285000,
            status: 'SUCCEED',
            pipelineId: 'p-83acfad57b0f49709e052abffed8f0c0',
            pipelineName: '0314验收',
            buildId: 'b-072e78943a35485eb1f0a824ea6e36ca',
            buildNum:
              '<a href="/console/pipeline/fayetest1/p-83acfad57b0f49709e052abffed8f0c0/detail/b-072e78943a35485eb1f0a824ea6e36ca/executeDetail" target="_blank">#33</a>',
            reason: '触发成功',
          },
          {
            detailId: 1574096,
            projectId: 'fayetest1',
            eventId: 1576095,
            triggerType: 'CODE_GIT',
            eventSource: 'qPXM',
            eventType: 'PUSH',
            triggerUser: 'lockiechen',
            eventDesc:
              '[bk-ci-pipeline-p-83acfad57b0f49709e052abffed8f0c0-15] 提交 [<a href="http://git.woa.com/bkdevops-plugins-test/pythondemolint/commit/aa7b0a9262e23d3222bdffb99678404708cfba72" target="_blank">aa7b0a92</a>] 由 <span class="trigger-user">lockiechen</span> 推送 ',
            eventTime: 1713250199000,
            status: 'SUCCEED',
            pipelineId: 'p-83acfad57b0f49709e052abffed8f0c0',
            pipelineName: '0314验收',
            buildId: 'b-94539c2205bf4f62baedb1d61a1c8131',
            buildNum:
              '<a href="/console/pipeline/fayetest1/p-83acfad57b0f49709e052abffed8f0c0/detail/b-94539c2205bf4f62baedb1d61a1c8131/executeDetail" target="_blank">#31</a>',
            reason: '触发成功',
          },
          {
            detailId: 1574110,
            projectId: 'fayetest1',
            eventId: 1576096,
            triggerType: 'CODE_GIT',
            eventSource: 'qPXM',
            eventType: 'PUSH',
            triggerUser: 'lockiechen',
            eventDesc:
              '[bk-ci-pipeline-p-83acfad57b0f49709e052abffed8f0c0-15] 提交 [<a href="http://git.woa.com/bkdevops-plugins-test/pythondemolint/commit/183333e574d7672e4811c355455c436a200b70ba" target="_blank">183333e5</a>] 由 <span class="trigger-user">lockiechen</span> 推送 ',
            eventTime: 1713250199000,
            status: 'SUCCEED',
            pipelineId: 'p-83acfad57b0f49709e052abffed8f0c0',
            pipelineName: '0314验收',
            buildId: 'b-7893f28e71bf486ea91772977627c280',
            buildNum:
              '<a href="/console/pipeline/fayetest1/p-83acfad57b0f49709e052abffed8f0c0/detail/b-7893f28e71bf486ea91772977627c280/executeDetail" target="_blank">#32</a>',
            reason: '触发成功',
          },
          {
            detailId: 1574061,
            projectId: 'fayetest1',
            eventId: 1576059,
            triggerType: 'CODE_GIT',
            eventSource: 'qPXM',
            eventType: 'PUSH',
            triggerUser: 'lockiechen',
            eventDesc:
              '[bk-ci-pipeline-p-83acfad57b0f49709e052abffed8f0c0-14] 提交 [<a href="http://git.woa.com/bkdevops-plugins-test/pythondemolint/commit/5e92343bd5e627e004c1fdc772de0cda0b5a4680" target="_blank">5e92343b</a>] 由 <span class="trigger-user">lockiechen</span> 推送 ',
            eventTime: 1713249941000,
            status: 'SUCCEED',
            pipelineId: 'p-83acfad57b0f49709e052abffed8f0c0',
            pipelineName: '0314验收',
            buildId: 'b-1040f996979349e1b9e02f04d23bb17d',
            buildNum:
              '<a href="/console/pipeline/fayetest1/p-83acfad57b0f49709e052abffed8f0c0/detail/b-1040f996979349e1b9e02f04d23bb17d/executeDetail" target="_blank">#30</a>',
            reason: '触发成功',
          },
          {
            detailId: 1574024,
            projectId: 'fayetest1',
            eventId: 1576022,
            triggerType: 'CODE_GIT',
            eventSource: 'qPXM',
            eventType: 'PUSH',
            triggerUser: 'lockiechen',
            eventDesc:
              '[bk-ci-pipeline-p-83acfad57b0f49709e052abffed8f0c0-13] 提交 [<a href="http://git.woa.com/bkdevops-plugins-test/pythondemolint/commit/7047c77f6ec173a21b3ff17ded70da64527f48ac" target="_blank">7047c77f</a>] 由 <span class="trigger-user">lockiechen</span> 推送 ',
            eventTime: 1713249686000,
            status: 'SUCCEED',
            pipelineId: 'p-83acfad57b0f49709e052abffed8f0c0',
            pipelineName: '0314验收',
            buildId: 'b-d66f8bd1dba64125b9c50b186ba9c264',
            buildNum:
              '<a href="/console/pipeline/fayetest1/p-83acfad57b0f49709e052abffed8f0c0/detail/b-d66f8bd1dba64125b9c50b186ba9c264/executeDetail" target="_blank">#29</a>',
            reason: '触发成功',
          },
        ],
      })
    }, 500)
  })
}

/**
 * 获取触发器类型列表
 */
export async function getTriggerTypes(): Promise<TypeItem[]> {
  // TODO: 调用实际接口
  // const response = await http.get('/trigger/event/listTriggerType');
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'CODE_GIT', value: '代码库触发' },
        { id: 'MANUAL', value: '手动触发' },
        { id: 'TIMER', value: '定时触发' },
        { id: 'REMOTE', value: '远程触发' },
      ])
    }, 200)
  })
}

/**
 * 获取事件类型列表
 */
export async function getEventTypes(): Promise<TypeItem[]> {
  // TODO: 调用实际接口
  // const response = await http.get('/trigger/event/listEventType');
  // return response.data;

  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'PUSH', value: '推送事件' },
        { id: 'MERGE_REQUEST', value: '合并请求' },
        { id: 'TAG', value: '标签事件' },
        { id: 'SCHEDULE', value: '定时事件' },
        { id: 'WEBHOOK', value: 'Webhook事件' },
      ])
    }, 200)
  })
}
