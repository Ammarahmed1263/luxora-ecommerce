<script setup lang="ts">
import { Star, ThumbsUp, ShieldCheck } from 'lucide-vue-next'
import RatingComponent from '@/components/common/feedback/RatingComponent.vue'

interface ReviewImage {
  url: string
  alt?: string
}

interface Props {
  id: string
  authorName: string
  authorAvatar?: string
  rating: number
  title?: string
  body: string
  date: string
  verified?: boolean
  helpful?: number
  images?: ReviewImage[]
}

const props = defineProps<Props>()

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
</script>

<template>
  <div class="p-5 rounded-2xl border bg-card transition-all duration-200 hover:shadow-sm" style="border-color: oklch(0.88 0.008 85);">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4 mb-4">
      <div class="flex items-center gap-3">
        <!-- Avatar -->
        <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img v-if="props.authorAvatar" :src="props.authorAvatar" :alt="props.authorName" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-sm font-bold text-white"
            style="background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280));">
            {{ getInitials(props.authorName) }}
          </div>
        </div>
        <!-- Author info -->
        <div>
          <div class="flex items-center gap-1.5">
            <p class="font-semibold text-foreground text-sm">{{ props.authorName }}</p>
            <div v-if="props.verified" class="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
              style="background: oklch(0.72 0.08 160 / 0.15); color: oklch(0.45 0.1 160);">
              <ShieldCheck :size="9" />
              Verified
            </div>
          </div>
          <p class="text-xs text-muted-foreground">{{ formatDate(props.date) }}</p>
        </div>
      </div>
      <RatingComponent :rating="props.rating" :show-count="false" size="sm" />
    </div>

    <!-- Review title -->
    <p v-if="props.title" class="font-semibold text-foreground text-sm mb-1.5">{{ props.title }}</p>

    <!-- Review body -->
    <p class="text-muted-foreground text-sm leading-relaxed">{{ props.body }}</p>

    <!-- Images -->
    <div v-if="props.images?.length" class="flex gap-2 mt-3 flex-wrap">
      <div
        v-for="(img, i) in props.images"
        :key="i"
        class="w-16 h-16 rounded-xl overflow-hidden border"
        style="border-color: oklch(0.88 0.008 85);"
      >
        <img :src="img.url" :alt="img.alt || `Review image ${i + 1}`" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- Helpful -->
    <div v-if="props.helpful !== undefined" class="flex items-center gap-2 mt-4 pt-3 border-t" style="border-color: oklch(0.88 0.008 85 / 0.6);">
      <button class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ThumbsUp :size="13" />
        Helpful ({{ props.helpful }})
      </button>
    </div>
  </div>
</template>
