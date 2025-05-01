<template>
  <Card class="w-[280px] min-h-[600px] border-r border-border">
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
        <p class="font-medium">Rupert J. Agapito</p>
        <p class="text-sm text-muted-foreground mb-4">Admin</p>
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
                type="password" 
                placeholder="Enter your password" 
                autocomplete="new-password" 
                class="w-full" 
              />
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <RouterLink to="/">
                <Button variant="destructive">Confirm</Button>
              </RouterLink>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RouterLink } from 'vue-router';

// Define active tab state
const activeTab = ref('dashboard');

// Define function to change active tab
const setActiveTab = (tab) => {
  activeTab.value = tab;
};

// Export the activeTab and setActiveTab to parent components
defineExpose({
  activeTab,
  setActiveTab
});
</script>
