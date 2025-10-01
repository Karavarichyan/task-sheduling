<template>
  <Dialog :open="isOpen" @update:open="$emit('close')">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>{{ dialogDescription }}</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 gap-4">
          <div class="space-y-2">
            <Label for="title">Task Title *</Label>
            <Input id="title" placeholder="Enter task title" v-model="formData.title" required />
          </div>

          <div class="space-y-2">
            <Label for="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the task in detail"
              v-model="formData.description"
              rows="3"
              required
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="assignee">Assign To *</Label>
              <Select v-model="formData.assignee" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="priority">Priority</Label>
              <Select v-model="formData.priority">
                <SelectTrigger>
                  <div class="flex items-center gap-2">
                    <div
                      :class="getPriorityColor(formData.priority)"
                      class="w-2 h-2 rounded-full"
                    ></div>
                    <span>{{ getPriorityText(formData.priority) }}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-green-500"></div>
                      Low Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Medium Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-red-500"></div>
                      High Priority
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="space-y-2">
            <Label>Due Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" class="w-full justify-start text-left font-normal">
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  <span>{{
                    formData.dueDate
                      ? new Date(formData.dueDate).toLocaleDateString()
                      : 'Pick a date'
                  }}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <Calendar v-model="selectedDate as DateValue" />

              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div class="flex justify-between space-x-3 pt-4 border-t">
          <Button
            v-if="isEditMode"
            type="button"
            variant="destructive"
            @click="handleDelete"
            :disabled="isSubmitting"
            class="bg-red-600 hover:bg-red-700"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete Task' }}
          </Button>

          <div class="flex justify-end space-x-3 ml-auto">
            <Button type="button" variant="outline" @click="$emit('close')">Cancel</Button>
            <Button
              type="submit"
              :disabled="isSubmitting || !isFormValid"
              class="bg-blue-600 text-white hover:bg-blue-700"
              >{{ submitButtonText }}</Button
            >
          </div>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { useDeleteTaskMutation } from '@/data/mutations/useDeleteTaskMutation'
import { useSaveTaskMutation } from '@/data/mutations/useSaveTaskMutation'
import { useUpdateTaskMutation } from '@/data/mutations/useUpdateTaskMutation'

import { CalendarIcon } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

import type { DateValue } from '@internationalized/date'
import { parseDate } from '@internationalized/date'

const props = defineProps<{
  isOpen: boolean
  initialData: any | null
}>()

const emit = defineEmits(['close', 'success'])

const toCalendarDate = (dateString: string | null | undefined): DateValue | undefined => {
  if (!dateString) return undefined
  try {
    return parseDate(dateString) as DateValue
  } catch {
    return undefined
  }
}

const initialFormData = {
  title: '',
  description: '',
  assignee: '',
  priority: 'medium',
  dueDate: null as string | null,
}

const formData = ref({ ...initialFormData })

const selectedDate = ref<DateValue | undefined>(undefined)

const { mutate: saveTask, isPending: isAdding } = useSaveTaskMutation()
const { mutate: updateTask, isPending: isUpdating } = useUpdateTaskMutation()
const { mutate: deleteTask, isPending: isDeleting } = useDeleteTaskMutation()

const isEditMode = computed(() => !!props.initialData)
const dialogTitle = computed(() => (isEditMode.value ? 'Edit Task' : 'Create New Task'))
const dialogDescription = computed(() =>
  isEditMode.value
    ? 'Update the details for this task.'
    : 'Fill in the details to create a new task.',
)
const isSubmitting = computed(() => isAdding.value || isUpdating.value || isDeleting.value)
const submitButtonText = computed(() => {
  if (isSubmitting.value) {
    return isEditMode.value ? 'Updating Task...' : 'Creating Task...'
  }
  return isEditMode.value ? 'Update Task' : 'Create Task'
})

const isFormValid = computed(() => {
  return (
    formData.value.title.trim() !== '' &&
    formData.value.description.trim() !== '' &&
    formData.value.assignee.trim() !== '' &&
    !!formData.value.dueDate
  )
})

watch(
  () => [props.initialData, props.isOpen],
  ([newInitialData, newIsOpen]) => {
    if (newIsOpen) {
      if (newInitialData) {
        formData.value = { ...newInitialData }
        selectedDate.value = toCalendarDate(newInitialData.dueDate)
      } else {
        formData.value = { ...initialFormData }
        selectedDate.value = undefined
      }
    } else {
      formData.value = { ...initialFormData }
      selectedDate.value = undefined
    }
  },
  { immediate: true },
)

watch(selectedDate, (newDate) => {
  formData.value.dueDate = newDate ? newDate.toString() : null
})

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'bg-green-500'
    case 'medium':
      return 'bg-yellow-500'
    case 'high':
      return 'bg-red-500'
    default:
      return 'bg-gray-400'
  }
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'Low Priority'
    case 'medium':
      return 'Medium Priority'
    case 'high':
      return 'High Priority'
    default:
      return 'Select priority'
  }
}

const handleSubmit = () => {
  if (!isFormValid.value || isSubmitting.value) {
    return
  }

  const dataToSend = isEditMode.value
    ? { ...formData.value, id: props.initialData.id }
    : formData.value

  const mutationHandler = isEditMode.value ? updateTask : saveTask

  mutationHandler(dataToSend, {
    onSuccess: () => {
      emit('success')
      emit('close')
    },
    onError: (error: any) => {
      console.error(`Failed to ${isEditMode.value ? 'update' : 'save'} task:`, error)
    },
  })
}

const handleDelete = () => {
  if (!props.initialData || isSubmitting.value) {
    return
  }

  if (!confirm('Are you sure you want to delete this task?')) {
    return
  }

  deleteTask(props.initialData.id, {
    onSuccess: () => {
      emit('success')
      emit('close')
    },
    onError: (error: any) => {
      console.error('Failed to delete task:', error)
    },
  })
}
</script>
