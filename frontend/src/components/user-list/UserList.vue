<template>
  <div>
    <h2>Team Members List</h2>
      <div v-if="isLoading">Loading team members...</div>
    <div v-else-if="isError">Error loading team members.</div>

    <div v-else-if="members && members.length > 0">
      <ul class="space-y-2">
        <li v-for="member in members" :key="member.id"
            class="flex items-start justify-between p-3 border rounded-lg shadow-sm">

          <div>
            <div class="flex items-center space-x-2">
                <strong>{{ member.fullName }}</strong>
                <span class="text-sm text-gray-500">({{ member.role }})</span>
            </div>

            <small class="text-sm text-gray-600 space-x-4">
              <span>Email: {{ member.email }}</span>
              <span>Department: {{ member.department }}</span>
              <!-- <span>Status:
                <span :class="{'text-green-600 font-medium': member.isAvailable, 'text-red-600 font-medium': !member.isAvailable}">
                  {{ member.isAvailable ? 'Available' : 'Busy' }}
                </span>
              </span> -->
            </small>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="h-8 w-8 p-0">
                <span class="sr-only">Open menu</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                </svg>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="startEdit(member)">Edit Team Member</DropdownMenuItem>
              <DropdownMenuItem class="text-destructive" :disabled="isRemoving" @click="confirmRemove(member.id)">
                {{ isRemoving ? 'Removing...' : 'Remove Team Member' }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </div>

    <div v-else>
      <p>No team members found. Click to add a new one.</p>
    </div>

    <UserModal
        :isOpen="isModalOpen"
        @close="handleModalClose"
        :initial-data="memberToEdit"
    />
    <ConfirmRemoveModal
        :isOpen="isConfirmRemoveModalOpen"
        :member-id="memberToRemoveId"
        :is-pending="isRemoving"
        @close="closeConfirmRemoveModal"
        @confirm="handleConfirmedRemoval"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTeamMembersQuery } from '@/data/queries/useTeamMembersQuery ';
import ConfirmRemoveModal from '../remove-modal/ConfirmRemoveModal.vue';
import { useRemoveTeamMemberMutation } from '@/data/mutations/useRemoveTeamMemberMutation';

import UserModal from '@/components/User-Modal/UserModal.vue';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';


const isConfirmRemoveModalOpen = ref(false);
const memberToRemoveId = ref<string | null>(null);


const isModalOpen = ref(false);
const memberToEdit = ref(null as any);

const { data: members, isLoading, isError } = useTeamMembersQuery();
const { mutate: removeMember, isPending: isRemoving } = useRemoveTeamMemberMutation();


const startEdit = (memberData: any) => {
    memberToEdit.value = memberData;
    isModalOpen.value = true;
};

const handleModalClose = () => {
    isModalOpen.value = false;
    memberToEdit.value = null;
};

const closeConfirmRemoveModal = () => {
    isConfirmRemoveModalOpen.value = false;
    memberToRemoveId.value = null;
};
const confirmRemove = (memberId: string) => {
    memberToRemoveId.value = memberId;
    isConfirmRemoveModalOpen.value = true;
};
const handleConfirmedRemoval = () => {
    const id = memberToRemoveId.value;
    if (!id) return;

    removeMember(id, {
        onSuccess: () => {
            closeConfirmRemoveModal();
        },
        onError: (error) => {
            alert('error');
            closeConfirmRemoveModal();
        }
    });
};
</script>
