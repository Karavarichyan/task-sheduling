<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogoutMutation } from '@/data/mutations/logout'
import { useUserQuery } from '@/data/queries/user'
import { ChevronsUpDown, Loader2, LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar'

const { data: user, isLoading } = useUserQuery()
const { isMobile } = useSidebar()
const { mutate: logout, isPending } = useLogoutMutation()
const router = useRouter()

const handleLogout = () => {
  logout()
  router.push({ name: 'login' })
}
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
            <Loader2 v-if="isPending" class="mr-2 h-4 w-4 animate-spin" />
            <LogOut v-else class="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
