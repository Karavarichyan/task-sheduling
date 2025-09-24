<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2>Team Members List</h2>
      <UserSearch v-model:searchTerm="searchTerm" />
      <!-- <Button
        @click="startAdd"
        class="flex items-center gap-2 bg-gray-400 text-white hover:bg-gray-300"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        Add New Member
      </Button> -->
    </div>

    <div v-if="isLoading">Loading team members...</div>
    <div v-else-if="isError">Error loading team members.</div>

    <div v-else-if="filteredMembers && filteredMembers.length > 0">
      <ul class="space-y-2">
        <li
          v-for="member in filteredMembers"
          :key="member.id"
          class="flex items-start justify-between p-3 border rounded-lg shadow-sm"
        >
          <div>
            <div class="flex items-center space-x-2">
              <strong>{{ member.fullName }}</strong>
              <span class="text-sm text-gray-500">({{ member.role }})</span>
            </div>
            <small class="text-sm text-gray-600 space-x-4">
              <span>Email: {{ member.email }}</span>
              <span>Department: {{ member.department }}</span>
            </small>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="h-8 w-8 p-0">
                <span class="sr-only">Open menu</span>
                 <!-- <ellipsis-vertical class="h-4 w-4" /> -->

                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  ></path>
                </svg>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="startEdit(member)">Edit Team Member</DropdownMenuItem>
              <DropdownMenuItem
                class="text-destructive"
                :disabled="isRemoving"
                @click="confirmRemove(member.id)"
              >
                {{ isRemoving ? 'Removing...' : 'Remove Team Member' }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </div>

    <div v-else class="mt-4 p-4 border-dashed border-2 rounded-lg text-center">
      <p>No team members found.</p>
      <Button variant="link" @click="startAdd">Click here to add the first one.</Button>
    </div>

    <UserModal
      :isOpen="isModalOpen"
      @close="handleModalClose"
      @success="handleMutationSuccess"
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
import { ref, computed } from 'vue';
import { useTeamMembersQuery } from '@/data/queries/useTeamMembersQuery ';
import ConfirmRemoveModal from '../remove-modal/ConfirmRemoveModal.vue';
import { useRemoveTeamMemberMutation } from '@/data/mutations/useRemoveTeamMemberMutation';
// import {ellipsis-vertical} from 'lucide-vue-next'
import UserModal from '@/components/User-Modal/UserModal.vue';
import UserSearch from '@/components/user-search/UserSearch.vue';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const isModalOpen = ref(false);
const memberToEdit = ref(null as any);
const isConfirmRemoveModalOpen = ref(false);
const memberToRemoveId = ref<string | null>(null);

const searchTerm = ref('');

const {
  data: members,
  isLoading,
  isError,
  refetch,
} = useTeamMembersQuery();
const { mutate: removeMember, isPending: isRemoving } = useRemoveTeamMemberMutation();

const filteredMembers = computed(() => {
  if (!members.value) {
    return [];
  }
  const search = searchTerm.value.toLowerCase();
  return members.value.filter(
    (member: any) =>
      member.fullName.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search) ||
      member.role.toLowerCase().includes(search) ||
      member.department.toLowerCase().includes(search)
  );
});

const startAdd = () => {
  memberToEdit.value = null;
  isModalOpen.value = true;
};

const startEdit = (memberData: any) => {
  memberToEdit.value = memberData;
  isModalOpen.value = true;
};

const handleModalClose = () => {
  isModalOpen.value = false;
  memberToEdit.value = null;
};

const handleMutationSuccess = () => {
  refetch();
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
      closeConfirmRemoveModal();
    },
  });
};
</script>
