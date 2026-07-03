<script setup lang="ts">
import { ref } from "vue";
import { User, Camera, Loader2, Save } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/composables/useToast";
import { usersService } from "@/services/api/users.service";
import type { User as AppUser } from '@/types/auth.types';

const authStore = useAuthStore();
const { toast } = useToast();
const saving = ref(false);

const form = ref({
  firstName: authStore.user?.firstName ?? "",
  lastName: authStore.user?.lastName ?? "",
  phone: (authStore.user as AppUser | null)?.phone ?? "",
  address: {
    addressLine1: (authStore.user as any)?.address?.addressLine1 ?? "",
    city: (authStore.user as any)?.address?.city ?? "",
    country: (authStore.user as any)?.address?.country ?? "",
    postalCode: (authStore.user as any)?.address?.postalCode ?? "",
  },
});

async function handleSave() {
  saving.value = true;
  try {
    await usersService.updateMe(form.value);
    await authStore.fetchMe();
    toast({ title: "Profile updated successfully!" });
  } catch {
    toast({ title: "Failed to update profile", variant: "destructive" });
  } finally {
    saving.value = false;
  }
}

function getInitials() {
  const u = authStore.user;
  return `${u?.firstName?.[0] ?? ""}${u?.lastName?.[0] ?? ""}`.toUpperCase();
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-foreground tracking-tight">
        My Profile
      </h1>
      <p class="text-muted-foreground text-sm mt-1">
        Manage your personal information and preferences
      </p>
    </div>

    <div
      class="flex items-center gap-5 p-6 rounded-2xl border mb-6"
      style="
        border-color: oklch(0.88 0.008 85);
        background: oklch(0.975 0.006 85);
      "
    >
      <div class="relative group">
        <div class="w-20 h-20 rounded-full overflow-hidden shrink-0">
          <img
            v-if="authStore.user?.avatar"
            :src="authStore.user.avatar"
            :alt="authStore.user.firstName"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-white text-xl font-bold"
            style="
              background: linear-gradient(
                135deg,
                oklch(0.32 0.09 295),
                oklch(0.45 0.12 280)
              );
            "
          >
            {{ getInitials() }}
          </div>
        </div>
        <button
          class="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          style="background: oklch(0 0 0 / 0.4)"
        >
          <Camera :size="20" class="text-white" />
        </button>
      </div>
      <div>
        <p class="font-bold text-foreground">
          {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
        </p>
        <p class="text-sm text-muted-foreground">{{ authStore.user?.email }}</p>
        <button
          class="text-xs font-semibold mt-1.5 transition-colors"
          style="color: oklch(0.45 0.12 295)"
        >
          Change avatar
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">
      <div
        class="p-6 rounded-2xl border"
        style="border-color: oklch(0.88 0.008 85)"
      >
        <h2 class="font-bold text-foreground mb-4">Personal Information</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-foreground"
              >First Name</label
            >
            <input
              v-model="form.firstName"
              class="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none"
              style="
                background: oklch(0.975 0.006 85);
                border-color: oklch(0.88 0.008 85);
              "
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-foreground"
              >Last Name</label
            >
            <input
              v-model="form.lastName"
              class="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none"
              style="
                background: oklch(0.975 0.006 85);
                border-color: oklch(0.88 0.008 85);
              "
            />
          </div>
          <div class="space-y-1.5 col-span-2">
            <label class="text-sm font-semibold text-foreground">Phone</label>
            <input
              v-model="form.phone"
              type="tel"
              class="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none"
              style="
                background: oklch(0.975 0.006 85);
                border-color: oklch(0.88 0.008 85);
              "
              placeholder="+20 1012 345 678"
            />
          </div>
        </div>
      </div>

      <div
        class="p-6 rounded-2xl border"
        style="border-color: oklch(0.88 0.008 85)"
      >
        <h2 class="font-bold text-foreground mb-4">Default Address</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5 col-span-2">
            <label class="text-sm font-semibold text-foreground"
              >Street Address</label
            >
            <input
              v-model="form.address.addressLine1"
              class="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none"
              style="
                background: oklch(0.975 0.006 85);
                border-color: oklch(0.88 0.008 85);
              "
              placeholder="123 Main Street"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-foreground">City</label>
            <input
              v-model="form.address.city"
              class="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none"
              style="
                background: oklch(0.975 0.006 85);
                border-color: oklch(0.88 0.008 85);
              "
              placeholder="Cairo"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-foreground"
              >Postal Code</label
            >
            <input
              v-model="form.address.postalCode"
              class="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none"
              style="
                background: oklch(0.975 0.006 85);
                border-color: oklch(0.88 0.008 85);
              "
              placeholder="11511"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="saving"
        class="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
        style="
          background: linear-gradient(
            135deg,
            oklch(0.32 0.09 295),
            oklch(0.45 0.12 280)
          );
        "
      >
        <Loader2 v-if="saving" :size="16" class="animate-spin" />
        <Save v-else :size="16" />
        {{ saving ? "Saving…" : "Save Changes" }}
      </button>
    </form>
  </div>
</template>
