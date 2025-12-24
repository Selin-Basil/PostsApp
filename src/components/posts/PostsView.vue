<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'

// Define type for a post
export interface Post {
  id: number
  title: string
  body: string
  total: number
}

const posts = ref<Post[]>([]) // Store posts
const page = ref(1) // Current page
const totalPages = ref(0) // Total pages
const limit = ref(12) // Posts per page
const loading = ref(false) // Loading state
const dialog = ref(false)
const searchQuery = ref('')
// Function to fetch posts based on current page and limit
const fetchPosts = () => {
  loading.value = true
  fetch(
    `https://dummyjson.com/posts/search?q=${searchQuery.value}&limit=${limit.value}&skip=${(page.value - 1) * limit.value}`,
  )
    .then((res) => res.json())
    .then((data) => {
      posts.value = data.posts // Assign the posts array to posts.value
      totalPages.value = Math.ceil(data.total / limit.value) // Calculate total pages
    })
    .catch((error) => {
      loading.value = false
      console.error('Error fetching posts:', error) // Handle errors
    })
    .finally(() => {
      loading.value = false // Always stop loading regardless of success/fail
    })
}

// Watch for page changes to fetch posts for the new page
watch(page, () => {
  fetchPosts()
})
// Watch for limit changes to fetch posts with the updated limit
watch(limit, () => {
  fetchPosts()
})
watch(searchQuery, () => {
  fetchPosts()
})
// Fetch posts when the component is mounted
onMounted(() => {
  fetchPosts()
})
// 1. Define the shape of your data
type FormData = {
  Title: string
  Description: string
  email: string
}

// 2. Use reactive for a cleaner way to handle multiple form fields
const form = reactive<FormData>({
  Title: '',
  Description: '',
  email: '',
})

// 3. Define specific rules for different field types
const titleRules = [
  (v: string) => !!v || 'Title is required',
  (v: string) => (v && v.length >= 2) || 'Title must be at least 2 characters',
]

const handleSubmit = () => {
  // Handle form submission logic here
  console.log('Form submitted with:', form)
  fetch('https://dummyjson.com/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: form.Title,
      userId: 5,
      description: form.Description,
    }),
  })
    .then((res) => {
      dialog.value = false
      fetchPosts()
      res.json()
      form.Title = ''
      form.Description = ''
      form.email = ''
    })
    .then(console.log)
}
</script>

<template>
  <div v-if="loading">
    <LoadingSpinner />
  </div>
  <div style="display: flex; justify-content: space-between; margin-bottom: 10px; gap: 20px">
    <v-text-field
      label="Search"
      prepend-inner-icon="mdi-magnify"
      v-model="searchQuery"
    ></v-text-field>

    <v-btn elevation="4" size="large" @click="dialog = true">Create Posts</v-btn>
  </div>
  <v-dialog v-model="dialog" width="auto">
    <v-sheet class="mx-auto" width="500" style="padding: 30px">
      <v-form @submit.prevent="handleSubmit">
        <v-text-field v-model="form.Title" :rules="titleRules" label="Title" />
        <v-btn class="mt-2" type="submit" color="primary" block> Submit </v-btn>
      </v-form>
    </v-sheet>
  </v-dialog>
  <v-row>
    <v-col v-for="value in posts" :key="value.id" cols="12" md="4">
      <v-card height="250px" :hover="true">
        <v-card-title>{{ value.title }}</v-card-title>
        <v-card-text>{{ value.body }}</v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <div class="text-center">
    <v-container>
      <v-pagination class="p-4" v-model="page" :length="totalPages" :total-visible="7">
      </v-pagination>
    </v-container>
  </div>
</template>
