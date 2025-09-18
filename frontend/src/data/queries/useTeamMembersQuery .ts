import { useQuery } from '@tanstack/vue-query';
import { getTeamMembers } from '../mutations/teamMembers';

export const useTeamMembersQuery = () => {
  return useQuery({
    queryKey: ['teamMembers'],

    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      return getTeamMembers();
    },
  });
};
