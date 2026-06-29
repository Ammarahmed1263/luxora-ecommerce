<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-vue-next'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface Props {
  categories?: FilterOption[]
  brands?: FilterOption[]
  selectedCategories?: string[]
  selectedBrands?: string[]
  priceMin?: number
  priceMax?: number
  selectedRating?: number | null
  inStockOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  brands: () => [],
  selectedCategories: () => [],
  selectedBrands: () => [],
  priceMin: 0,
  priceMax: 5000,
  selectedRating: null,
  inStockOnly: false,
})

const emit = defineEmits<{
  'update:selectedCategories': [value: string[]]
  'update:selectedBrands': [value: string[]]
  'update:priceMin': [value: number]
  'update:priceMax': [value: number]
  'update:selectedRating': [value: number | null]
  'update:inStockOnly': [value: boolean]
  'reset': []
}>()

const openSections = ref({ categories: true, brands: true, price: true, rating: true, stock: true })

function toggleCategory(val: string) {
  const current = [...props.selectedCategories]
  const idx = current.indexOf(val)
  if (idx > -1) current.splice(idx, 1)
  else current.push(val)
  emit('update:selectedCategories', current)
}

function toggleBrand(val: string) {
  const current = [...props.selectedBrands]
  const idx = current.indexOf(val)
  if (idx > -1) current.splice(idx, 1)
  else current.push(val)
  emit('update:selectedBrands', current)
}

const hasActiveFilters = computed(() =>
  props.selectedCategories.length > 0 ||
  props.selectedBrands.length > 0 ||
  props.selectedRating !== null ||
  props.inStockOnly
)
</script>

