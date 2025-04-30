<template>
    <footer class = "bg-background w-full h-70 drop-shadow-sm font-Inter grid grid-rows-[4fr_1fr]">
        <!-- This is the upper footer. -->
        <div class = "grid grid-cols-[1.5fr_1fr_.5fr_.5fr] w-full gap-5 p-10 justify-evenly">
            <!-- First Column -->
            <div class = "flex flex-col justify-evenly gap-2">
                <div class = "flex items-center gap-2 text-accent-blue">
                    <img src = "@/assets/Logos/StRupertLogo.svg" class = "h-16 w-16 object-contain">
                    <div class = "flex flex-col items-end justify-end">
                        <h2 class = "font-bold text-lg sm:text-xl md:text-2xl">
                            St. Rupert
                        </h2>
                        <p class = "font-medium text-xs sm:text-sm md:text-base">
                            Medical Clinic
                        </p>
                    </div>
                </div>
                <p class = "text-justify text-xs">Welcome to St. Rupert Medical Clinic , where patient care is our top priority. We have been providing personalized care to our patients since 2005, and we are proud to be a trusted healthcare provider in the Philippines. </p>
            </div>
            <!-- Second Column -->
            <div class = "flex flex-col items-start justify-start font-medium text-accent-blue">
                <div class = "flex items-start gap-2">
                    <MapPin class = "h-7 w-7 text-foreground"/>
                    <p class = "text-xs">Unit 132, LTM Building Ramarosa, Luzon Ave, Quezon City, 1119 Metro Manila</p>
                </div>
                <div class = "flex items-center gap-2 mt-2">
                    <Phone class = "h-4 w-5 text-foreground"/>
                    <p class = "text-xs">09202547595  |  8-373-8421</p>
                </div>
            </div>
            <!-- Third Column -->
            <div class = "flex flex-col items-center justify-start gap-2">
                <h3 class="text-left w-full">Shortcuts</h3>
                <router-link to = "/home" class="text-xs opacity-75 cursor-pointer text-left w-full">Home</router-link>
                <router-link to = "/home#faqs" class="text-xs opacity-75 cursor-pointer text-left w-full">FAQs</router-link>
                <router-link to = "/home#our-services" class="text-xs opacity-75 cursor-pointer text-left w-full">Our Services</router-link>
                <router-link to = "/about" class="text-xs opacity-75 cursor-pointer text-left w-full">About Us</router-link>
            </div>
            <!-- Fourth Column -->
            <div class = "flex flex-col items-start justify-start gap-2">
                <h3 class = "text-left">Legal Terms</h3>
                <router-link to = "/terms" class = "text-xs opacity-75 cursor-pointer text-left">Terms and Conditions</router-link>
                <router-link to = "/privacy" class = "text-xs opacity-75 cursor-pointer text-left">Privacy Policy</router-link>
            </div>
        </div>
    </footer>
</template>

<script setup lang = "ts">
import { Phone, MapPin } from 'lucide-vue-next'
</script>