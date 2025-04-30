import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '@/views/User/Homepage.vue'
import AboutUs from '@/views/User/AboutUs.vue'
import MVG from '@/views/User/MVG.vue'
import TermsAndConditions from '@/views/User/TermsAndConditions.vue'
import PrivacyPolicy from '@/views/User/PrivacyPolicy.vue'

const routes = [
    { path: '/', redirect: '/home' },  
    { path: '/home', component: Homepage, meta: { title: 'Home' } },
    { path: '/about', component: AboutUs, meta: { title: 'About'} },
    { path: '/mvg', component: MVG, meta: { title: 'Mission, Vision, and Goals'} },
    { path: '/terms', component: TermsAndConditions, meta: { title: 'Terms and Conditions'} },
    { path: '/privacy', component: PrivacyPolicy, meta: { title: 'Privacy Policy'} },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
            el: to.hash,
            behavior: 'smooth',
            }
        } else if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

export default router
