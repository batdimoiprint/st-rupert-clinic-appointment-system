import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '@/views/User/Homepage.vue'
import AboutUs from '@/views/User/AboutUs.vue'
import MVG from '@/views/User/MVG.vue'
import TermsAndConditions from '@/views/User/TermsAndConditions.vue'
import PrivacyPolicy from '@/views/User/PrivacyPolicy.vue'
import AppointmentForm from '@/views/User/AppointmentForm.vue'
import LoginForm from '@/views/Admin/LoginForm.vue'
import Dashboard from '@/views/Admin/Dashboard.vue'

const routes = [
    { path: '/', redirect: '/home' },  
    { path: '/home', component: Homepage, meta: { title: 'Home' } },
    { path: '/form', component: AppointmentForm, meta: { title: 'Appointment Form'} },
    { path: '/about', component: AboutUs, meta: { title: 'About'} },
    { path: '/mvg', component: MVG, meta: { title: 'Mission, Vision, and Goals'} },
    { path: '/terms', component: TermsAndConditions, meta: { title: 'Terms and Conditions'} },
    { path: '/privacy', component: PrivacyPolicy, meta: { title: 'Privacy Policy'} },
    { path: '/admin', component: LoginForm, meta: { title: 'Admin Log In'} },
    { path: '/dashboard', component: Dashboard, meta: { title: 'Dashboard'} }
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
