<!-- <script lang="ts" setup>
import UserManagement from '../components/User-Management/UserManagement.vue'
</script>

<template>
  <div>users</div>
  <div>  <UserManagement /></div>
</template> -->
<template>
  <div>
      <div>  <UserManagement /></div>

    <h1>Панель управления задачами</h1>
    <TaskList />
    </div>
</template>

<script setup lang="ts">
import UserManagement from '../components/User-Management/UserManagement.vue'

import TaskList from '@/components/task-list/TaskList.vue';
// import UserModal from '../components/User-Management/UserModal.vue';
// import { ref } from 'vue';

// const isUserModalOpen = ref(false);
</script>
