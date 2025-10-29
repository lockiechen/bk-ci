import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/Flow'),
      name: 'flow',
    },
    {
      path: '/flow/:groupId',
      component: () => import('../views/Flow'),
      name: 'flowGroup',
      props: true,
    },
    {
      path: '/template',
      component: () => import('../views/Template'),
      name: 'template',
    }
  ],
})

export default router
