import { createRouter, createWebHistory } from 'vue-router'
import { FLOW_GROUP_TYPES } from '../constants/flowGroup'
import { ROUTE_NAMES } from '../constants/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/creative-stream/:projectId',
      children: [
        {
          path: '',
          redirect: {
            name: ROUTE_NAMES.FLOW_LIST,
            params: { groupId: FLOW_GROUP_TYPES.ALL_FLOWS },
          },
        },
        {
          path: 'list/:groupId',
          component: () => import('../views/FlowList'),
          name: ROUTE_NAMES.FLOW_LIST,
          props: true,
        },
        {
          path: 'flow/:flowId',
          component: () => import('../views/Flow/index'),
          children: [
            {
              path: '',
              redirect: (to) => ({
                name: ROUTE_NAMES.FLOW_DETAIL_EXECUTION_RECORD,
                params: {
                  flowId: to.params.flowId,
                },
              }),
            },
            {
              path: 'detail/:version?',
              component: () => import('../views/Flow/Detail/index'),
              children: [
                {
                  path: 'execution-record',
                  component: () => import('../views/Flow/Detail/ExecutionRecord'),
                  name: ROUTE_NAMES.FLOW_DETAIL_EXECUTION_RECORD,
                  props: true,
                },
                {
                  path: 'trigger-record',
                  component: () => import('../views/Flow/Detail/TriggerRecord'),
                  name: ROUTE_NAMES.FLOW_DETAIL_TRIGGER_RECORD,
                  props: true,
                },
                {
                  path: 'trigger-events',
                  component: () => import('../views/Flow/Detail/TriggerEvent'),
                  name: ROUTE_NAMES.FLOW_DETAIL_TRIGGER_EVENTS,
                  props: true,
                },
                {
                  path: 'workflow-orchestration',
                  component: () => import('../views/Flow/Detail/FlowModel'),
                  name: ROUTE_NAMES.FLOW_DETAIL_WORKFLOW_ORCHESTRATION,
                  props: true,
                },
                {
                  path: 'workflow-environment',
                  component: () => import('../views/Flow/Detail/AuthoringEnv'),
                  name: ROUTE_NAMES.FLOW_DETAIL_WORKFLOW_ENVIRONMENT,
                  props: true,
                },
                {
                  path: 'notification-config',
                  component: () => import('../views/Flow/Detail/Notice'),
                  name: ROUTE_NAMES.FLOW_DETAIL_NOTIFICATION_CONFIG,
                  props: true,
                },
                {
                  path: 'basic-settings',
                  component: () => import('../views/Flow/Detail/BasicSetting'),
                  name: ROUTE_NAMES.FLOW_DETAIL_BASIC_SETTINGS,
                  props: true,
                },
                {
                  path: 'permission-settings',
                  component: () => import('../views/Flow/Detail/PermissionSettings'),
                  name: ROUTE_NAMES.FLOW_DETAIL_PERMISSION_SETTINGS,
                  props: true,
                },
                {
                  path: 'permission-delegation',
                  component: () => import('../views/Flow/Detail/PermissionDelegation'),
                  name: ROUTE_NAMES.FLOW_DETAIL_PERMISSION_DELEGATION,
                  props: true,
                },
                {
                  path: 'operation-log',
                  component: () => import('../views/Flow/Detail/ChangeLog'),
                  name: ROUTE_NAMES.FLOW_DETAIL_OPERATION_LOG,
                  props: true,
                },
                // 兜底路由：处理非法的 tab
                {
                  path: ':invalidTab',
                  redirect: (to) => {
                    // 如果 tab 不合法，重定向到默认 tab
                    return {
                      name: ROUTE_NAMES.FLOW_DETAIL_EXECUTION_RECORD,
                      params: {
                        flowId: to.params.flowId,
                      },
                    }
                  },
                },
              ],
            },
            {
              path: 'edit',
              component: () => import('../views/Flow/Edit/index'),
              children: [
                {
                  path: '',
                  redirect: (to) => ({
                    name: ROUTE_NAMES.FLOW_EDIT_WORKFLOW_ORCHESTRATION,
                    params: {
                      flowId: to.params.flowId,
                    },
                  }),
                },
                {
                  path: 'workflow-orchestration',
                  component: () => import('../views/Flow/Edit/WorkflowOrchestration'),
                  name: ROUTE_NAMES.FLOW_EDIT_WORKFLOW_ORCHESTRATION,
                  props: true,
                },
                {
                  path: 'workflow-environment',
                  component: () => import('../views/Flow/Edit/WorkflowEnvironment'),
                  name: ROUTE_NAMES.FLOW_EDIT_WORKFLOW_ENVIRONMENT,
                  props: true,
                },
                {
                  path: 'trigger-events',
                  component: () => import('../views/Flow/Edit/TriggerEvents'),
                  name: ROUTE_NAMES.FLOW_EDIT_TRIGGER_EVENTS,
                  props: true,
                },
                {
                  path: 'notification-config',
                  component: () => import('../views/Flow/Edit/NotificationConfig'),
                  name: ROUTE_NAMES.FLOW_EDIT_NOTIFICATION_CONFIG,
                  props: true,
                },
                {
                  path: 'basic-settings',
                  component: () => import('../views/Flow/Edit/BasicSettings'),
                  name: ROUTE_NAMES.FLOW_EDIT_BASIC_SETTINGS,
                  props: true,
                },
                // 兜底路由：处理非法的 tab
                {
                  path: ':invalidTab',
                  redirect: (to) => {
                    return {
                      name: ROUTE_NAMES.FLOW_EDIT_WORKFLOW_ORCHESTRATION,
                      params: {
                        flowId: to.params.flowId,
                      },
                    }
                  },
                },
              ],
            },
          ],
        },
        {
          path: '/flow/:flowId/execute/:buildNo/:type?/:executeCount?',
          name: ROUTE_NAMES.FLOW_DETAIL_EXECUTION_DETAIL,
          component: () => import('../views/FlowExecuteDetail/index'),
        },
        {
          path: '/template',
          component: () => import('../views/Template'),
          name: ROUTE_NAMES.TEMPLATE,
        },
      ],
    },
    // 全局 404 兜底
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: ROUTE_NAMES.FLOW_LIST, params: { groupId: FLOW_GROUP_TYPES.ALL_FLOWS } },
    },
  ],
})

export default router
