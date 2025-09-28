<template>
  <AuthGuard>
    <DashboardLayout>
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-foreground">Task Dashboard</h1>
            <p class="text-muted-foreground">Manage tasks</p>
          </div>
          <Button @click="isTaskModalOpen = true" class="flex items-center gap-2">
            <Plus class="h-4 w-4" />
            Create Task
          </Button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div>
            <TaskBoard />
          </div>
        </div>
      </div>

      <TaskAssignmentModal :isOpen="isTaskModalOpen" @close="isTaskModalOpen = false" />
    </DashboardLayout>
  </AuthGuard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-vue-next';

import AuthGuard from '@/components//auth-guard/AuthGuard.vue';
import DashboardLayout from '@/components///Dashbord-Layout/DashboardLayout.vue';
import TaskBoard from '@/components//task-list/TaskList.vue';
import TaskAssignmentModal from '@/components//Task-Modal/TaskModal.vue';

const isTaskModalOpen = ref(false);
</script>
