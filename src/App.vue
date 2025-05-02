<script setup lang="ts">
import UserHeader from '@/components/UserHeader.vue' 
import UserFooter from './components/UserFooter.vue'
// No need for auth check since the userStore now reads directly from localStorage on initialization
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <UserHeader/>

    <main>
      <router-view/>
    </main>

    <UserFooter/>
  </div>
</template>

