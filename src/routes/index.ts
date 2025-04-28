import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '@/views/User/Homepage.vue'

const routes = [
    { path: '/', redirect: '/home' },  
    { path: '/home', component: Homepage, meta: { title: 'Home' } },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
