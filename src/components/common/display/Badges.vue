<script setup lang="ts">
interface Props {
  variant: 'sale' | 'new' | 'featured' | 'out-of-stock' | 'trending' | 'verified'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), { size: 'sm' })

const config = {
  sale:        { label: 'Sale',       bg: 'bg-rose-500',   text: 'text-white' },
  new:         { label: 'New',        bg: 'bg-emerald-500', text: 'text-white' },
  featured:    { label: 'Featured',   bg: 'gradient-primary', text: 'text-white' },
  'out-of-stock': { label: 'Sold Out', bg: 'bg-zinc-400',  text: 'text-white' },
  trending:    { label: 'Trending 🔥', bg: 'bg-orange-500', text: 'text-white' },
  verified:    { label: '✓ Verified', bg: 'bg-primary/10', text: 'text-primary' },
}
</script>

<template>
  <span
    class="inline-flex items-center font-semibold rounded-lg leading-none"
    :class="[
      config[props.variant].bg,
      config[props.variant].text,
      props.size === 'sm' ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs',
    ]"
  >
    {{ config[props.variant].label }}
  </span>
</template>
