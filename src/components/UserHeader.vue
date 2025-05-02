<template>
    <header class="dark:bg-gray-800 text-gray-800 dark:text-gray-100 w-full h-20 flex items-center justify-between px-[10%] shadow-lg">
        <!-- Left Header: Clinic Logo -->
        <router-link to="/home" class="flex items-center gap-4">
            <img src="@/assets/Logos/StRupertLogo.svg" alt="St. Rupert Logo" class="h-12 w-12 object-contain">
            <div class="flex flex-col">
                <h1 class="font-bold text-xl">St. Rupert</h1>
                <span class="font-medium text-sm">Medical Clinic</span>
            </div>
        </router-link>

        <!-- Right Header: Navigation Links, Theme Toggle and Hamburger Menu -->
        <div class="flex items-center gap-4">
            <!-- Desktop Navigation -->
            <nav class="hidden md:flex gap-6 text-sm font-medium">
                <router-link to="/home" class="hover:text-blue-600 transition">Home</router-link>
                <router-link to="/about" class="hover:text-blue-600 transition">About Us</router-link>
                <router-link to="/home#our-services" class="hover:text-blue-600 transition">Our Services</router-link>
                <router-link to="/mvg" class="hover:text-blue-600 transition">Mission, Vision, and Goals</router-link>
            </nav>

            <!-- Theme Toggle Component - Always Visible -->
            <ThemeToggle />

            <!-- Hamburger Menu for Mobile -->
            <div class="md:hidden relative">
                <button @click="toggleMenu" class="focus:outline-none">
                    <Menu class="w-6 h-6" />
                </button>
                
                <!-- Mobile Navigation Dropdown -->
                <div v-if="isMenuOpen" class="absolute right-0 mt-4 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-md py-2 z-50">
                    <router-link to="/home" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Home</router-link>
                    <router-link to="/about" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">About Us</router-link>
                    <router-link to="/home#our-services" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Our Services</router-link>
                    <router-link to="/mvg" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Mission, Vision, and Goals</router-link>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import ThemeToggle from './ThemeToggle.vue';
import { Menu } from 'lucide-vue-next';

export default {
    name: 'UserHeader',
    components: {
        ThemeToggle,
        Menu
    },
    data() {
        return {
            isMenuOpen: false
        };
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        closeMenu() {
            this.isMenuOpen = false;
        }
    }
};
</script>
