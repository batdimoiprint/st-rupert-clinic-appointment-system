<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <div class="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
      <div class="mb-6">
        <h1 class="text-5xl font-bold text-red-600 dark:text-red-500">401</h1>
        <h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-200 mt-4">Unauthorized Access</h2>
      </div>
      
      <p class="text-gray-600 dark:text-gray-300 mb-8">
        You don't have permission to access this page. Please log in with appropriate credentials.
      </p>
      
      <div class="flex justify-center gap-4">
        <router-link 
          to="/home" 
          class="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Go to Home
        </router-link>
        
        <router-link 
          to="/admin" 
          class="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Admin Login
        </router-link>
      </div>
    </div>
  </div>
</template>