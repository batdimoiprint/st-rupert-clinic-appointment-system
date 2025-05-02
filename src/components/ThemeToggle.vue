<template>
  <button @click="toggleTheme" class="focus:outline-none">
    <Sun v-if="mode === 'dark'" class="w-6 h-6" />
    <Moon v-else class="w-6 h-6" />
  </button>
</template>

<script>
import { useColorMode } from '@vueuse/core';
import { Sun, Moon } from 'lucide-vue-next';

export default {
  name: 'ThemeToggle',
  components: {
    Sun,
    Moon
  },
  setup() {
    const mode = useColorMode();

    const toggleTheme = () => {
      mode.value = mode.value === 'dark' ? 'light' : 'dark';
    };

    return {
      mode,
      toggleTheme,
    };
  },
};
</script>