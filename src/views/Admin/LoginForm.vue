<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StRupertClinicImage from '@/assets/About-1.webp'

const email = ref('')
const password = ref('')
const isLoading = ref(false) // Add loading state
const responseMessage = ref('') // Add response message state
const router = useRouter()

function handleLogin() {
  router.push('/dashboard'); // Redirect to /dashboard
}
</script>

<template>
  <div
    class="flex h-screen w-full items-center justify-center bg-cover bg-center"
    :style="{ backgroundImage: `url(${StRupertClinicImage})` }"
  >
    <Card class="w-full max-w-md bg-white/90 shadow-lg backdrop-blur-sm dark:bg-gray-900/90">
      <CardHeader>
        <CardTitle class="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
          Admin Login
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <Label for="email" class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
              <span class="text-red-500">*</span> Email Address:
            </Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="admin@example.com"
              required
              :disabled="isLoading"
              class="w-full rounded-md border-gray-300 bg-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div class="mb-6">
            <Label for="password" class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
              <span class="text-red-500">*</span> Password:
            </Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              :disabled="isLoading"
              class="w-full rounded-md border-gray-300 bg-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <Button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-accent text-accent-foreground hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
            onclick=""
          >
            <span v-if="!isLoading">Login</span>
            <span v-else>
              <svg
                class="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </span>
          </Button>
        </form>
        <p v-if="responseMessage" class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ responseMessage }}
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
/* Styles adjusted for full-view layout and matching the image */
</style>
