import { useMutation, useQueryClient } from '@tanstack/vue-query';
import {
    updateTeamMember,
    TEAM_MEMBERS_STORAGE_KEY
} from './teamMembers';


export const useUpdateTeamMemberMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTeamMember,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [TEAM_MEMBERS_STORAGE_KEY] });
        },

        onError: (error) => {
        },
    });
};
