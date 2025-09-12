import { useMutation, useQueryClient } from '@tanstack/vue-query'

export type LoginMutationParams = {
  email: string
  password: string
}

export const useLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: LoginMutationParams) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: params.email,
        }),
      )
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['user'] })
    },
  })
}
