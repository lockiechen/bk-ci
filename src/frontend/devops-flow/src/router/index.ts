import { createRouter, createWebHistory } from 'vue-router'
import { FLOW_GROUP_TYPES } from '../constants/flowGroup'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/flow/:groupId',
      component: () => import('../views/Flow'),
      name: 'flowGroup',
      props: true,
    },
    {
      path: '/',
      redirect: { name: 'flowGroup', params: { groupId: FLOW_GROUP_TYPES.ALL_FLOWS } },
    },
    {
      path: '/template',
      component: () => import('../views/Template'),
      name: 'template',
    }
  ],
})

export default router
