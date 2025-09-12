<script lang="ts" setup>
import { useUserQuery } from '@/data/queries/user'
import { RouterView } from 'vue-router'

const { data: user } = useUserQuery()
</script>

<template>
  <div>Hello {{ user?.email }}</div>
  <RouterView />
</template>
