<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <div class="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
      <div class="mb-6">
        <h1 class="text-5xl font-bold text-gray-800 dark:text-gray-200">404</h1>
        <h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-200 mt-4">Page Not Found</h2>
      </div>
      
      <p class="text-gray-600 dark:text-gray-300 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div class="flex justify-center">
        <router-link 
          to="/home" 
          class="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </router-link>
      </div>
    </div>
  </div>
</template>