<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { GoogleLogin } from "vue3-google-login";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShoppingBag,
  CreditCard,
  Award,
  ShieldCheck,
} from "lucide-vue-next";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/composables/useToast";
import { loginSchema } from "@/lib/validators";

const authStore = useAuthStore();
const { toast } = useToast();
const router = useRouter();
const route = useRoute();

const showPassword = ref(false);
const loading = ref(false);
const resendLoading = ref(false);
const unverifiedEmail = ref("");

const form = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { email: "", password: "", rememberMe: false },
});

const onSubmit = form.handleSubmit(async (values) => {
  loading.value = true;
  try {
    await authStore.login(values)

    // If there's an explicit redirect query param, honour it
    const redirect = route.query.redirect as string | undefined
    if (redirect) {
      router.push(redirect)
      return
    }

    // Otherwise route by role
    if (authStore.isAdmin) {
      router.push({ name: 'admin-overview' })
    } else if (authStore.isSeller) {
      router.push({ name: 'seller-overview' })
    } else {
      router.push({ name: 'home' })
    }
  } catch (err: unknown) {
    const data = (err as any)?.response?.data;
    const msg = data?.message ?? "Invalid email or password";
    
    if (data?.code === "EMAIL_NOT_VERIFIED" || msg.includes("verify your email")) {
      unverifiedEmail.value = values.email;
    } else {
      unverifiedEmail.value = "";
    }

    toast({
      title: "Sign in failed",
      description: msg,
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
});

const resendVerification = async () => {
  if (!unverifiedEmail.value) return;
  resendLoading.value = true;
  try {
    await authStore.resendVerification(unverifiedEmail.value);
    toast({
      title: "Verification email sent",
      description: "Please check your inbox.",
    });
    unverifiedEmail.value = "";
  } catch (err: unknown) {
    toast({
      title: "Failed to resend",
      description: (err as any)?.response?.data?.message || "An error occurred",
      variant: "destructive",
    });
  } finally {
    resendLoading.value = false;
  }
};

const onGoogleLogin = async (response: any) => {
  if (!response.credential) return;
  
  loading.value = true;
  try {
    await authStore.googleLogin({ credential: response.credential, role: 'customer' });
    
    const redirect = route.query.redirect as string | undefined
    if (redirect) {
      router.push(redirect)
      return
    }

    if (authStore.isAdmin) {
      router.push({ name: 'admin-overview' })
    } else if (authStore.isSeller) {
      router.push({ name: 'seller-overview' })
    } else {
      router.push({ name: 'home' })
    }
  } catch (err: unknown) {
    toast({
      title: "Google Sign-in failed",
      description: (err as any)?.response?.data?.message || "An error occurred",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};

const highlights = [
  { icon: ShoppingBag, text: "Discover 3,000+ premium curated products" },
  { icon: CreditCard, text: "Secure checkouts with Stripe & PayPal" },
  { icon: Award, text: "Earn exclusive loyalty rewards on purchases" },
  { icon: ShieldCheck, text: "100% buyer protection guarantee" },
];
</script>

<template>
  <div class="min-h-screen flex bg-background">
    <div
      class="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden shrink-0"
    >
      <img
        src="/auth-hero.png"
        alt="Luxora premium shopping experience"
        class="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div class="absolute inset-0 bg-primary/80" />

      <div class="relative z-10 flex flex-col justify-between p-10 w-full">
        <RouterLink to="/" class="flex items-center gap-3 group">
          <div
            class="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20 border border-white/25 backdrop-blur-sm"
          >
            <span class="font-bold text-lg text-white">L</span>
          </div>
          <span class="font-bold text-xl text-white tracking-tight"
            >Luxora</span
          >
        </RouterLink>

        <div class="max-w-xs">
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 bg-white/10 border border-white/20 backdrop-blur-sm"
          >
            <div
              class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
            />
            <span class="text-xs text-white/80 font-medium"
              >Welcome back to Luxora</span
            >
          </div>
          <h2
            class="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4"
          >
            Sign in<br />to your<br />
            <span
              class="text-white underline decoration-orange-400 decoration-3 underline-offset-4"
              >lounge</span
            >
          </h2>
          <p class="text-white/70 text-sm leading-relaxed mb-8">
            Sign in to access your curated collections, track orders, and
            discover new arrivals.
          </p>

          <div class="space-y-3.5">
            <div
              v-for="item in highlights"
              :key="item.text"
              class="flex items-center gap-3"
            >
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white/10 border border-white/15"
              >
                <component :is="item.icon" :size="15" class="text-white/85" />
              </div>
              <span class="text-white/80 text-sm font-medium">{{
                item.text
              }}</span>
            </div>
          </div>
        </div>

        <p class="text-white/40 text-xs">© 2026 Luxora. All rights reserved.</p>
      </div>
    </div>

    <div
      class="flex-1 flex items-center justify-center p-6 lg:p-10 xl:p-14 overflow-y-auto"
    >
      <div class="w-full max-w-105">
        <RouterLink to="/" class="flex items-center gap-2 mb-8 lg:hidden">
          <div
            class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"
          >
            <span class="text-white font-bold">L</span>
          </div>
          <span class="font-bold text-xl text-foreground">Luxora</span>
        </RouterLink>

        <div class="mb-8">
          <p
            class="text-sm text-muted-foreground font-medium uppercase tracking-widest mb-3"
          >
            Welcome back
          </p>
          <h1
            class="text-3xl xl:text-4xl font-bold text-foreground mb-2 tracking-tight"
          >
            Sign in to your<br />account
          </h1>
          <p class="text-muted-foreground text-sm mt-3">
            New to Luxora?
            <RouterLink
              to="/auth/register"
              class="font-semibold underline underline-offset-2 text-primary"
            >
              Create a free account
            </RouterLink>
          </p>
        </div>

        <form @submit="onSubmit" class="space-y-5" novalidate>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-foreground"
                >Email address</FormLabel
              >
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="email"
                  id="login-email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  class="h-12 rounded-xl text-sm transition-all duration-200"
                  style="
                    background: oklch(0.975 0.006 85);
                    border-color: oklch(0.88 0.008 85);
                  "
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-foreground"
                >Password</FormLabel
              >
              <FormControl>
                <div class="relative">
                  <Input
                    v-bind="componentField"
                    :type="showPassword ? 'text' : 'password'"
                    id="login-password"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    class="h-12 rounded-xl pr-12 text-sm transition-all duration-200"
                    style="
                      background: oklch(0.975 0.006 85);
                      border-color: oklch(0.88 0.008 85);
                    "
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                    :aria-label="
                      showPassword ? 'Hide password' : 'Show password'
                    "
                  >
                    <component :is="showPassword ? EyeOff : Eye" :size="17" />
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="flex items-center justify-between">
            <FormField v-slot="{ value }" name="rememberMe">
              <FormItem class="flex items-center gap-2.5 space-y-0">
                <FormControl>
                  <Checkbox
                    :checked="value"
                    @update:checked="(checked: boolean) => form.setFieldValue('rememberMe', checked)"
                    id="rememberMe"
                    class="data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-background"
                  />
                </FormControl>
                <FormLabel
                  for="rememberMe"
                  class="text-sm font-normal cursor-pointer text-muted-foreground"
                >
                  Keep me signed in
                </FormLabel>
              </FormItem>
            </FormField>
          </div>

          <button
            type="submit"
            id="login-submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2.5 h-12 rounded-xl text-white bg-primary font-semibold text-sm shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 hover:-translate-y-0.5 mt-1"
          >
            <Loader2 v-if="loading" :size="18" class="animate-spin" />
            <template v-else>
              <span>Sign in</span>
              <ArrowRight :size="16" />
            </template>
          </button>
        </form>

        <div v-if="unverifiedEmail" class="mt-4 p-4 rounded-xl border flex flex-col items-center text-center space-y-3" style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);">
          <p class="text-sm text-foreground">Didn't receive the verification email?</p>
          <button
            @click="resendVerification"
            :disabled="resendLoading"
            class="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-white border border-border text-primary hover:bg-muted/50 font-semibold text-sm transition-all shadow-sm disabled:opacity-50"
          >
            <Loader2 v-if="resendLoading" :size="16" class="animate-spin" />
            <span v-else>Resend Verification Email</span>
          </button>
        </div>

        <div class="mt-4 flex justify-center w-full">
          <GoogleLogin :callback="onGoogleLogin" prompt />
        </div>

        <div class="relative my-7">
          <div class="absolute inset-0 flex items-center">
            <div
              class="w-full border-t"
              style="border-color: oklch(0.88 0.008 85)"
            />
          </div>
          <div class="relative flex justify-center">
            <span class="px-3 text-xs text-muted-foreground bg-background"
              >Shop with confidence</span
            >
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="trust in [
              '🔒 Secure SSL',
              '💳 Buyer Protection',
              '🚀 Premium Support',
            ]"
            :key="trust"
            class="flex items-center justify-center text-center p-2.5 rounded-xl text-xs text-muted-foreground font-medium"
            style="
              background: oklch(0.975 0.006 85);
              border: 1px solid oklch(0.88 0.008 85);
            "
          >
            {{ trust }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
