<script setup lang="ts">
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    <div
      v-for="i in 8"
      :key="i"
      class="rounded-2xl overflow-hidden border"
      style="border-color: oklch(0.88 0.008 85);"
    >
      <div class="aspect-square bg-muted animate-pulse" />
      <div class="p-4 space-y-2.5">
        <div class="h-3 bg-muted rounded-full animate-pulse w-1/3" />
        <div class="h-4 bg-muted rounded-full animate-pulse w-4/5" />
        <div class="h-4 bg-muted rounded-full animate-pulse w-3/5" />
        <div class="flex items-center gap-2 mt-3">
          <div class="h-5 bg-muted rounded-full animate-pulse w-16" />
          <div class="h-4 bg-muted rounded-full animate-pulse w-12" />
        </div>
        <div class="h-9 bg-muted rounded-xl animate-pulse mt-2" />
      </div>
    </div>
  </div>
</template>
