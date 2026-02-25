import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/presentation/views/HomeView.vue'),
  },
  {
    path: '/set/:id',
    name: 'flashcard-set',
    component: () => import('@/presentation/views/FlashcardSetView.vue'),
    props: true,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
