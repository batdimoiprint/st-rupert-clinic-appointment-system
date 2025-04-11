<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'

defineProps<{
  theme: string
}>()

const emit = defineEmits<{
  (e: 'toggle-theme'): void
}>()

const colorVariables = [
  { name: 'Background', variable: 'bg-background', light: '#FFFFFF', dark: '#020817' },
  { name: 'Foreground', variable: 'bg-foreground', light: '#020817', dark: '#F8FAFC' },
  { name: 'Card', variable: 'bg-card', light: '#FFFFFF', dark: '#020817' },
  { name: 'Card Foreground', variable: 'bg-card-foreground', light: '#020817', dark: '#F8FAFC' },
  { name: 'Primary', variable: 'bg-primary', light: '#2563EB', dark: '#3B82F6' },
  { name: 'Primary Foreground', variable: 'bg-primary-foreground', light: '#F8FAFC', dark: '#1E293B' },
  { name: 'Secondary', variable: 'bg-secondary', light: '#F1F5F9', dark: '#1E293B' },
  { name: 'Secondary Foreground', variable: 'bg-secondary-foreground', light: '#1E293B', dark: '#F8FAFC' },
  { name: 'Muted', variable: 'bg-muted', light: '#F1F5F9', dark: '#1E293B' },
  { name: 'Muted Foreground', variable: 'bg-muted-foreground', light: '#64748B', dark: '#94A3B8' },
  { name: 'Accent', variable: 'bg-accent', light: '#F1F5F9', dark: '#1E293B' },
  { name: 'Accent Foreground', variable: 'bg-accent-foreground', light: '#1E293B', dark: '#F8FAFC' },
  { name: 'Destructive', variable: 'bg-destructive', light: '#EF4444', dark: '#7F1D1D' },
  { name: 'Border', variable: 'bg-border', light: '#E2E8F0', dark: '#1E293B' },
  { name: 'Input', variable: 'bg-input', light: '#E2E8F0', dark: '#1E293B' },
  { name: 'Ring', variable: 'bg-ring', light: '#2563EB', dark: '#1D4ED8' },
  { name: 'Sidebar', variable: 'bg-sidebar', light: '#FFFFFF', dark: '#0F172A' }
]
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Color System</h1>
      <button 
        @click="emit('toggle-theme')"
        class="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {{ theme === 'light' ? 'Dark' : 'Light' }} Mode
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
      <Card v-for="color in colorVariables" :key="color.name" class="overflow-hidden">
        <CardHeader>
          <CardTitle>{{ color.name }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="h-20 rounded-md" :class="color.variable"></div>
            <div class="dark h-20 rounded-md" :class="color.variable"></div>
            <div class="text-sm text-muted-foreground space-y-1">
              <p>Light: {{ color.light }}</p>
              <p>Dark: {{ color.dark }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
