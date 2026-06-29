<script setup lang="ts">
import { ref } from 'vue'
import { Mail, ArrowRight, Loader2 } from 'lucide-vue-next'

const email = ref('')
const loading = ref(false)
const subscribed = ref(false)

async function handleSubscribe() {
  if (!email.value || !email.value.includes('@')) return
  loading.value = true
  await new Promise(r => setTimeout(r, 900))
  subscribed.value = true
  loading.value = false
}
</script>

<template>
  <section class="py-20 relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0" style="background: linear-gradient(135deg, oklch(0.32 0.09 295 / 0.05), oklch(0.45 0.12 280 / 0.08));" />
    <div class="blob absolute w-96 h-96 top-[-80px] right-[-60px] opacity-[0.07]" style="background: oklch(0.32 0.09 295);" />

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <div class="max-w-xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-sm font-medium"
          style="background: oklch(0.32 0.09 295 / 0.08); color: oklch(0.32 0.09 295); border: 1px solid oklch(0.32 0.09 295 / 0.2);">
          <Mail :size="14" />
          Newsletter
        </div>

        <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4 tracking-tight">
          Stay ahead of the curve
        </h2>
        <p class="text-muted-foreground leading-relaxed mb-8">
          Get early access to new arrivals, exclusive offers, and curated style edits delivered to your inbox.
        </p>

        <!-- Subscribed state -->
        <div v-if="subscribed" class="flex flex-col items-center gap-3">
          <div class="w-14 h-14 rounded-full flex items-center justify-center"
            style="background: oklch(0.32 0.09 295 / 0.1); color: oklch(0.32 0.09 295);">
            <Mail :size="24" />
          </div>
          <p class="font-semibold text-foreground">You're in! Check your inbox ✨</p>
          <p class="text-muted-foreground text-sm">We'll send you the best deals and new arrivals.</p>
        </div>

        <!-- Subscribe form -->
        <div v-else class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email address"
            @keydown.enter="handleSubscribe"
            class="flex-1 h-12 px-4 rounded-xl text-sm border bg-background focus:outline-none transition-all duration-200"
            style="border-color: oklch(0.88 0.008 85); background: oklch(0.975 0.006 85);"
          />
          <button
            @click="handleSubscribe"
            :disabled="loading"
            class="h-12 px-6 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 flex-shrink-0"
            style="background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280)); box-shadow: 0 4px 14px oklch(0.32 0.09 295 / 0.3);"
          >
            <Loader2 v-if="loading" :size="16" class="animate-spin" />
            <template v-else>Subscribe <ArrowRight :size="15" /></template>
          </button>
        </div>

        <p class="text-xs text-muted-foreground mt-4">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </div>
  </section>
</template>
