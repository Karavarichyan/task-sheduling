import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateTask, type UpdateTaskPayload, type Task } from '../mutations/tasks';
export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateTaskPayload): Promise<Task> => {
      await new Promise(resolve => setTimeout(resolve, 500));

      const result = updateTask(payload);
      if (!result) {
        throw new Error('Failed to update task in local storage.');
      }
      return result;
    },

    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

      queryClient.setQueryData(['task', updatedTask.id], updatedTask);
    },

  });
};
