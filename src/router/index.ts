import { createRouter, createWebHistory } from 'vue-router'
import PrivateLayout from '@/components/layout/PrivateLayout.vue'
import HomeView from "../views/HomeView.vue"
import PostsView from "@/components/posts/PostsView.vue"
const routes = [
  {
    path: '/',
    component: PrivateLayout,
    children: [
      {
        path: '', // This represents the root of the parent
        name: 'home',
        component: HomeView
      },
      {
        path: 'posts',
        name: 'posts',
        component: PostsView
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router