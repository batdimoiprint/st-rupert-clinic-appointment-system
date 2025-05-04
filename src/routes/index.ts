import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '@/views/User/Homepage.vue'
import AboutUs from '@/views/User/AboutUs.vue'
import MVG from '@/views/User/MVG.vue'
import TermsAndConditions from '@/views/User/TermsAndConditions.vue'
import PrivacyPolicy from '@/views/User/PrivacyPolicy.vue'
import AppointmentForm from '@/views/User/AppointmentForm.vue'
import LoginForm from '@/views/Admin/LoginForm.vue'
import Dashboard from '@/views/Admin/Dashboard.vue'
import NotFoundPage from '@/views/Errors/NotFoundPage.vue'
import UnauthorizedPage from '@/views/Errors/UnauthorizedPage.vue'
import { useUserStore } from '@/stores/userStore'

const routes = [
    { path: '/', redirect: '/home' },  
    { 
        path: '/home', 
        component: Homepage, 
        meta: { 
            title: 'Home',
            requiresNonAdmin: true
        } 
    },
    { 
        path: '/form', 
        component: AppointmentForm, 
        meta: { 
            title: 'Appointment Form',
            requiresNonAdmin: true
        }
    },
    { 
        path: '/about', 
        component: AboutUs, 
        meta: { 
            title: 'About',
            requiresNonAdmin: true
        }
    },
    { 
        path: '/mvg', 
        component: MVG, 
        meta: { 
            title: 'Mission, Vision, and Goals',
            requiresNonAdmin: true
        }
    },
    { 
        path: '/terms', 
        component: TermsAndConditions, 
        meta: { 
            title: 'Terms and Conditions',
            requiresNonAdmin: true
        }
    },
    { 
        path: '/privacy', 
        component: PrivacyPolicy, 
        meta: { 
            title: 'Privacy Policy',
            requiresNonAdmin: true
        }
    },
    { 
        path: '/admin', 
        component: LoginForm, 
        meta: { 
            title: 'Admin Log In',
            requiresNonAdmin: true
        }
    },
    { 
        path: '/dashboard', 
        component: Dashboard, 
        meta: { 
            title: 'Dashboard',
            requiresAdmin: true
        }
    },
    { 
        path: '/unauthorized', 
        component: UnauthorizedPage, 
        meta: { 
            title: 'Unauthorized'
        }
    },
    { 
        path: '/404', 
        component: NotFoundPage, 
        meta: { 
            title: 'Not Found'
        }
    },
    // Catch-all route for undefined paths
    { 
        path: '/:pathMatch(.*)*', 
        redirect: '/404' 
    }
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

// Navigation guards
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    
    // Redirect admins to dashboard if they try to access non-admin pages
    if (to.meta.requiresNonAdmin && userStore.isAnyAdmin) {
        next('/dashboard');
        return;
    }
    
    // Redirect non-admins to unauthorized if they try to access admin pages
    if (to.meta.requiresAdmin && !userStore.isAnyAdmin) {
        next('/unauthorized');
        return;
    }
    
    // Handle the case where the root path is accessed by an admin user
    if (to.path === '/' && userStore.isAnyAdmin) {
        next('/dashboard');
        return;
    }
    
    next();
});

export default router
