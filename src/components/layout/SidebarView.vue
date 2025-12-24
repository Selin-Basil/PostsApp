<script setup lang="ts">
defineProps<{ isOpen: boolean }>()
</script>

<template>
  <aside class="sidebar" :class="{ active: isOpen }">
    <nav>
      <ul>
        <li><router-link class="router-link" to="/">Dashboard</router-link></li>
        <li><router-link class="router-link" to="/posts">Posts</router-link></li>
        <li><router-link class="router-link" to="/settings"></router-link></li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  height: 100%;
  background-color: #f1f1f1;
  color: black;
  position: fixed;
  top: 56px; /* Same as Header height */
  left: 0;
  padding: 1rem;
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}
.sidebar.active {
  transform: translateX(0);
}
@media (min-width: 768px) {
  .sidebar {
    transform: translateX(0);
  }
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 1rem;
}
.router-link {
  text-decoration: none;
  color: inherit;
}
</style>
