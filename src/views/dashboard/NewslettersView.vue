<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Mail, Search, Download, FileText, CheckCircle2, XCircle } from 'lucide-vue-next'
import { newsletterService } from '@/services/api/newsletter.service'
import type { Subscriber } from '@/services/api/newsletter.service'
import type { AdminPaginatedResult } from '@/types/admin.types'
import { useToast } from '@/composables/useToast'

const { toast } = useToast()
const loading = ref(true)
const result = ref<AdminPaginatedResult<Subscriber> | null>(null)
const search = ref('')
const page = ref(1)
const limit = 10

async function fetchSubscribers(showSpinner = true) {
  if (showSpinner) loading.value = true
  try {
    result.value = await newsletterService.getSubscribers({
      page: page.value,
      limit,
      search: search.value,
    })
  } finally {
    if (showSpinner) loading.value = false
  }
}

onMounted(() => fetchSubscribers())
watch([page], () => fetchSubscribers())

let searchTimeout: ReturnType<typeof setTimeout>
function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { page.value = 1; fetchSubscribers(false) }, 350)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function exportCsv() {
  if (!result.value?.data || result.value.data.length === 0) return
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Email,Status,Subscribed At\n"
    + result.value.data.map(e => `${e.email},${e.isActive ? 'Active' : 'Unsubscribed'},${e.createdAt}`).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "newsletter_subscribers.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight" style="color: oklch(0.14 0.02 280);">Newsletter Subscribers</h1>
        <p class="text-sm mt-0.5" style="color: oklch(0.52 0.015 285);">
          Manage email newsletter subscriptions · <span class="font-semibold">{{ result?.total ?? 0 }} total</span>
        </p>
      </div>
      <button
        @click="exportCsv"
        class="flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-primary font-medium text-sm transition-all hover:bg-primary/5 active:scale-95 border border-primary/20"
      >
        <Download :size="16" />
        Export CSV
      </button>
    </div>

    <!-- Search -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1 max-w-sm">
        <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2" style="color: oklch(0.65 0.015 285);" />
        <input
          v-model="search"
          @input="onSearchInput"
          placeholder="Search by email..."
          class="w-full h-10 pl-9 pr-4 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.51_0.22_291)] transition-shadow"
          style="background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.14 0.02 280);"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border overflow-hidden shadow-sm" style="border-color: oklch(0.88 0.008 85);">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase bg-gray-50 text-gray-500 border-b" style="border-color: oklch(0.88 0.008 85);">
            <tr>
              <th scope="col" class="px-6 py-4 font-semibold tracking-wider">Email Address</th>
              <th scope="col" class="px-6 py-4 font-semibold tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 font-semibold tracking-wider">Subscribed Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="border-b border-gray-100">
              <td colspan="3" class="px-6 py-8 text-center">
                <Loader2 :size="24" class="mx-auto animate-spin text-gray-400" />
              </td>
            </tr>
            <tr v-else-if="result?.data.length === 0" class="border-b border-gray-100">
              <td colspan="3" class="px-6 py-12 text-center">
                <Mail :size="40" class="mx-auto mb-3 text-gray-300" />
                <p class="font-semibold text-gray-900">No subscribers found</p>
                <p class="text-sm mt-1 text-gray-500">No one has subscribed to the newsletter yet.</p>
              </td>
            </tr>
            <tr
              v-for="sub in result?.data"
              :key="sub._id"
              class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors last:border-0"
            >
              <td class="px-6 py-4 font-medium" style="color: oklch(0.14 0.02 280);">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-medium text-xs">
                    {{ sub.email.charAt(0).toUpperCase() }}
                  </div>
                  {{ sub.email }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1.5" :class="sub.isActive ? 'text-green-600' : 'text-red-500'">
                  <CheckCircle2 v-if="sub.isActive" :size="16" />
                  <XCircle v-else :size="16" />
                  <span class="font-medium text-xs uppercase tracking-wider">{{ sub.isActive ? 'Active' : 'Unsubscribed' }}</span>
                </div>
              </td>
              <td class="px-6 py-4" style="color: oklch(0.52 0.015 285);">
                {{ formatDate(sub.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
