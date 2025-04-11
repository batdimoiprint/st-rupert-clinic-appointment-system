<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted } from 'vue'

const theme = ref('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', theme.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  theme.value = savedTheme
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <div>
    <HelloWorld :theme="theme" @toggle-theme="toggleTheme" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
