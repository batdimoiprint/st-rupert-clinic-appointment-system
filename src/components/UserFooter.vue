<template>
    <footer class="w-full  font-Inter">
        <div class="px-[10%] sm:lg: py-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-b border-gray-800 pb-8">
                <!-- Logo and Description -->
                <div class="flex flex-col gap-4">
                    <router-link to="/home" class="group">
                        <div class="flex items-center gap-3">
                            <img src="@/assets/Logos/StRupertLogo.svg" class="h-14 w-14 object-contain transition-transform duration-200 group-hover:scale-105" alt="St. Rupert Logo">
                            <div class="flex flex-col">
                                <h2 class="font-bold text-xl  group-hover:text-primary transition-colors duration-200">St. Rupert</h2>
                                <p class="font-medium text-sm  group-hover:text-primary transition-colors duration-200">Medical Clinic</p>
                            </div>
                        </div>
                    </router-link>
                    <router-link to="/home" class="text-sm  hover:text-primary transition-colors duration-200">
                        Welcome to St. Rupert Medical Clinic, where patient care is our top priority. We have been providing personalized care to our patients since 2005, and we are proud to be a trusted healthcare provider in the Philippines.
                    </router-link>
                </div>
                
                <!-- Contact Information -->
                <div class="flex flex-col space-y-4">
                    <div class="flex items-start gap-3">
                        <MapPin class="h-5 w-5  flex-shrink-0 mt-0.5"/>
                        <p class="text-sm ">Unit 132, LTM Building Ramarosa, Luzon Ave, Quezon City, 1119 Metro Manila</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <Phone class="h-5 w-5  flex-shrink-0"/>
                        <p class="text-sm ">09202547595 | 8-373-8421</p>
                    </div>
                </div>
                
                <!-- Legal Terms -->
                <div class="flex flex-col space-y-2">
                    <h3 class="text-base font-semibold mb-1">Legal Terms</h3>
                    <router-link to="/terms" class="text-sm  hover:text-primary transition-colors duration-200">
                        Terms and Conditions
                    </router-link>
                    <router-link to="/privacy" class="text-sm  hover:text-primary transition-colors duration-200">
                        Privacy Policy
                    </router-link>
                </div>
            </div>
            
            <!-- Copyright Section -->
            <div class="py-4 text-center">
                <p class="text-xs text-gray-400">© {{ currentYear }} St. Rupert Medical Clinic. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { Phone, MapPin } from 'lucide-vue-next'
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>