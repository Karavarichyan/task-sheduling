import Board from '@/views/Board.vue'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'
import Users from '@/views/Users.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { component: Login, path: '/login', name: 'login' },
    {
      component: Dashboard,
      path: '/',
      meta: { requiresAuth: true },
      children: [
        { component: Board, path: '', name: 'board' },
        { component: Users, path: 'users', name: 'users' },
      ],
    },
  ],
})

export default router
