import { defineStore } from 'pinia'

export interface User {
  id?: string
  firstName?: string
  lastName?: string
  email: string
  role: 'admin' | 'doctor' | 'patient' | 'SUPER_ADMIN'
  avatar?: string
}

export const useUserStore = defineStore('user', {
  state: () => {
    // Try to get admin user from localStorage
    let user = null;
    let isAuthenticated = false;
    
    try {
      const adminUser = localStorage.getItem('adminUser');
      if (adminUser) {
        const parsedUser = JSON.parse(adminUser);
        user = {
          id: '0',
          firstName: parsedUser.email?.split('@')[0] || 'Admin',
          lastName: 'User',
          email: parsedUser.email,
          role: parsedUser.role
        };
        isAuthenticated = true;
      }
    } catch (error) {
      console.error('Error parsing admin user from localStorage:', error);
    }
    
    return {
      user: user as User | null,
      isAuthenticated
    }
  },
  
  actions: {
    setUser(userData: User | any) {
      // Handle backend response format
      if (userData.data && userData.success) {
        this.user = {
          id: userData.data.id || '0',
          firstName: userData.data.firstName || userData.data.email?.split('@')[0] || 'Admin',
          lastName: userData.data.lastName || 'User',
          email: userData.data.email,
          role: userData.data.role
        };
        
        // Store in localStorage for admin users
        if (userData.data.role === 'SUPER_ADMIN' || userData.data.role === 'admin') {
          localStorage.setItem('adminUser', JSON.stringify({
            email: userData.data.email,
            role: userData.data.role
          }));
        }
      } else {
        this.user = userData;
        
        // Store in localStorage for admin users
        if (userData.role === 'SUPER_ADMIN' || userData.role === 'admin') {
          localStorage.setItem('adminUser', JSON.stringify({
            email: userData.email,
            role: userData.role
          }));
        }
      }
      this.isAuthenticated = !!this.user;
    },
    
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('adminUser');
    }
  },
  
  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isSuperAdmin: (state) => state.user?.role === 'SUPER_ADMIN',
    isAnyAdmin: (state) => state.user?.role === 'admin' || state.user?.role === 'SUPER_ADMIN',
    isPatient: (state) => state.user?.role === 'patient',
    isDoctor: (state) => state.user?.role === 'doctor',
    userFullName: (state) => state.user ? `${state.user.firstName || ''} ${state.user.lastName || ''}` : '',
  }
})