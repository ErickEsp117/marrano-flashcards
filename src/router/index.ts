import { createRouter, createWebHistory } from 'vue-router'
import { hasTokens } from '@/infrastructure/http/token-storage'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/presentation/views/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/presentation/views/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/presentation/views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/set/:id',
    name: 'flashcard-set',
    component: () => import('@/presentation/views/FlashcardSetView.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/shared/:token',
    name: 'shared-set',
    component: () => import('@/presentation/views/SharedSetView.vue'),
    props: true,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const isAuthenticated = hasTokens()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.guest && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

