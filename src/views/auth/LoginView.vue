<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Eye, EyeOff, ArrowRight, Loader2, ShoppingBag, Star, Shield, Zap } from 'lucide-vue-next'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'
import { loginSchema } from '@/lib/validators'

const authStore = useAuthStore()
const { toast } = useToast()
const router = useRouter()
const route = useRoute()

const showPassword = ref(false)
const loading = ref(false)

const form = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { email: '', password: '', rememberMe: false },
})

const onSubmit = form.handleSubmit(async (values) => {
  loading.value = true
  try {
    await authStore.login(values)
    const redirect = route.query.redirect as string | undefined
    router.push(redirect ?? { name: 'home' })
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Invalid email or password'
    toast({ title: 'Sign in failed', description: msg, variant: 'destructive' })
  } finally {
    loading.value = false
  }
})

const stats = [
  { icon: ShoppingBag, value: '2M+', label: 'Products' },
  { icon: Star, value: '4.9★', label: 'Rating' },
  { icon: Shield, value: '100%', label: 'Secure' },
  { icon: Zap, value: '24/7', label: 'Support' },
]
</script>

<template>
  <div class="min-h-screen flex bg-background">
    <!-- Left: AI Hero Image Panel -->
    <div class="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-shrink-0">
      <!-- Background Image -->
      <img
        src="/auth-hero.png"
        alt="Luxora premium shopping experience"
        class="absolute inset-0 w-full h-full object-cover object-center"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0" style="background: linear-gradient(135deg, oklch(0.18 0.06 295 / 0.82) 0%, oklch(0.28 0.09 295 / 0.65) 40%, oklch(0.12 0.04 280 / 0.55) 100%)" />

      <!-- Floating Stats Bar -->
      <div class="absolute bottom-10 left-8 right-8 z-20">
        <div class="glass rounded-2xl px-6 py-4" style="backdrop-filter: blur(20px) saturate(180%); background: oklch(1 0 0 / 0.10); border: 1px solid oklch(1 0 0 / 0.15);">
          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="text-center text-white"
            >
              <component :is="stat.icon" :size="18" class="mx-auto mb-1 opacity-80" />
              <div class="text-lg font-bold leading-none">{{ stat.value }}</div>
              <div class="text-xs opacity-60 mt-0.5">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Overlay -->
      <div class="relative z-10 flex flex-col justify-between p-10 w-full">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center" style="background: oklch(1 0 0 / 0.15); border: 1px solid oklch(1 0 0 / 0.2); backdrop-filter: blur(8px);">
            <span class="font-bold text-lg text-white">L</span>
          </div>
          <span class="font-bold text-xl text-white tracking-tight">Luxora</span>
        </RouterLink>

        <!-- Headline -->
        <div class="max-w-xs">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style="background: oklch(1 0 0 / 0.12); border: 1px solid oklch(1 0 0 / 0.2); backdrop-filter: blur(8px);">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span class="text-xs text-white/80 font-medium">Premium Shopping Experience</span>
          </div>
          <h2 class="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Welcome<br />back to<br />
            <span style="background: linear-gradient(135deg, oklch(0.88 0.06 50), oklch(0.78 0.12 85)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Luxora</span>
          </h2>
          <p class="text-white/60 text-base leading-relaxed">
            Your curated marketplace for premium products. Sign in to continue your shopping journey.
          </p>
        </div>
      </div>
    </div>

    <!-- Right: Form Panel -->
    <div class="flex-1 flex items-center justify-center p-6 lg:p-10 xl:p-14 overflow-y-auto">
      <div class="w-full max-w-[420px]">
        <!-- Mobile Logo -->
        <RouterLink to="/" class="flex items-center gap-2 mb-8 lg:hidden">
          <div class="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <span class="text-white font-bold">L</span>
          </div>
          <span class="font-bold text-xl text-foreground">Luxora</span>
        </RouterLink>

        <!-- Header -->
        <div class="mb-8">
          <p class="text-sm text-muted-foreground font-medium uppercase tracking-widest mb-3">Welcome back</p>
          <h1 class="text-3xl xl:text-4xl font-bold text-foreground mb-2 tracking-tight">Sign in to your<br />account</h1>
          <p class="text-muted-foreground text-sm mt-3">
            New to Luxora?
            <RouterLink to="/auth/register" class="font-semibold underline underline-offset-2" style="color: oklch(0.45 0.12 295);">
              Create a free account
            </RouterLink>
          </p>
        </div>

        <!-- Form -->
        <form @submit="onSubmit" class="space-y-5" novalidate>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-foreground">Email address</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="email"
                  id="login-email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  class="h-12 rounded-xl text-sm transition-all duration-200"
                  style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-foreground">Password</FormLabel>
              <FormControl>
                <div class="relative">
                  <Input
                    v-bind="componentField"
                    :type="showPassword ? 'text' : 'password'"
                    id="login-password"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    class="h-12 rounded-xl pr-12 text-sm transition-all duration-200"
                    style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  >
                    <component :is="showPassword ? EyeOff : Eye" :size="17" />
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="flex items-center justify-between">
            <FormField v-slot="{ value, handleChange }" name="rememberMe">
              <FormItem class="flex items-center gap-2.5 space-y-0">
                <FormControl>
                  <Checkbox
                    :checked="value"
                    @update:checked="handleChange"
                    id="rememberMe"
                    class="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </FormControl>
                <FormLabel for="rememberMe" class="text-sm font-normal cursor-pointer text-muted-foreground">
                  Keep me signed in
                </FormLabel>
              </FormItem>
            </FormField>
          </div>

          <button
            type="submit"
            id="login-submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2.5 h-12 rounded-xl text-white font-semibold text-sm shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-1"
            style="background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280)); box-shadow: 0 4px 14px oklch(0.32 0.09 295 / 0.35);"
            onmouseenter="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px oklch(0.32 0.09 295 / 0.45)'"
            onmouseleave="this.style.transform=''; this.style.boxShadow='0 4px 14px oklch(0.32 0.09 295 / 0.35)'"
          >
            <Loader2 v-if="loading" :size="18" class="animate-spin" />
            <template v-else>
              Sign in <ArrowRight :size="16" />
            </template>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-7">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t" style="border-color: oklch(0.88 0.008 85);" />
          </div>
          <div class="relative flex justify-center">
            <span class="px-3 text-xs text-muted-foreground bg-background">Trusted by millions of shoppers</span>
          </div>
        </div>

        <!-- Trust -->
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="trust in ['🔒 SSL Secure', '↩️ Free Returns', '🚀 Fast Delivery']"
            :key="trust"
            class="text-center p-2.5 rounded-xl text-xs text-muted-foreground font-medium"
            style="background: oklch(0.975 0.006 85); border: 1px solid oklch(0.88 0.008 85);"
          >
            {{ trust }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
