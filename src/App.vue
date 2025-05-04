<script setup lang="ts">
import UserHeader from '@/components/UserHeader.vue' 
import UserFooter from './components/UserFooter.vue'
import { useUserStore } from '@/stores/userStore'

// Get user store to check admin status
const userStore = useUserStore()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <UserHeader/>

    <main>
      <router-view/>
    </main>

    <!-- Only show footer for non-admin users -->
    <UserFooter v-if="!userStore.isAnyAdmin"/>
  </div>
</template>

