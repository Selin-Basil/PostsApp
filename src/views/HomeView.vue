<script setup lang="ts">
import type { Post } from '@/components/posts/PostsView.vue'
import { onMounted, ref } from 'vue'

interface DataCount {
  total: number
  posts: Post[]
}
const dataCount = ref(<DataCount>{
  total: 0,
  posts: [],
})
const fetchPosts = () => {
  fetch(`https://dummyjson.com/posts`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.total)

      dataCount.value = data
    })
    .catch((error) => {
      console.error('Error fetching posts:', error) // Handle errors
    })
}
onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div class="d-flex justify-center">
    <v-card class="dataCard">
      <v-card-title>Posts Count</v-card-title>
      <v-card-text>{{ dataCount.total }}</v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
  .dataCard{
    height: 100px;
    width: 300px;
    text-align: center;
  }
</style>
