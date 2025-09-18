<template>
  <div>
    <h2>Team Members List</h2>

    <div v-if="isLoading">Loading team members...</div>
    <div v-else-if="isError">Error loading team members.</div>

    <div v-else-if="members && members.length > 0">
      <ul>
        <li v-for="member in members" :key="member.id" class="p-2 border-b last:border-b-0">
          <strong>{{ member.fullName }}</strong> ({{ member.role }})
          <br>
          <small>
            Email: {{ member.email }} |
            Department: {{ member.department }} |
            Status:
            <span :class="{'text-green-600': member.isAvailable, 'text-red-600': !member.isAvailable}">
              {{ member.isAvailable ? 'Available' : 'Busy' }}
            </span>
          </small>
        </li>
      </ul>
    </div>

    <div v-else>
      <p>No team members found. Click to add a new one.</p>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useTeamMembersQuery } from '@/data/queries/useTeamMembersQuery ';
const { data: members, isLoading, isError } = useTeamMembersQuery();
</script>
