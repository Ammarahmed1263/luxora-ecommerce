import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function setupGuards(router: Router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    // Ensure user profile is loaded on first navigation (e.g., page refresh) if token exists
    if (authStore.isAuthenticated && !authStore.user) {
      try {
        await authStore.fetchMe()
      } catch {
        // If fetchMe fails (e.g. 401), auth state is cleared internally
      }
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.requiresGuest && authStore.isAuthenticated) {
      return { name: 'home' }
    }

    if (to.meta.requiresAdmin) {
      if (!authStore.isAuthenticated) {
        return { name: 'login', query: { redirect: to.fullPath } }
      }
      if (!authStore.isAdmin) {
        return { name: 'home' }
      }
    }

    if (to.meta.requiresSeller) {
      if (!authStore.isAuthenticated) {
        return { name: 'login', query: { redirect: to.fullPath } }
      }
      if (!authStore.isSeller && !authStore.isAdmin) {
        return { name: 'home' }
      }
    }

    if (to.meta.title) {
      document.title = `${to.meta.title} — Luxora`
    }

    return true
  })
}
