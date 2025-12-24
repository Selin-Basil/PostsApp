<script setup lang="ts">
import HeaderView from './HeaderView.vue'
import FooterView from './FooterView.vue'
import SidebarView from './SidebarView.vue';
import { ref } from 'vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;  
};
</script>

<template>
  <HeaderView @toggleSidebar="toggleSidebar" />
  <div class="layout-body">
      <SidebarView :isOpen="isSidebarOpen" />
      
      <main class="content">
        <router-view />
      </main>
    </div>
  <FooterView />
</template>

<style>
main {
  padding-top: 3.5rem;
}
.layout-body {
  display: flex;
  margin-top: 60px; /* Height of your Fixed Header */
  margin-bottom: 60px; /* Height of your Fixed Footer */
}

.content {
  flex: 1; /* Takes up remaining width */
  margin-left: 250px; /* Matches Sidebar width */
  padding: 1rem 1rem 1rem 1rem;
}
@media (max-width: 767px) {
  .content {
    margin-left: 0; /* No margin when sidebar is hidden */
  }
}
</style>
