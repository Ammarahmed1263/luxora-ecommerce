<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShoppingCart, Heart, Share2, Store, Loader2, ChevronRight } from 'lucide-vue-next'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ProductGallery from '@/components/common/product/ProductGallery.vue'
import ProductGrid from '@/components/common/product/ProductGrid.vue'
import QuantitySelector from '@/components/common/commerce/QuantitySelector.vue'
import PriceComponent from '@/components/common/commerce/PriceComponent.vue'
import RatingComponent from '@/components/common/feedback/RatingComponent.vue'
import ReviewCard from '@/components/common/feedback/ReviewCard.vue'
import WishlistButton from '@/components/common/commerce/WishlistButton.vue'
import Badges from '@/components/common/display/Badges.vue'
import { useCartStore } from '@/stores/cart.store'
import { useToast } from '@/composables/useToast'
import { dummyProducts } from '@/lib/dummyData'
import type { Product } from '@/types/product.types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const { toast } = useToast()

const product = ref<Product | null>(null)
const loading = ref(true)
const quantity = ref(1)
const adding = ref(false)
const activeTab = ref<'description' | 'specs' | 'reviews'>('description')

onMounted(() => {
  const slug = route.params.slug as string
  const found = dummyProducts.find(p => p.slug === slug)
  if (found) {
    product.value = found
    document.title = `${found.name} — Luxora`
  } else {
    router.push({ name: 'not-found' })
  }
  loading.value = false
})

const relatedProducts = computed(() =>
  dummyProducts.filter(p => p.id !== product.value?.id).slice(0, 4)
)

const isOutOfStock = computed(() => product.value?.stock === 0)

async function addToCart() {
  if (!product.value || isOutOfStock.value || adding.value) return
  adding.value = true
  try {
    await cartStore.addItem({ productId: product.value.id, quantity: quantity.value })
    toast({ title: 'Added to cart!', description: `${product.value.name} × ${quantity.value}` })
  } finally {
    adding.value = false
  }
}

