<template>
  <AuthGuard>
    <DashboardLayout>
      <template #title> User Management </template>

      <template #subtitle> Manage team members and their availability </template>

      <template #button>
        <Button
          @click="setIsUserModalOpen(true)"
          class="flex items-center gap-2 bg-gray-400 text-white hover:bg-gray-300"
        >
          <Plus class="h-4 w-4" />
          Add User
        </Button>
      </template>
    </DashboardLayout>
  </AuthGuard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import DashboardLayout from '../Dashboard-Layout/DashboardLayout.vue'
import AuthGuard from '../auth-guard/AuthGuard.vue'

const isUserModalOpen = ref(false)

const setIsUserModalOpen = (value: boolean) => {
  isUserModalOpen.value = value
}
</script>
