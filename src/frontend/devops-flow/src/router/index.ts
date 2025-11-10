import { createRouter, createWebHistory } from 'vue-router'
import { FLOW_GROUP_TYPES } from '../constants/flowGroup'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'flowList', params: { groupId: FLOW_GROUP_TYPES.ALL_FLOWS } },
    },
    {
      path: '/list/:groupId',
      component: () => import('../views/FlowList'),
      name: 'flowList',
      props: true,
    },
    {
      path: '/flow/:flowId',
      component: () => import('../views/Flow/index'),
      children: [
        {
          path: '',
          component: () => import('../views/Flow/Detail'),
          name: 'flowDetail',
          props: true,
        },
        {
          path: 'edit',
          component: () => import('../views/Flow/Edit'),
          name: 'flowDetailEdit',
          props: true,
        }
      ],
    },
    {
      path: '/template',
      component: () => import('../views/Template'),
      name: 'template',
    },
  ],
})

export default router
