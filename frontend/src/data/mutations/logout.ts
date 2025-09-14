import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn:async () =>{
      localStorage.removeItem('token')
    },
    onSuccess: () =>{
      queryClient.clear()
      router.push('/login')
    }
  })
}
