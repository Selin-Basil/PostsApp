import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PrivateLayout from '@/components/layout/PrivateLayout.vue'
import HomeView from "../views/HomeView.vue"
import PostsView from "@/components/posts/PostsView.vue"
import NewPostView from "@/components/posts/CreatePost.vue"
const routes: Array<RouteRecordRaw> = [
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
      {
        path: 'posts/create',
        name: 'create-post',
        component: NewPostView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router