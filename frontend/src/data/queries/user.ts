import { useQuery } from '@tanstack/vue-query'

export type User = {
  email: string
}

export const useUserQuery = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const data = localStorage.getItem('user')

      if (!data) return null

      return JSON.parse(data) as User
    },
  })
}