const dummyReviews = [
  {
    id: 'rev_1',
    authorName: 'Emma Johnson',
    rating: 5,
    title: 'Absolutely stunning quality',
    body: 'I was blown away by the build quality and design. Worth every penny — this feels like a premium product from a world-class brand.',
    date: '2026-05-14T10:00:00Z',
    verified: true,
    helpful: 24,
  },
  {
    id: 'rev_2',
    authorName: 'James Martinez',
    rating: 4,
    title: 'Exceptional, with minor caveats',
    body: 'Almost perfect — the performance is outstanding and the packaging was beautiful. Delivery was slightly delayed but support was helpful.',
    date: '2026-04-22T14:00:00Z',
    verified: true,
    helpful: 11,
  },
]
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <main class="container mx-auto px-4 lg:px-8 py-10" v-if="product">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 flex-wrap">
        <RouterLink to="/" class="hover:text-foreground transition-colors">Home</RouterLink>
        <ChevronRight :size="14" />
        <RouterLink to="/products" class="hover:text-foreground transition-colors">Products</RouterLink>
        <ChevronRight :size="14" />
        <RouterLink :to="`/categories/${product.category.slug}`" class="hover:text-foreground transition-colors">{{ product.category.name }}</RouterLink>
        <ChevronRight :size="14" />
        <span class="text-foreground font-medium line-clamp-1">{{ product.name }}</span>
      </nav>

      <!-- Product grid -->
      <div class="grid lg:grid-cols-2 gap-12 xl:gap-16 mb-16">
        <!-- Gallery -->
        <div>
          <ProductGallery :images="product.images.length ? product.images : [{ url: product.thumbnail, alt: product.name }]" :product-name="product.name" />
        </div>

        <!-- Details -->
        <div class="flex flex-col gap-5">
          <!-- Badges -->
          <div class="flex items-center gap-2 flex-wrap">
            <Badges v-if="product.isFeatured" variant="featured" />
            <Badges v-if="product.stock === 0" variant="out-of-stock" />
            <Badges v-if="product.stock > 0 && product.stock <= 5" variant="trending" />
          </div>

          <!-- Category -->
          <RouterLink
            :to="`/categories/${product.category.slug}`"
            class="text-xs font-bold uppercase tracking-widest transition-colors"
            style="color: oklch(0.45 0.12 295);"
          >
            {{ product.category.name }}
          </RouterLink>

          <!-- Name -->
          <h1 class="text-3xl xl:text-4xl font-bold text-foreground tracking-tight leading-tight">
            {{ product.name }}
          </h1>

          <!-- Rating -->
          <RatingComponent :rating="product.rating.average" :count="product.rating.count" show-count />

          <!-- Price -->
          <PriceComponent :amount="product.price" :currency="product.currency" class="text-2xl" />

          <!-- Description (short) -->
          <p class="text-muted-foreground leading-relaxed text-sm">{{ product.description }}</p>

          <!-- Stock status -->
          <div class="flex items-center gap-2 text-sm">
            <div
              class="w-2 h-2 rounded-full"
              :style="product.stock > 0 ? 'background: oklch(0.6 0.18 160);' : 'background: oklch(0.57 0.24 27);'"
            />
            <span :class="product.stock > 0 ? 'text-emerald-600' : 'text-red-500'" class="font-medium">
              {{ product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock' }}
            </span>
          </div>

          <!-- Vendor -->
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <Store :size="14" />
            Sold by
            <RouterLink
              :to="`/vendors/${product.vendor.id}`"
              class="font-semibold hover:underline transition-colors"
              style="color: oklch(0.45 0.12 295);"
            >
              {{ product.vendor.storeName }}
            </RouterLink>
          </div>

          <!-- Divider -->
          <div class="h-px bg-border" />

          <!-- Quantity -->
          <div class="flex items-center gap-4">
            <span class="text-sm font-semibold text-foreground">Quantity:</span>
            <QuantitySelector v-model="quantity" :max="product.stock" :disabled="isOutOfStock" />
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="addToCart"
              :disabled="isOutOfStock || adding"
              class="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style="background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280)); box-shadow: 0 4px 14px oklch(0.32 0.09 295 / 0.3);"
              onmouseenter="if(!this.disabled) { this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px oklch(0.32 0.09 295 / 0.42)'; }"
              onmouseleave="this.style.transform=''; this.style.boxShadow='0 4px 14px oklch(0.32 0.09 295 / 0.3)';"
            >
              <Loader2 v-if="adding" :size="18" class="animate-spin" />
              <template v-else>
                <ShoppingCart :size="18" />
                {{ isOutOfStock ? 'Out of Stock' : 'Add to Cart' }}
              </template>
            </button>
            <WishlistButton :product-id="product.id" />
            <button
              class="h-12 w-12 rounded-xl border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200"
              style="border-color: oklch(0.88 0.008 85);"
              aria-label="Share product"
            >
              <Share2 :size="18" />
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-10">
        <div class="flex border-b gap-1" style="border-color: oklch(0.88 0.008 85);">
          <button
            v-for="tab in (['description', 'specs', 'reviews'] as const)"
            :key="tab"
            @click="activeTab = tab"
            class="px-5 py-3 text-sm font-medium capitalize transition-all duration-200 border-b-2 -mb-px"
            :style="activeTab === tab
              ? 'border-color: oklch(0.32 0.09 295); color: oklch(0.32 0.09 295);'
              : 'border-color: transparent; color: oklch(0.52 0.015 285);'"
          >
            {{ tab }}{{ tab === 'reviews' ? ` (${dummyReviews.length})` : '' }}
          </button>
        </div>

        <div class="py-8">
          <!-- Description -->
          <div v-if="activeTab === 'description'" class="max-w-2xl">
            <p class="text-muted-foreground leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Specs -->
          <div v-else-if="activeTab === 'specs'" class="max-w-lg">
            <div class="divide-y" style="border-color: oklch(0.88 0.008 85);">
              <div v-for="(spec, i) in [['Brand', product.vendor.storeName], ['Category', product.category.name], ['Stock', `${product.stock} units`], ['SKU', product.id]]" :key="i" class="flex py-3">
                <span class="w-32 text-sm text-muted-foreground font-medium">{{ spec[0] }}</span>
                <span class="text-sm text-foreground font-medium">{{ spec[1] }}</span>
              </div>
            </div>
          </div>

          <!-- Reviews -->
          <div v-else-if="activeTab === 'reviews'" class="space-y-4 max-w-2xl">
            <ReviewCard
              v-for="review in dummyReviews"
              :key="review.id"
              v-bind="review"
            />
          </div>
        </div>
      </div>

      <!-- Related products -->
      <div v-if="relatedProducts.length">
        <h2 class="text-2xl font-bold text-foreground mb-6 tracking-tight">You might also like</h2>
        <ProductGrid :products="relatedProducts" />
      </div>
    </main>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <Loader2 :size="32" class="animate-spin text-muted-foreground" />
    </div>

    <AppFooter />
  </div>
</template>
