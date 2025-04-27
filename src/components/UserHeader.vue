<template>
    <header class = "bg-background text-accent-blue w-full h-18 sm:h-20 md:h-22 lg:h-24 flex flex-row font-Inter drop-shadow-sm">
        <!-- This is the left header (Clinic Logo) -->
        <div class = "flex items-center justify-center w-100">
            <div class = "flex items-center gap-2">
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
        </div>
        <!-- This is the right header (Navigation Links) -->
        <div class = "flex flex-row items-center justify-evenly w-225 font-medium text-xs sm:text-sm md:text-md lg:text-base">
            <router-link to = "" class = "cursor-pointer">About Us</router-link>
            <router-link to = "" class = "cursor-pointer">Our Services</router-link>
            <router-link to = "" class = "cursor-pointer">Mission, Vision, and Goals</router-link>
            <router-link to = "" class = "cursor-pointer">Admin Log In</router-link>
        </div>
    </header>
</template>
