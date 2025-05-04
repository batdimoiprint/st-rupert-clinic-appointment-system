<template>
  <Card class="w-[280px] min-h-[600px] max-h-72 border-r border-border">
    <CardContent class="p-6 flex flex-col justify-between h-full">
      <nav>
        <ul class="space-y-2">
          <li>
            <Button 
              variant="ghost" 
              class="w-full justify-start" 
              :class="{ 'bg-primary text-primary-foreground': activeTab === 'dashboard' }"
              @click="setActiveTab('dashboard')"
            >
              Dashboard
            </Button>
          </li>
          <li>
            <Button 
              variant="ghost" 
              class="w-full justify-start" 
              :class="{ 'bg-primary text-primary-foreground': activeTab === 'appointments' }"
              @click="setActiveTab('appointments')"
            >
              Appointments
            </Button>
          </li>
          <li>
            <Button 
              variant="ghost" 
              class="w-full justify-start" 
              :class="{ 'bg-primary text-primary-foreground': activeTab === 'archives' }"
              @click="setActiveTab('archives')"
            >
              Archives
            </Button>
          </li>
        </ul>
      </nav>
      <div class="text-center">
        <p class="font-medium">{{ userStore.userFullName }}</p>
        <p class="text-sm text-muted-foreground mb-4">
          {{ userStore.isSuperAdmin ? 'Super Admin' : 'Admin' }}
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" class="w-full">Log Out</Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>
                Please enter your password to confirm logout.
              </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <Input 
                v-model="password"
                type="password" 
                placeholder="Enter your password" 
                autocomplete="current-password" 
                class="w-full" 
              />
              <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="closeDialog">Cancel</Button>
              <Button 
                variant="destructive" 
                :disabled="isVerifying" 
                @click="verifyAndLogout"
              >
                {{ isVerifying ? 'Verifying...' : 'Confirm' }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/userStore';

// Get the user store
const userStore = useUserStore();
const router = useRouter();

// API base URL from environment variables
const API_URL = import.meta.env.VITE_BACKEND_URL || '';

// Define active tab state
const activeTab = ref('dashboard');
const password = ref('');
const errorMessage = ref('');
const isVerifying = ref(false);
const dialogOpen = ref(false);

// Define function to change active tab
const setActiveTab = (tab) => {
  activeTab.value = tab;
};

// Verify password and logout
const verifyAndLogout = async () => {
  if (!password.value) {
    errorMessage.value = 'Password is required';
    return;
  }

  isVerifying.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.post(`${API_URL}/api/auth/verify-password`, {
      email: userStore.user?.email,
      password: password.value
    });

    const data = response.data;

    if (data.success) {
      // Password verified, proceed with logout
      userStore.logout();
      router.push('/');
    } else {
      errorMessage.value = data.message || 'Invalid password';
    }
  } catch (error) {
    console.error('Verification error:', error);
    errorMessage.value = error.response?.data?.message || 'An error occurred during verification';
  } finally {
    isVerifying.value = false;
    password.value = '';
  }
};

const closeDialog = () => {
  password.value = '';
  errorMessage.value = '';
  dialogOpen.value = false;
};

// Export the activeTab and setActiveTab to parent components
defineExpose({
  activeTab,
  setActiveTab
});
</script>
