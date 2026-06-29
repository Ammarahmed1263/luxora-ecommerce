<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  page: number
  totalPages: number
  total?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:page': [value: number] }>()

function goTo(p: number) {
  if (p < 1 || p > props.totalPages) return
  emit('update:page', p)
}

const pages = computed(() => {
  const total = props.totalPages
  const cur = props.page
  const delta = 2
  const range: (number | '...')[] = []
  for (let i = Math.max(2, cur - delta); i <= Math.min(total - 1, cur + delta); i++) range.push(i)
  if ((range[0] as number) > 2) range.unshift('...')
  if ((range[range.length - 1] as number) < total - 1) range.push('...')
  if (total > 1) range.unshift(1)
  if (total > 1) range.push(total)
  return range
})
</script>

<template>
  <nav aria-label="Pagination" class="flex items-center justify-center gap-1 flex-wrap">
    <button
      @click="goTo(props.page - 1)"
      :disabled="props.page <= 1"
      class="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      style="border: 1px solid oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);"
      aria-label="Previous page"
    >
      <ChevronLeft :size="15" /> Prev
    </button>

    <button
      v-for="(p, i) in pages"
      :key="i"
      @click="typeof p === 'number' && goTo(p)"
      :disabled="p === '...'"
      class="w-9 h-9 rounded-xl text-sm font-medium transition-all duration-150"
      :style="p === props.page
        ? 'background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280)); color: white; border: none;'
        : p === '...'
          ? 'background: transparent; border: none; cursor: default; color: oklch(0.52 0.015 285);'
          : 'border: 1px solid oklch(0.88 0.008 85); color: oklch(0.52 0.015 285); background: transparent;'"
      :aria-label="p === '...' ? 'More pages' : `Page ${p}`"
      :aria-current="p === props.page ? 'page' : undefined"
    >
      {{ p }}
    </button>

    <button
      @click="goTo(props.page + 1)"
      :disabled="props.page >= props.totalPages"
      class="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      style="border: 1px solid oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);"
      aria-label="Next page"
    >
      Next <ChevronRight :size="15" />
    </button>
  </nav>
</template>
