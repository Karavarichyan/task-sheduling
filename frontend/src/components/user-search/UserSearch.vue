<template>
  <div class="relative w-64">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
    <Input
      placeholder="Search users..."
      :modelValue="searchTerm"
      @input="$emit('update:searchTerm', $event.target.value)"
      class="pl-10"
    />
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-vue-next'

defineProps<{
  searchTerm: string
}>()

defineEmits(['update:searchTerm'])
</script>
