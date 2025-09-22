<template>
  <Dialog :open="isOpen" @update:open="$emit('close')">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="text-destructive">Confirm Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to remove the team member with ID:
          <span class="font-semibold">{{ memberId }}</span
          >? This action is irreversible.
        </DialogDescription>
      </DialogHeader>

      <div class="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" @click="$emit('close')"> Cancel </Button>

        <Button type="button" variant="destructive" @click="$emit('confirm')" :disabled="isPending">
          {{ isPending ? 'Removing...' : 'Remove User' }}
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
  memberId: string | null
  isPending: boolean
}>()

defineEmits(['close', 'confirm'])
</script>
