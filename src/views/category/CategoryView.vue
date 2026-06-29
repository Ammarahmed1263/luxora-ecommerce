<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ProductGrid from '@/components/common/product/ProductGrid.vue'
import SortDropdown from '@/components/common/display/SortDropdown.vue'
import FilterSidebar from '@/components/common/display/FilterSidebar.vue'
import Pagination from '@/components/common/display/Pagination.vue'
import SkeletonGrid from '@/components/common/display/SkeletonGrid.vue'
import { dummyProducts, dummyCategories } from '@/lib/dummyData'
import type { Category } from '@/types/product.types'

const route = useRoute()
const loading = ref(true)
const sort = ref('popularity')
const page = ref(1)

const category = computed<Category | undefined>(() =>
  dummyCategories.find(c => c.slug === route.params.slug)
)

const products = computed(() => {
  let filtered = dummyProducts.filter(p => p.category.slug === route.params.slug)
  if (sort.value === 'price_asc') filtered.sort((a, b) => a.price - b.price)
  else if (sort.value === 'price_desc') filtered.sort((a, b) => b.price - a.price)
  else if (sort.value === 'rating') filtered.sort((a, b) => b.rating.average - a.rating.average)
  return filtered
})

const totalPages = computed(() => Math.max(1, Math.ceil(products.value.length / 12)))
const paginatedProducts = computed(() => products.value.slice((page.value - 1) * 12, page.value * 12))

onMounted(() => {
  setTimeout(() => { loading.value = false }, 400)
  if (category.value) document.title = `${category.value.name} — Luxora`
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <!-- Category Hero -->
    <section class="relative h-52 overflow-hidden" v-if="category">
      <img
        :src="category.image"
        :alt="category.name"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0" style="background: oklch(0.14 0.02 280 / 0.6);" />
      <div class="relative z-10 flex flex-col justify-end h-full container mx-auto px-4 lg:px-8 pb-8">
        <p class="text-white/70 text-sm mb-1">{{ category.productCount }} products</p>
        <h1 class="text-4xl font-bold text-white tracking-tight">{{ category.name }}</h1>
      </div>
    </section>

    <main class="container mx-auto px-4 lg:px-8 py-10">
      <div class="flex gap-8">
        <!-- Sidebar -->
        <div class="hidden lg:block">
          <FilterSidebar />
        </div>

        <!-- Products -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <p class="text-sm text-muted-foreground">
              <span class="font-semibold text-foreground">{{ products.length }}</span> products
            </p>
            <SortDropdown v-model="sort" />
          </div>

          <SkeletonGrid v-if="loading" />
          <ProductGrid v-else :products="paginatedProducts" />

          <div v-if="totalPages > 1" class="mt-10">
            <Pagination v-model:page="page" :total-pages="totalPages" :total="products.length" />
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
