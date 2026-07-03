<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import {
  User,
  ShoppingBag,
  Heart,
  Star,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-vue-next";
import AppNavbar from "@/components/layout/AppNavbar.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const navItems = [
  { label: "Profile", to: "/account/profile", icon: User },
  { label: "Orders", to: "/account/orders", icon: ShoppingBag },
  { label: "Wishlist", to: "/account/wishlist", icon: Heart },
  { label: "My Reviews", to: "/account/reviews", icon: Star },
  { label: "Security", to: "/account/security", icon: Shield },
];

async function handleLogout() {
  await authStore.logout();
  router.push({ name: "home" });
}

function getInitials(name: string) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U"
  );
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <main class="container mx-auto px-4 lg:px-8 py-10">
      <div class="flex gap-8 lg:gap-10">
        <aside class="hidden lg:flex flex-col w-64 shrink-0 gap-2">
          <div
            class="p-5 rounded-2xl border mb-2"
            style="
              border-color: oklch(0.88 0.008 85);
              background: oklch(0.975 0.006 85);
            "
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full overflow-hidden shrink-0">
                <img
                  v-if="authStore.user?.avatar"
                  :src="authStore.user.avatar"
                  :alt="authStore.user.firstName"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-white font-bold"
                  style="
                    background: linear-gradient(
                      135deg,
                      oklch(0.32 0.09 295),
                      oklch(0.45 0.12 280)
                    );
                  "
                >
                  {{
                    getInitials(
                      `${authStore.user?.firstName ?? ""} ${authStore.user?.lastName ?? ""}`,
                    )
                  }}
                </div>
              </div>
              <div class="min-w-0">
                <p class="font-bold text-foreground text-sm truncate">
                  {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                </p>
                <p class="text-xs text-muted-foreground truncate">
                  {{ authStore.user?.email }}
                </p>
              </div>
            </div>
          </div>

          <nav class="space-y-1">
            <RouterLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              :style="
                route.path === item.to
                  ? 'background: oklch(0.32 0.09 295 / 0.08); color: oklch(0.32 0.09 295);'
                  : 'color: oklch(0.52 0.015 285);'
              "
              active-class="!bg-primary/10 !text-primary"
            >
              <component :is="item.icon" :size="17" />
              {{ item.label }}
            </RouterLink>

            <button
              @click="handleLogout"
              class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mt-2"
              style="color: oklch(0.57 0.24 27)"
            >
              <LogOut :size="17" />
              Sign Out
            </button>
          </nav>
        </aside>

        <div class="flex-1 min-w-0">
          <RouterView />
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
