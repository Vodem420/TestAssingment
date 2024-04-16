import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import UserPage from '../views/UserPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/userPage',
      name: 'userPage',
      component: UserPage
    }
  ]
})

export default router
