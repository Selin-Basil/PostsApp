<script setup lang="ts">
import { reactive } from 'vue'

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

const descriptionRules = [
  (v: string) => !!v || 'Description is required',
  (v: string) => (v && v.length >= 2) || 'Description must be at least 2 characters',
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
      res.json()
      form.Title = ''
      form.Description = ''
      form.email = ''
    })
    .then(console.log)
}
</script>

<template>
  <v-container class="mt-4">
    <v-sheet class="mx-auto" width="300">
      <v-form @submit.prevent="handleSubmit">
        <v-text-field v-model="form.Title" :rules="titleRules" label="Title" />

        <v-text-field v-model="form.Description" :rules="descriptionRules" label="Description" />

        <v-btn class="mt-2" type="submit" color="primary" block> Submit </v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>
