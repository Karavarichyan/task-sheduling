<script lang="ts" setup>
import { useUserQuery } from '@/data/queries/user'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '../ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '../ui/card'

const { data: user, isLoading } = useUserQuery()
</script>

<template>
  <div v-if="isLoading" class="h-screen flex items-center justify-center">
    <Loader2 class="animate-spin size-4" />
  </div>
  <slot v-if="user" />
  <div v-else class="h-screen flex flex-col items-stretch justify-center">
    <Card class="max-w-md w-full mx-auto">
      <CardHeader>
        <CardTitle class="text-center"> Unauthorized! </CardTitle>
      </CardHeader>
      <CardFooter class="justify-center">
        <Button as-child>
          <RouterLink :to="{ name: 'login' }"> Login </RouterLink>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
