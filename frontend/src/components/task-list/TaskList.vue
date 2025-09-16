<template>
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
</script>
