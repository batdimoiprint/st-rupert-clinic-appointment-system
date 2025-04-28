<script setup lang = "ts">
import UserHeader from '@/components/UserHeader.vue' 
import UserFooter from './components/UserFooter.vue'
import AboutUs from './views/User/Homepage.vue';
</script>

<template>
  <div class = "flex flex-col min-h-screen">
    <UserHeader/>

    <main class = "flex-1">
      <router-view></router-view>
    </main>

    <UserFooter/>
  </div>
</template>

