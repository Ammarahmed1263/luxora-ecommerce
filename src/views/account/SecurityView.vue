<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/composables/useToast'
import { changePasswordSchema } from '@/lib/validators'
import { authService } from '@/services/api/auth.service'
import { toTypedSchema } from '@vee-validate/zod'
import { Eye, EyeOff, Loader2, Shield } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref } from 'vue'

const { toast } = useToast()
const loading = ref(false)
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const form = useForm({ validationSchema: toTypedSchema(changePasswordSchema), initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' } })

const onSubmit = form.handleSubmit(async (values) => {
  loading.value = true
  try {
    await authService.changePassword(values as any)
    toast({ title: 'Password changed successfully!' })
    form.resetForm()
  } catch (err: unknown) {
    const msg = (err as any)?.response?.data?.message ?? 'Failed to change password'
    toast({ title: 'Error', description: msg, variant: 'destructive' })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
        <Shield :size="22" /> Security
      </h1>
      <p class="text-muted-foreground text-sm mt-1">Manage your account password and security settings</p>
    </div>

    <div class="p-6 rounded-2xl border max-w-md" style="border-color: oklch(0.88 0.008 85);">
      <h2 class="font-bold text-foreground mb-5">Change Password</h2>

      <form @submit="onSubmit" class="space-y-4" novalidate>
        <FormField v-slot="{ componentField }" name="currentPassword">
          <FormItem>
            <FormLabel class="text-sm font-semibold">Current Password</FormLabel>
            <FormControl>
              <div class="relative">
                <Input v-bind="componentField" :type="showCurrent ? 'text' : 'password'" class="h-11 rounded-xl pr-12 text-sm" style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);" />
                <button type="button" @click="showCurrent = !showCurrent" class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <component :is="showCurrent ? EyeOff : Eye" :size="16" />
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="newPassword">
          <FormItem>
            <FormLabel class="text-sm font-semibold">New Password</FormLabel>
            <FormControl>
              <div class="relative">
                <Input v-bind="componentField" :type="showNew ? 'text' : 'password'" class="h-11 rounded-xl pr-12 text-sm" style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);" />
                <button type="button" @click="showNew = !showNew" class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <component :is="showNew ? EyeOff : Eye" :size="16" />
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem>
            <FormLabel class="text-sm font-semibold">Confirm New Password</FormLabel>
            <FormControl>
              <div class="relative">
                <Input v-bind="componentField" :type="showConfirm ? 'text' : 'password'" class="h-11 rounded-xl pr-12 text-sm" style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);" />
                <button type="button" @click="showConfirm = !showConfirm" class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <component :is="showConfirm ? EyeOff : Eye" :size="16" />
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <button
          type="submit"
          :disabled="loading"
          class="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 mt-2"
          style="background: linear-gradient(135deg, oklch(0.32 0.09 295), oklch(0.45 0.12 280));"
        >
          <Loader2 v-if="loading" :size="16" class="animate-spin" />
          <Shield v-else :size="16" />
          {{ loading ? 'Updating…' : 'Update Password' }}
        </button>
      </form>
    </div>
  </div>
</template>
