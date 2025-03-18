<template>
    <header>
        <div class = "logo">
            <img src = "../assets/header/clinic-logo.svg" alt = "St. Rupert Medical Clinic logo">
            <span>
                <h1>St. Rupert</h1>
                <p>Medical Clinic</p>
            </span>
        </div>
        <div class="admin-account-side">
            <div class="time-and-date">
                <p class = "date">{{ formattedDate }}</p>
                <p class = "time">{{ formattedTime }}</p>
            </div>
            <div class = "greetings">
                <p>{{ greeting }}</p>
                <p class = "admin-name">{{ adminName }}</p>
            </div>
            <div class = "admin-icon">
                <img src = "../assets/header/admin-icon.png" alt = "Admin Icon">
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const formattedDate = ref('')
const formattedTime = ref('')
const greeting = ref('')
const adminName = ref('Admin Name')
let intervalId

const updateDateTime = () => {
    const now = new Date()
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' }
    formattedDate.value = now.toLocaleDateString(undefined, optionsDate)
    let hours = now.getHours()
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    formattedTime.value = `${hours}:${minutes}:${seconds} ${ampm}`
}

const getGreeting = () => {
    const now = new Date()
    const hours = now.getHours()
    if (hours < 12) {
        return "Good Morning!"
    } else if (hours < 18) {
        return "Good Afternoon!"
    } else {
        return "Good Evening!"
    }
}

onMounted(() => {
    updateDateTime()
    greeting.value = getGreeting()
    intervalId = setInterval(() => {
        updateDateTime()
        greeting.value = getGreeting()
    }, 1000)
})

onUnmounted(() => {
    clearInterval(intervalId)
})
</script>

<style lang = "scss">
@use "@/styles/variables.scss" as vars;
@import 'normalize.css';

header {
    height: 10vw;
    width: 100%;
    background-color: vars.$header-color;
    font-family: vars.$font-family;
    color: vars.$header-font-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .logo {
        display: flex;
        align-items: center;
        gap: 3%; 
        padding: 3%;

        img {
            object-fit: contain;
        }

        span {
            line-height: 0.25;

            h1 {
                font-size: 2rem;
                white-space: nowrap;
            }

            p {
                text-align: right;
            }
        }
    }

    .admin-account-side {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 50px;
        padding: 3%;

        .time-and-date {
            text-align: center;
        }

        .greetings {
            text-align: center;

            .admin-name {
                font-weight: bold;
            }
        }

        .admin-icon {
            img {
                height: 50px;
            }
        }
    }
}
</style>