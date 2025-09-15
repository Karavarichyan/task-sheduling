import { useMutation, useQueryClient } from '@tanstack/vue-query'

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('user')
    },
    onSuccess: () => {
      queryClient.setQueryData(['user'], null)
    },
  })
}
