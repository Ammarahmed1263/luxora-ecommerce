<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-vue-next'

interface Props {
  images: { url: string; alt?: string }[]
  productName?: string
}

const props = defineProps<Props>()
const activeIndex = ref(0)
const zoomOpen = ref(false)

const activeImage = computed(() => props.images[activeIndex.value])

function prev() {
  activeIndex.value = (activeIndex.value - 1 + props.images.length) % props.images.length
}

function next() {
  activeIndex.value = (activeIndex.value + 1) % props.images.length
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Main image -->
    <div class="relative aspect-square rounded-2xl overflow-hidden bg-muted group cursor-zoom-in" style="border: 1px solid oklch(0.88 0.008 85);" @click="zoomOpen = true">
      <img
        :src="activeImage?.url"
        :alt="activeImage?.alt || productName"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <!-- Zoom hint -->
      <div class="absolute top-3 right-3 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200" style="background: oklch(1 0 0 / 0.85); backdrop-filter: blur(8px);">
        <ZoomIn :size="16" class="text-foreground" />
      </div>
      <!-- Nav arrows -->
      <template v-if="props.images.length > 1">
        <button
          @click.stop="prev"
          class="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
          style="background: oklch(1 0 0 / 0.9); backdrop-filter: blur(8px);"
          aria-label="Previous image"
        >
          <ChevronLeft :size="18" class="text-foreground" />
        </button>
        <button
          @click.stop="next"
          class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
          style="background: oklch(1 0 0 / 0.9); backdrop-filter: blur(8px);"
          aria-label="Next image"
        >
          <ChevronRight :size="18" class="text-foreground" />
        </button>
      </template>
    </div>

    <!-- Thumbnail strip -->
    <div v-if="props.images.length > 1" class="flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="(img, i) in props.images"
        :key="i"
        @click="activeIndex = i"
        class="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200"
        :style="i === activeIndex
          ? 'border-color: oklch(0.32 0.09 295);'
          : 'border-color: oklch(0.88 0.008 85); opacity: 0.7;'"
        :aria-label="`View image ${i + 1}`"
      >
        <img :src="img.url" :alt="img.alt || `Image ${i + 1}`" class="w-full h-full object-cover" />
      </button>
    </div>

    <!-- Zoom Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="zoomOpen"
          class="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style="background: oklch(0 0 0 / 0.85); backdrop-filter: blur(4px);"
          @click.self="zoomOpen = false"
        >
          <div class="relative max-w-3xl w-full max-h-[90vh] rounded-2xl overflow-hidden">
            <img
              :src="activeImage?.url"
              :alt="activeImage?.alt || productName"
              class="w-full h-full object-contain"
            />
            <button
              @click="zoomOpen = false"
              class="absolute top-3 right-3 p-2 rounded-xl"
              style="background: oklch(1 0 0 / 0.15); color: white;"
              aria-label="Close zoom"
            >
              <X :size="20" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 250ms; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
