<!-- <template>
  <div>
    <h2>Task list</h2>
    <div v-if="isLoading">Loading tasks</div>
    <div v-else-if="isError">Error loading tasks</div>

    <div v-else-if="tasks && tasks.length > 0">
      <ul>
        <li v-for="task in tasks" :key="task.id">
          <strong>{{ task.title }}</strong> - {{ task.description }}
          <br>
          <small>Priority {{ task.priority }}</small>
        </li>
      </ul>
    </div>

    <div v-else>
      <p>Create a new one</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTasksQuery } from '@/data/mutations/useTasksQuery';
const { data: tasks, isLoading, isError } = useTasksQuery();
</script> -->
<template>

  <div>
    <div class="flex justify-between items-center mb-4">
      <h2>Task list</h2>

      <Button
        @click="isModalOpen = true"
          class="flex items-center gap-2 bg-gray-400 text-white hover:bg-gray-300"
      >
                  <Plus class="h-4 w-4" />
 Create New Task
      </Button>
    </div>

    <div v-if="isLoading">Loading tasks</div>
    <div v-else-if="isError">Error loading tasks</div>

    <div v-else-if="tasks && tasks.length > 0">
      <ul>
        <li v-for="task in tasks" :key="task.id" class="border-b py-2">
          <strong>{{ task.title }}</strong> - {{ task.description }}
          <br>
          <small>Priority {{ task.priority }}</small>
        </li>
      </ul>
    </div>

    <div v-else>
      <p>No tasks found. Create a new one!</p>
    </div>

    <TaskModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTasksQuery } from '@/data/mutations/useTasksQuery';
import TaskModal from '@/components/Task-Modal/TaskModal.vue';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-vue-next'

const isModalOpen = ref(false);

const { data: tasks, isLoading, isError } = useTasksQuery();
</script>
