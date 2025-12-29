<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import ModalView from '../modal/ModalView.vue'

// --- Types ---
export interface Post {
  id: number
  title: string
  body: string
  tags: string[]
  reactions: { likes: number; dislikes: number }
}

interface Comment {
  id: number
  body: string
  user: { fullName: string }
  likes: number
}

// --- State ---
const posts = ref<Post[]>([])
const page = ref(1)
const totalPages = ref(0)
const limit = ref(9) // Changed to 9 for better 3-column grid symmetry
const loading = ref(false)
const searchQuery = ref('')

// Dialog States
const dialog = ref(false)
const updateDialog = ref(false)
const viewCommentsDialog = ref(false)
const commentsLoading = ref(false)

// Form States
// --- Form States ---
const initialState = { title: '', body: '', id: null as number | null }
const form = reactive({ ...initialState })

// --- Utils ---
const resetForm = () => {
  Object.assign(form, initialState)
}
const comments = ref<Comment[]>([])
const snackbar = reactive({ show: false, text: '', color: 'success' })

// --- Utils ---
const showMessage = (text: string, color = 'success') => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}
// Call this instead of setting dialog = true directly
const openCreate = () => {
  resetForm()
  dialog.value = true
}

// --- API Logic ---

// Fetch Posts with Search and Pagination
const fetchPosts = async () => {
  loading.value = true
  try {
    const skip = (page.value - 1) * limit.value
    const url = searchQuery.value 
      ? `https://dummyjson.com/posts/search?q=${searchQuery.value}&limit=${limit.value}&skip=${skip}`
      : `https://dummyjson.com/posts?limit=${limit.value}&skip=${skip}`
      
    const res = await fetch(url)
    const data = await res.json()
    posts.value = data.posts
    totalPages.value = Math.ceil(data.total / limit.value)
  } catch {
    showMessage('Failed to fetch posts', 'error')
  } finally {
    loading.value = false
  }
}

// Debounced Search Logic
let searchTimeout: any
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchPosts()
  }, 500) // Wait 500ms after user stops typing
})

watch([page, limit], fetchPosts)

const fetchComments = async (postId: number) => {
  viewCommentsDialog.value = true
  commentsLoading.value = true
  try {
    const res = await fetch(`https://dummyjson.com/posts/${postId}/comments`)
    const data = await res.json()
    comments.value = data.comments
  } finally {
    commentsLoading.value = false
  }
}

const handleCreate = async () => {
  try {
    await fetch('https://dummyjson.com/posts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, userId: 5, body: form.body }),
    })
    showMessage('Post created successfully!')
    dialog.value = false
    form.title = ''
    form.body = ''
  } catch { showMessage('Error creating post', 'error') }
}

const handleDelete = async (id: number) => {
  if (!confirm('Are you sure?')) return
  try {
    await fetch(`https://dummyjson.com/posts/${id}`, { method: 'DELETE' })
    posts.value = posts.value.filter(p => p.id !== id)
    showMessage('Post deleted', 'info')
  } catch (e) { showMessage('Delete failed', 'error') }
}

const openUpdate = (post: Post) => {
  form.id = post.id
  form.title = post.title
  updateDialog.value = true
}

const handleUpdate = async () => {
  try {
    await fetch(`https://dummyjson.com/posts/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title }),
    })
    const index = posts.value.findIndex(p => p.id === form.id)
    if (index !== -1) posts.value[index].title = form.title
    updateDialog.value = false
    showMessage('Post updated!')
  } catch { showMessage('Update failed', 'error') }
}

onMounted(fetchPosts)
</script>

<template>
  <v-container>
    <v-row class="align-center mb-6">
      <v-col cols="12" sm="8">
        <v-text-field
          v-model="searchQuery"
          variant="solo-filled"
          label="Search posts..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          flat
          rounded="lg"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" class="text-right">
        <v-btn color="primary" size="large" prepend-icon="mdi-plus" rounded="lg" @click="openCreate" block>
          New Post
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col v-for="n in 6" :key="n" cols="12" md="4">
        <v-skeleton-loader type="card, list-item-two-line"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="post in posts" :key="post.id" cols="12" md="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 8 : 2"
            class="d-flex flex-column transition-swing"
            rounded="lg"
            height="100%"
          >
            <v-card-item>
              <template v-slot:append>
                <v-menu location="bottom end">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                  </template>
                  <v-list density="compact" rounded="lg">
                    <v-list-item prepend-icon="mdi-pencil" title="Edit" @click="openUpdate(post)" />
                    <v-list-item prepend-icon="mdi-delete" title="Delete" color="error" @click="handleDelete(post.id)" />
                  </v-list>
                </v-menu>
              </template>
              <v-card-title class="text-primary font-weight-bold text-wrap">
                {{ post.title }}
              </v-card-title>
            </v-card-item>

            <v-card-text class="flex-grow-1 text-secondary overflow-y-auto">
              {{ post.body}}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="px-4 py-3">
              <v-btn variant="tonal" size="small" prepend-icon="mdi-message-outline" @click="fetchComments(post.id)">
                Comments
              </v-btn>
              <v-spacer></v-spacer>
              <v-chip size="x-small" color="blue-lighten-4" class="text-blue-darken-3">
                ID: {{ post.id }}
              </v-chip>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-pagination
      v-model="page"
      :length="totalPages"
      :total-visible="5"
      class="mt-10"
      rounded="circle"
    ></v-pagination>

    <ModalView v-model:dialog="dialog">
      <v-card rounded="xl" class="pa-4" style="width: 500px;">
        <v-card-title>Create New Post</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.title" label="Title" variant="outlined" />
          <v-textarea v-model="form.body" label="Content" variant="outlined" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" @click="handleCreate">Publish</v-btn>
        </v-card-actions>
      </v-card>
    </ModalView>

    <ModalView v-model:dialog="updateDialog">
      <v-card rounded="xl" class="pa-4" style="width: 500px;">
        <v-card-title>Update Post Title</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.title" label="Post Title" variant="outlined" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="updateDialog = false">Cancel</v-btn>
          <v-btn color="orange" variant="elevated" @click="handleUpdate">Update</v-btn>
        </v-card-actions>
      </v-card>
    </ModalView>

    <ModalView v-model:dialog="viewCommentsDialog">
      <v-card rounded="xl" max-height="600" class="d-flex flex-column">
        <v-card-title class="sticky-top bg-white border-b d-flex align-center">
          Comments
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="viewCommentsDialog = false"></v-btn>
        </v-card-title>
        
        <v-card-text class="pa-4 overflow-y-auto">
          <div v-if="commentsLoading" class="text-center pa-10">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else-if="comments.length === 0" class="text-center text-grey pa-10">
            No comments yet.
          </div>
          <v-list v-else lines="three">
            <v-list-item
              v-for="item in comments"
              :key="item.id"
              :title="item.user.fullName"
              :subtitle="item.body"
              class="mb-2 border rounded-lg"
            >
              <template v-slot:prepend>
                <v-avatar color="grey-lighten-2">
                  <v-icon icon="mdi-account"></v-icon>
                </v-avatar>
              </template>
              <template v-slot:append>
                <div class="text-caption d-flex align-center">
                  <v-icon icon="mdi-heart" color="red" size="small" class="mr-1"></v-icon>
                  {{ item.likes }}
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </ModalView>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" rounded="pill">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.transition-swing {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>