import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteTask } from '../mutations/tasks';

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string): Promise<boolean> => {
      await new Promise(resolve => setTimeout(resolve, 500));

      const success = deleteTask(taskId);
      if (!success) {
        throw new Error('Failed to delete task from local storage.');
      }
      return true;
    },

    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

      queryClient.removeQueries({ queryKey: ['task', taskId] });
    },

  });
};
