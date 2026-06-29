<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Check, ChevronRight, CreditCard, Truck, ClipboardList, Loader2 } from 'lucide-vue-next'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import CartSummary from '@/components/common/commerce/CartSummary.vue'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const step = ref<1 | 2 | 3>(1)
const loading = ref(false)

const steps = [
  { id: 1, label: 'Shipping', icon: Truck },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: ClipboardList },
]

const shippingForm = ref({
  firstName: authStore.user?.firstName ?? '',
  lastName: authStore.user?.lastName ?? '',
  email: authStore.user?.email ?? '',
  phone: '',
  address: '',
  city: '',
  country: 'US',
  postalCode: '',
})

const paymentMethod = ref<'stripe' | 'paypal' | 'cod'>('stripe')

async function placeOrder() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1500))
  router.push({ name: 'order-success' })
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <main class="container mx-auto px-4 lg:px-8 py-10">
      <h1 class="text-3xl font-bold text-foreground tracking-tight mb-8">Checkout</h1>

      <!-- Step progress -->
      <div class="flex items-center mb-10 gap-0">
        <template v-for="(s, i) in steps" :key="s.id">
          <div class="flex items-center gap-2">
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
              :style="step > s.id
                ? 'background: oklch(0.6 0.18 160); color: white;'
                : step === s.id
                  ? 'background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280)); color: white; box-shadow: 0 4px 14px oklch(0.32 0.09 295 / 0.3);'
                  : 'background: oklch(0.94 0.005 85); color: oklch(0.52 0.015 285);'"
            >
              <Check v-if="step > s.id" :size="16" />
              <component v-else :is="s.icon" :size="16" />
            </div>
            <span class="text-sm font-medium hidden sm:block"
              :style="step === s.id ? 'color: oklch(0.32 0.09 295);' : 'color: oklch(0.52 0.015 285);'">
              {{ s.label }}
            </span>
          </div>
          <div v-if="i < steps.length - 1" class="flex-1 h-px mx-3" style="background: oklch(0.88 0.008 85);" />
        </template>
      </div>

      <div class="grid lg:grid-cols-3 gap-8 xl:gap-12">
        <!-- Form area -->
        <div class="lg:col-span-2">
          <!-- Step 1: Shipping -->
          <div v-if="step === 1" class="space-y-6">
            <div class="p-6 rounded-2xl border" style="border-color: oklch(0.88 0.008 85);">
              <h2 class="text-lg font-bold text-foreground mb-5">Shipping Address</h2>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-foreground">First Name</label>
                  <input v-model="shippingForm.firstName" class="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none transition-all" style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);" placeholder="Ali" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-foreground">Last Name</label>
                  <input v-model="shippingForm.lastName" class="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none transition-all" style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);" placeholder="Hassan" />
                </div>
                <div class="space-y-1.5 col-span-2">
                  <label class="text-sm font-semibold text-foreground">Street Address</label>
                  <input v-model="shippingForm.address" class="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none transition-all" style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);" placeholder="123 Main Street" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-foreground">City</label>
                  <input v-model="shippingForm.city" class="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none transition-all" style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);" placeholder="Cairo" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-foreground">Postal Code</label>
                  <input v-model="shippingForm.postalCode" class="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none transition-all" style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);" placeholder="11511" />
                </div>
              </div>
            </div>
            <button
              @click="step = 2"
              class="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
              style="background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280));"
            >
              Continue to Payment <ChevronRight :size="16" />
            </button>
          </div>

          <!-- Step 2: Payment -->
          <div v-else-if="step === 2" class="space-y-6">
            <div class="p-6 rounded-2xl border" style="border-color: oklch(0.88 0.008 85);">
              <h2 class="text-lg font-bold text-foreground mb-5">Payment Method</h2>
              <div class="space-y-3">
                <label
                  v-for="method in [{ id: 'stripe', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex', emoji: '💳' }, { id: 'paypal', label: 'PayPal', desc: 'Fast and secure', emoji: '🅿️' }, { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', emoji: '💵' }]"
                  :key="method.id"
                  class="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200"
                  :style="paymentMethod === method.id ? 'border-color: oklch(0.32 0.09 295); background: oklch(0.32 0.09 295 / 0.05);' : 'border-color: oklch(0.88 0.008 85);'"
                >
                  <input type="radio" :value="method.id" v-model="paymentMethod" class="accent-primary" />
                  <span class="text-xl">{{ method.emoji }}</span>
                  <div>
                    <p class="font-semibold text-sm text-foreground">{{ method.label }}</p>
                    <p class="text-xs text-muted-foreground">{{ method.desc }}</p>
                  </div>
                </label>
              </div>
            </div>
            <div class="flex gap-3">
              <button @click="step = 1" class="px-6 py-3 rounded-xl border text-sm font-medium" style="border-color: oklch(0.88 0.008 85);">
                Back
              </button>
              <button
                @click="step = 3"
                class="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
                style="background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280));"
              >
                Review Order <ChevronRight :size="16" />
              </button>
            </div>
          </div>

          <!-- Step 3: Review -->
          <div v-else class="space-y-6">
            <div class="p-6 rounded-2xl border space-y-4" style="border-color: oklch(0.88 0.008 85);">
              <h2 class="text-lg font-bold text-foreground">Order Review</h2>
              <div class="text-sm text-muted-foreground space-y-1">
                <p><span class="font-semibold text-foreground">Ship to:</span> {{ shippingForm.firstName }} {{ shippingForm.lastName }}, {{ shippingForm.address }}, {{ shippingForm.city }}</p>
                <p><span class="font-semibold text-foreground">Payment:</span> {{ paymentMethod === 'stripe' ? 'Credit Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery' }}</p>
              </div>
            </div>
            <div class="flex gap-3">
              <button @click="step = 2" class="px-6 py-3 rounded-xl border text-sm font-medium" style="border-color: oklch(0.88 0.008 85);">
                Back
              </button>
              <button
                @click="placeOrder"
                :disabled="loading"
                class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
                style="background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280));"
              >
                <Loader2 v-if="loading" :size="18" class="animate-spin" />
                <template v-else>Place Order</template>
              </button>
            </div>
          </div>
        </div>

        <!-- Order summary -->
        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <CartSummary :show-checkout-button="false" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
