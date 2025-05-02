<script setup lang = "ts">
import UserHeader from '@/components/UserHeader.vue' 
import UserFooter from './components/UserFooter.vue'
</script>

<template>
  <div class = "flex flex-col min-h-screen">
    <UserHeader/>

    <main>
      <router-view/>
    </main>

    <UserFooter/>
  </div>
</template>

