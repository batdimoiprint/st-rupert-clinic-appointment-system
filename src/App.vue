<script setup lang = "ts">
import UserHeader from '@/components/UserHeader.vue' 
import UserFooter from './components/UserFooter.vue'
import AboutUs from './views/User/AboutUs.vue';
</script>

<template>
  <div class = "flex flex-col min-h-screen">
    <UserHeader/>

    <main class = "flex-1">
      <AboutUs/>
    </main>

    <UserFooter/>
  </div>
</template>

