<script setup lang="ts">
import { ChevronsUpDown, Loader2, LogOut } from 'lucide-vue-next';
import { useLogoutMutation } from '@/data/mutations/logout'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserQuery } from '@/data/queries/user';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar';

const { data: user, isLoading } = useUserQuery();
const { isMobile } = useSidebar();
const { mutate: logout, isPending } = useLogoutMutation();

const handleLogout = () => {
  logout();
};
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              v-if="isLoading"
              class="flex flex-1 items-center justify-center text-left text-sm leading-tight"
            >
              <Loader2 class="h-4 w-4 animate-spin text-blue-500" />
            </div>
            <div v-else class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ user?.email }}</span>
            </div>

            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user?.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout" :disabled="isPending">
            <template v-if="isPending">
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              <span>Log out</span>
            </template>
            <template v-else>
              <LogOut class="mr-2 h-4 w-4" />
              <span>Log out</span>
            </template>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
