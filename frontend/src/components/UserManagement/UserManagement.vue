<template>
  <AuthGuard>
    <DashboardLayout>
      <template #title> User Management </template>

      <template #subtitle> Manage team members and their availability </template>

      <template #button>
        <Button
          @click="isUserModalOpen = true"
          class="flex items-center gap-2 bg-gray-400 text-white hover:bg-gray-300"
        >
          <Plus class="h-4 w-4" />
          Add User
        </Button>
      </template>

      <template #modal>
        <UserModal :isOpen="isUserModalOpen" @close="isUserModalOpen = false" />
      </template>
    </DashboardLayout>
  </AuthGuard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import AuthGuard from '../auth-guard/AuthGuard.vue'
import DashboardLayout from '../Dashbord-Layout/DashboardLayout.vue'
import UserModal from '../User-Modal/UserModal.vue'

const isUserModalOpen = ref(false)
</script>
