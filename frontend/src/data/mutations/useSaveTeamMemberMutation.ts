import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { saveTeamMember } from './teamMembers'

export const useSaveTeamMemberMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (memberData: any) => {
      const savedMember = saveTeamMember(memberData)
      if (!savedMember) {
        throw new Error('Failed to save team member')
      }
      return savedMember
    },
    onSuccess: (newMember) => {
      queryClient.setQueryData(['teamMembers'], (oldMembers: any[] | undefined) => {
        return oldMembers ? [...oldMembers, newMember] : [newMember]
      })
    },
  })
}
