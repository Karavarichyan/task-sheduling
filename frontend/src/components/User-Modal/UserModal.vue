<template>
  <Dialog :open="isOpen" @update:open="$emit('close')">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogDescription> Fill in the details to create a new task. </DialogDescription>
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
              <Select v-model="formData.assignee">
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
                  <span>{{ formData.dueDate ? formData.dueDate.toString() : 'Pick a date' }}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <Calendar mode="single" v-model="formData.dueDate as DateValue | undefined" />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" @click="$emit('close')" class="hover:bg-blue-500">
            Cancel
          </Button>
          <Button type="submit" class="bg-gray-400 text-white hover:bg-gray-300">
            Create Task
          </Button>
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
import type { DateValue } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { reactive, watch } from 'vue'
import { useSaveTaskMutation } from '@/data/mutations/useSaveTaskMutation';

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])

const formData = reactive({
  title: '',
  description: '',
  assignee: '',
  priority: 'medium',
  dueDate: undefined as DateValue | undefined,
})

const { mutate: saveTask, isPending } = useSaveTaskMutation();

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

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      Object.assign(formData, {
        title: '',
        description: '',
        assignee: '',
        priority: 'medium',
        dueDate: undefined,
      })
    }
  },
)

const handleSubmit = () => {
  if (!formData.title || !formData.description || !formData.assignee || !formData.dueDate) {
    console.error('All required fields must be filled out.')
    return
  }

  saveTask(formData, {
    onSuccess: () => {
      console.log('Task saved successfully!');
      emit('close');
    },
    onError: (error) => {
      console.error('Failed to save task:', error);
    },
  });
}
</script>