<template>
  <aside class="w-64 flex-shrink-0 space-y-1">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <SlidersHorizontal :size="16" class="text-foreground" />
        <h2 class="font-bold text-foreground text-sm">Filters</h2>
      </div>
      <button
        v-if="hasActiveFilters"
        @click="emit('reset')"
        class="text-xs font-medium flex items-center gap-1 transition-colors"
        style="color: oklch(0.45 0.12 295);"
      >
        <X :size="12" /> Clear all
      </button>
    </div>

    <!-- Categories -->
    <div v-if="props.categories.length" class="rounded-xl border overflow-hidden" style="border-color: oklch(0.88 0.008 85);">
      <button
        class="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
        @click="openSections.categories = !openSections.categories"
      >
        Categories
        <ChevronDown :size="16" :class="openSections.categories ? 'rotate-180' : ''" class="transition-transform duration-200 text-muted-foreground" />
      </button>
      <div v-if="openSections.categories" class="px-4 pb-4 space-y-2 border-t" style="border-color: oklch(0.88 0.008 85 / 0.5);">
        <label
          v-for="cat in props.categories"
          :key="cat.value"
          class="flex items-center gap-2.5 cursor-pointer group pt-2"
        >
          <input
            type="checkbox"
            :value="cat.value"
            :checked="props.selectedCategories.includes(cat.value)"
            @change="toggleCategory(cat.value)"
            class="w-4 h-4 rounded accent-primary cursor-pointer"
          />
          <span class="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">{{ cat.label }}</span>
          <span v-if="cat.count" class="text-xs text-muted-foreground">({{ cat.count }})</span>
        </label>
      </div>
    </div>

    <!-- Brands -->
    <div v-if="props.brands.length" class="rounded-xl border overflow-hidden" style="border-color: oklch(0.88 0.008 85);">
      <button
        class="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
        @click="openSections.brands = !openSections.brands"
      >
        Brands
        <ChevronDown :size="16" :class="openSections.brands ? 'rotate-180' : ''" class="transition-transform duration-200 text-muted-foreground" />
      </button>
      <div v-if="openSections.brands" class="px-4 pb-4 space-y-2 border-t max-h-48 overflow-y-auto" style="border-color: oklch(0.88 0.008 85 / 0.5);">
        <label
          v-for="brand in props.brands"
          :key="brand.value"
          class="flex items-center gap-2.5 cursor-pointer group pt-2"
        >
          <input
            type="checkbox"
            :value="brand.value"
            :checked="props.selectedBrands.includes(brand.value)"
            @change="toggleBrand(brand.value)"
            class="w-4 h-4 rounded accent-primary cursor-pointer"
          />
          <span class="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">{{ brand.label }}</span>
          <span v-if="brand.count" class="text-xs text-muted-foreground">({{ brand.count }})</span>
        </label>
      </div>
    </div>

    <!-- Price Range -->
    <div class="rounded-xl border overflow-hidden" style="border-color: oklch(0.88 0.008 85);">
      <button
        class="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
        @click="openSections.price = !openSections.price"
      >
        Price Range
        <ChevronDown :size="16" :class="openSections.price ? 'rotate-180' : ''" class="transition-transform duration-200 text-muted-foreground" />
      </button>
      <div v-if="openSections.price" class="px-4 pb-4 pt-3 border-t" style="border-color: oklch(0.88 0.008 85 / 0.5);">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xs text-muted-foreground">${{ props.priceMin }}</span>
          <span class="text-xs text-muted-foreground mx-auto">—</span>
          <span class="text-xs text-muted-foreground">${{ props.priceMax }}</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <input
            :value="props.priceMin"
            @change="emit('update:priceMin', +($event.target as HTMLInputElement).value)"
            type="number"
            placeholder="Min"
            class="h-9 w-full rounded-lg border px-3 text-xs focus:outline-none bg-background"
            style="border-color: oklch(0.88 0.008 85);"
          />
          <input
            :value="props.priceMax"
            @change="emit('update:priceMax', +($event.target as HTMLInputElement).value)"
            type="number"
            placeholder="Max"
            class="h-9 w-full rounded-lg border px-3 text-xs focus:outline-none bg-background"
            style="border-color: oklch(0.88 0.008 85);"
          />
        </div>
      </div>
    </div>

    <!-- Rating -->
    <div class="rounded-xl border overflow-hidden" style="border-color: oklch(0.88 0.008 85);">
      <button
        class="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
        @click="openSections.rating = !openSections.rating"
      >
        Min Rating
        <ChevronDown :size="16" :class="openSections.rating ? 'rotate-180' : ''" class="transition-transform duration-200 text-muted-foreground" />
      </button>
      <div v-if="openSections.rating" class="px-4 pb-4 space-y-2 border-t" style="border-color: oklch(0.88 0.008 85 / 0.5);">
        <button
          v-for="r in [4, 3, 2, 1]"
          :key="r"
          @click="emit('update:selectedRating', props.selectedRating === r ? null : r)"
          class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all duration-150 mt-2"
          :style="props.selectedRating === r ? 'background: oklch(0.32 0.09 295 / 0.1); color: oklch(0.32 0.09 295);' : 'color: oklch(0.52 0.015 285);'"
        >
          <span class="text-amber-400">{{ '★'.repeat(r) }}</span>
          <span class="text-muted-foreground text-xs">& above</span>
        </button>
      </div>
    </div>

    <!-- Stock -->
    <div class="rounded-xl border overflow-hidden" style="border-color: oklch(0.88 0.008 85);">
      <label class="flex items-center justify-between px-4 py-3 cursor-pointer">
        <span class="text-sm font-semibold text-foreground">In Stock Only</span>
        <button
          role="switch"
          :aria-checked="props.inStockOnly"
          @click="emit('update:inStockOnly', !props.inStockOnly)"
          class="relative w-10 h-5 rounded-full transition-all duration-200"
          :style="props.inStockOnly ? 'background: oklch(0.32 0.09 295);' : 'background: oklch(0.88 0.008 85);'"
        >
          <div
            class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
            :style="props.inStockOnly ? 'left: 1.25rem;' : 'left: 0.125rem;'"
          />
        </button>
      </label>
    </div>
  </aside>
</template>
