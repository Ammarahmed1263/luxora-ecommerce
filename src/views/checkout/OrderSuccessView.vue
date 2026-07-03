<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { CheckCircle, Package, ArrowRight } from 'lucide-vue-next'
import AppNavbar from '@/components/layout/AppNavbar.vue'

const orderNumber = `ORD-${Date.now().toString().slice(-8)}`
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <main class="flex items-center justify-center min-h-[80vh] px-4">
      <div class="max-w-md w-full text-center">
        <div
          class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
          style="background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280)); box-shadow: 0 16px 48px oklch(0.32 0.09 295 / 0.3);"
        >
          <CheckCircle :size="44" class="text-white" />
        </div>

        <div class="mb-2">
          <p class="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">Order confirmed</p>
          <h1 class="text-3xl font-bold text-foreground mb-3 tracking-tight">Thank you! 🎉</h1>
          <p class="text-muted-foreground leading-relaxed">
            Your order has been placed successfully. We'll send you a confirmation email with tracking details.
          </p>
        </div>

        <div
          class="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border my-8"
          style="border-color: oklch(0.88 0.008 85); background: oklch(0.975 0.006 85);"
        >
          <Package :size="20" style="color: oklch(0.45 0.12 295);" />
          <div class="text-left">
            <p class="text-xs text-muted-foreground">Order number</p>
            <p class="font-bold text-foreground">{{ orderNumber }}</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <RouterLink
            to="/account/orders"
            class="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
            style="background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280));"
          >
            Track Order <ArrowRight :size="16" />
          </RouterLink>
          <RouterLink
            to="/products"
            class="flex items-center justify-center px-6 py-3 rounded-xl border font-semibold text-sm transition-all"
            style="border-color: oklch(0.88 0.008 85);"
          >
            Continue Shopping
          </RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>
