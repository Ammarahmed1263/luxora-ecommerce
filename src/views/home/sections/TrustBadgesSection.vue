<script setup lang="ts">
import { Truck, RotateCcw, ShieldCheck, Headphones, CreditCard } from 'lucide-vue-next'

const badges = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On all orders over $99',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day hassle-free returns',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: 'SSL encrypted checkout',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Expert help anytime',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payment',
    description: 'Pay your way, always',
  },
]
</script>

<template>
  <section class="py-14 border-y border-border bg-muted/30">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div
          v-for="badge in badges"
          :key="badge.title"
          class="flex flex-col items-center text-center gap-3 group"
        >
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
            style="background: oklch(0.32 0.09 295 / 0.08); color: oklch(0.32 0.09 295);">
            <component :is="badge.icon" :size="22" />
          </div>
          <div>
            <p class="font-semibold text-foreground text-sm">{{ badge.title }}</p>
            <p class="text-muted-foreground text-xs mt-0.5">{{ badge.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
