<script lang="ts" setup>
import SidebarUser from '@/components/sidebar-user/SidebarUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { KanbanIcon, UsersIcon } from 'lucide-vue-next'
import { RouterLink, RouterView } from 'vue-router'

const items = [
  {
    title: 'Board',
    to: { name: 'board' },
    icon: KanbanIcon,
  },
  {
    title: 'Users',
    to: { name: 'users' },
    icon: UsersIcon,
  },
]
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton asChild>
                  <RouterLink :to="item.to">
                    <component :is="item.icon" />
                    {{ item.title }}</RouterLink
                  >
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <RouterView />
    </SidebarInset>
  </SidebarProvider>
</template>
