<template>
  <Dialog :open="isOpen" @update:open="$emit('close')">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="text-destructive">Confirm Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to remove the **task** with ID:
          <span class="font-semibold">{{ itemId }}</span
          >? This action is irreversible.
        </DialogDescription>
      </DialogHeader>

      <div class="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" @click="$emit('close')"> Cancel </Button>

        <Button type="button" variant="destructive" @click="$emit('confirm')" :disabled="isPending">
          {{ isPending ? 'Removing...' : 'Delete Task' }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

defineProps<{
  isOpen: boolean
  // Переименовано с memberId на itemId, чтобы быть универсальным
  itemId: string | null
  isPending: boolean
}>()

// confirm будет вызывать фактическую функцию удаления в родителе
defineEmits(['close', 'confirm'])
</script>
