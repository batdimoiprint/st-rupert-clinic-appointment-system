import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '@/views/User/Homepage.vue'
import AboutUs from '@/views/User/AboutUs.vue'

const routes = [
    { path: '/', redirect: '/home' },  
    { path: '/home', component: Homepage, meta: { title: 'Home' } },
    { path: '/about', component: AboutUs, meta: { title: 'About'} },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
