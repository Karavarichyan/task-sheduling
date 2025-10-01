<script lang="ts" setup>
import GuestGuard from '@/components/guest-guard/GuestGuard.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLoginMutation } from '@/data/mutations/login'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import * as z from 'zod'
const formSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormSchema = z.infer<typeof formSchema>

const form = useForm<FormSchema>({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    email: '',
    password: '',
  },
})

const router = useRouter()
const { mutateAsync: login } = useLoginMutation()

const onSubmit = form.handleSubmit(async (values) => {
  await login({
    email: values.email,
    password: values.password,
  })
  router.push({ name: 'board' })
})
</script>

<template>
  <GuestGuard>
    <div class="min-h-screen flex items-center justify-center bg-background p-4">
      <Card class="w-full max-w-md">
        <CardHeader class="space-y-1">
          <CardTitle class="text-2xl font-bold text-center">Task Scheduler</CardTitle>
          <CardDescription class="text-center">Sign in to your admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="onSubmit">
            <FormField v-slot="{ componentField, errorMessage }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" v-bind="componentField" />
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField, errorMessage }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" v-bind="componentField" />
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>

            <Button type="submit" class="w-full"> Submit </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </GuestGuard>
</template>
