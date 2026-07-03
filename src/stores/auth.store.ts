import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/api/auth.service'
import { usersService } from '@/services/api/users.service'
import { useCartStore } from './cart.store'
import { useWishlistStore } from './wishlist.store'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const user = ref<AuthUser | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isSeller = computed(() => user.value?.role === 'seller')

  async function login(payload: LoginPayload) {
    const res = await authService.login(payload)
    const { accessToken, user: authUser } = res.data.data
    token.value = accessToken
    user.value = authUser
    localStorage.setItem('access_token', accessToken)
    // Eagerly fetch full profile + cart + wishlist so the app is hydrated immediately
    const cartStore = useCartStore()
    const wishlistStore = useWishlistStore()
    await Promise.allSettled([
      fetchMe(),
      cartStore.fetchCart(),
      wishlistStore.fetchWishlist(),
    ])
  }

  async function register(payload: RegisterPayload) {
    const res = await authService.register(payload)
    return res.data
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('access_token')
    }
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await usersService.getMe()
      user.value = res.data.data.user as AuthUser
    } catch (err: any) {
      if (err.response?.status === 401) {
        clearAuth()
      }
      throw err
    }
  }

  function clearAuth() {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
  }

  return { token, user, isAuthenticated, isAdmin, isSeller, login, register, logout, fetchMe, clearAuth }
})
