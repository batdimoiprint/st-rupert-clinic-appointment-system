<template>
  <div class="flex p-4">
    <Sidebar ref="sidebarRef" />
    <main class="flex-1 pl-4">
      <DashboardHome v-if="activeTab === 'dashboard'" />
      <Appointments v-else-if="activeTab === 'appointments'" />
      <Archives v-else-if="activeTab === 'archives'" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import DashboardHome from '@/views/Admin/DashboardHome.vue';
import Appointments from '@/views/Admin/Appointments.vue';
import Archives from '@/views/Admin/Archives.vue';

// Reference to sidebar component
const sidebarRef = ref(null);

// Compute active tab from sidebar
const activeTab = computed(() => {
  return sidebarRef.value?.activeTab || 'dashboard';
});
</script>