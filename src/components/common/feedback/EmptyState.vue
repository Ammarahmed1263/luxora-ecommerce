<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Package, Search, ShoppingBag, Heart, AlertCircle, Inbox } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: 'package' | 'search' | 'shopping-bag' | 'heart' | 'error' | 'inbox'
  actionLabel?: string
  actionTo?: string
  onAction?: () => void
}>(), {
  title: 'Nothing here yet',
  description: 'Check back later.',
  icon: 'inbox',
})

const emit = defineEmits<{ action: [] }>()

const iconComponent = computed(() => ({
  package: Package,
  search: Search,
  'shopping-bag': ShoppingBag,
  heart: Heart,
  error: AlertCircle,
  inbox: Inbox,
}[props.icon ?? 'inbox']))
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div class="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-6">
      <component :is="iconComponent" :size="28" class="text-muted-foreground/60" />
    </div>
    <h3 class="text-lg font-semibold text-foreground mb-2">{{ title }}</h3>
    <p class="text-sm text-muted-foreground max-w-sm mb-6">{{ description }}</p>
    <RouterLink
      v-if="actionLabel && actionTo"
      :to="actionTo"
      class="px-6 py-2.5 text-sm font-semibold rounded-xl text-white shadow-sm hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
      style="background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280));"
    >
      {{ actionLabel }}
    </RouterLink>
    <button
      v-else-if="actionLabel"
      @click="emit('action')"
      class="px-6 py-2.5 text-sm font-semibold rounded-xl text-white shadow-sm hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
      style="background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280));"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
