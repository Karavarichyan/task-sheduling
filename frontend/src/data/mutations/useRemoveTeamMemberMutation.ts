import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { deleteTeamMember } from '../mutations/teamMembers'

export const useRemoveTeamMemberMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (memberId: string) => {
      const success = deleteTeamMember(memberId)
      if (!success) {
        throw new Error('Failed to delete team member')
      }
      return memberId
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });

      /*
      queryClient.setQueryData(['teamMembers'], (oldMembers: any[] | undefined) => {
         return oldMembers ? oldMembers.filter(m => m.id !== deletedId) : [];
      });
      */
    },
  })
}
