<template>
    <header :class="[
        'dark:bg-gray-800 text-gray-800 dark:text-gray-100 w-full h-20 flex items-center justify-between shadow-lg',
        userStore.isAnyAdmin ? 'p-4' : 'px-[10%]'
    ]">
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
            <!-- Desktop Navigation - Hidden for Admin -->
            <nav v-if="!userStore.isAnyAdmin" class="hidden md:flex gap-6 text-sm font-medium">
                <router-link to="/home" class="hover:text-blue-600 transition">Home</router-link>
                <router-link to="/about" class="hover:text-blue-600 transition">About Us</router-link>
                <router-link to="/home#our-services" class="hover:text-blue-600 transition">Our Services</router-link>
                <router-link to="/mvg" class="hover:text-blue-600 transition">Mission, Vision, and Goals</router-link>
                
                <!-- Authenticated user links -->
                <template v-if="userStore.isAuthenticated">
                    <router-link to="/appointments" class="hover:text-blue-600 transition">My Appointments</router-link>
                    <router-link v-if="userStore.isPatient" to="/book-appointment" class="hover:text-blue-600 transition">Book Appointment</router-link>
                    <router-link v-if="userStore.isDoctor" to="/schedule" class="hover:text-blue-600 transition">My Schedule</router-link>
                </template>
            </nav>

            <!-- Date and Time Display for Admin -->
            <div v-if="userStore.isAnyAdmin" class="flex items-center gap-2 text-sm font-medium">
                <div class="flex flex-col items-end">
                    <div class="font-bold">{{ currentDate }}</div>
                    <div>{{ currentTime }}</div>
                </div>
            </div>

            <!-- User Profile -->
            <div class="flex items-center gap-2">
                <template v-if="userStore.isAuthenticated">
                    <div class="relative">
                        <button @click="toggleUserMenu" class="flex items-center gap-2 hover:text-blue-600 transition">
                            <span class="hidden sm:inline flex flex-col items-start">
                                <span class="font-medium text-sm text-blue-600 dark:text-blue-400">
                                    {{ getTimeGreeting() }} {{ userStore.user?.firstName || 'User' }}!
                                </span>

                            </span>
                            <img v-if="userStore.user?.avatar" :src="userStore.user.avatar" alt="User avatar" class="h-8 w-8 rounded-full object-cover">

                        </button>


                    </div>
                </template>
            </div>

            <!-- Theme Toggle Component - Always Visible -->
            <ThemeToggle />

            <!-- Hamburger Menu for Mobile - Hidden for Admin on mobile -->
            <div v-if="!userStore.isAnyAdmin" class="md:hidden relative">
                <button @click="toggleMenu" class="focus:outline-none">
                    <Menu class="w-6 h-6" />
                </button>
                
                <!-- Mobile Navigation Dropdown -->
                <div v-if="isMenuOpen" class="absolute right-0 mt-4 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-md py-2 z-50">
                    <router-link to="/home" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Home</router-link>
                    <router-link to="/about" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">About Us</router-link>
                    <router-link to="/home#our-services" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Our Services</router-link>
                    <router-link to="/mvg" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Mission, Vision, and Goals</router-link>
                    
                    <!-- Authenticated mobile links -->
                    <template v-if="userStore.isAuthenticated">
                        <router-link to="/appointments" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">My Appointments</router-link>
                        <router-link v-if="userStore.isPatient" to="/book-appointment" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Book Appointment</router-link>
                        <router-link to="/profile" @click="closeMenu" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">My Profile</router-link>
                        <button @click="logout(); closeMenu();" class="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600">Logout</button>
                    </template>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
import ThemeToggle from './ThemeToggle.vue';
import { Menu } from 'lucide-vue-next';
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
    name: 'UserHeader',
    components: {
        ThemeToggle,
        Menu
    },
    data() {
        return {
            isMenuOpen: false,
            isUserMenuOpen: false,
            currentDate: '',
            currentTime: '',
            timerInterval: null as number | null
        };
    },
    setup() {
        const userStore = useUserStore();
        return { userStore };
    },
    mounted() {
        this.updateDateTime();
        this.timerInterval = window.setInterval(() => {
            this.updateDateTime();
        }, 1000);
    },
    beforeUnmount() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    },
    methods: {
        updateDateTime() {
            const now = new Date();
            
            // Format date: May 2, 2025
            const options: Intl.DateTimeFormatOptions = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            this.currentDate = now.toLocaleDateString('en-US', options);
            
            // Format time: 10:30:45 AM
            this.currentTime = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
            });
        },
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
            if (this.isMenuOpen) this.isUserMenuOpen = false;
        },
        closeMenu() {
            this.isMenuOpen = false;
        },
        toggleUserMenu() {
            this.isUserMenuOpen = !this.isUserMenuOpen;
            if (this.isUserMenuOpen) this.isMenuOpen = false;
        },
        closeUserMenu() {
            this.isUserMenuOpen = false;
        },
        logout() {
            this.userStore.logout();
            this.closeUserMenu();
            this.$router.push('/login');
        },
        getTimeGreeting() {
            const now = new Date();
            const hour = now.getHours();
            if (hour < 12) {
                return 'Good Morning';
            } else if (hour < 18) {
                return 'Good Afternoon';
            } else {
                return 'Good Evening';
            }
        }
    }
};
</script>
