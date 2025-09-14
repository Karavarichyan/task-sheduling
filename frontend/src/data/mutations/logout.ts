import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

const logoutUser = async () => {
  localStorage.removeItem('token')
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear()

      router.push('/login')
    },
  })
}
