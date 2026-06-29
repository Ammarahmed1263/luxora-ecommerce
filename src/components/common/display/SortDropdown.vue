<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

interface SortOption {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options?: SortOption[]
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
  ],
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const currentLabel = () => props.options.find(o => o.value === props.modelValue)?.label ?? 'Sort By'
</script>

<template>
  <div class="relative inline-block">
    <select
      :value="props.modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="appearance-none h-10 pl-4 pr-9 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 focus:outline-none"
      style="background: oklch(0.975 0.006 85); border: 1px solid oklch(0.88 0.008 85); color: oklch(0.14 0.02 280);"
    >
      <option v-for="opt in props.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <ChevronDown
      :size="15"
      class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
    />
  </div>
</template>
