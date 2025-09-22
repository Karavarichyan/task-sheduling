<template>
  <Dialog :open="isOpen" @update:open="$emit('close')">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Add New Team Member</DialogTitle>
        <DialogDescription>Fill in the details to add a new team member.</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <h2 class="text-lg font-semibold border-b pb-2">Personal Information</h2>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="fullName">Full Name *</Label>
            <Input id="fullName" placeholder="Enter full name" v-model="formData.fullName" required />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@company.com"
                v-model="formData.email"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                v-model="formData.phone"
              />
            </div>
          </div>
        </div>

        <h2 class="text-lg font-semibold border-b pb-2">Work Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="department">Department *</Label>
            <Select v-model="formData.department" required> <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="it_support">IT Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="role">Role *</Label>
            <Select v-model="formData.role" :disabled="!formData.department" required>
              <SelectTrigger>
                <SelectValue :placeholder="formData.department ? 'Select role' : 'Select department first'" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- <h2 class="text-lg font-semibold border-b pb-2">Availability</h2>
        <div class="flex items-center justify-between">
          <div>
            <Label>Currently Available</Label>
            <p class="text-sm text-gray-500">Toggle to set initial availability status</p>
          </div>
          <Switch v-model:checked="formData.isAvailable" />
        </div> -->

        <div class="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" @click="$emit('close')">Cancel</Button>
          <Button type="submit" :disabled="isPending || !isFormValid" class="bg-blue-600 text-white hover:bg-blue-700">
             {{ isPending ? 'Adding Member...' : 'Add Team Member' }}
          </Button>
        </div>
      </form>
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { reactive, computed } from 'vue'
import { useSaveTeamMemberMutation } from '@/data/mutations/useSaveTeamMemberMutation'
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])

const initialFormData = {
  fullName: '',
  email: '',
  phone: '',
  department: '',
  role: '',
  isAvailable: true,
}

const formData = reactive({ ...initialFormData })

const isFormValid = computed(() => {
    return (
        formData.fullName.trim() !== '' &&
        formData.email.trim() !== '' &&
        formData.department.trim() !== '' &&
        formData.role.trim() !== ''
    );
});



const { mutate: saveTeamMember, isPending } = useSaveTeamMemberMutation();


const handleSubmit = () => {
  if (!isFormValid.value) {
    return
  }

  saveTeamMember(formData, {
    onSuccess: () => {
      Object.assign(formData, initialFormData)
      emit('close');
    },
    onError: (error: any) => {
    },
  });
}
</script>
