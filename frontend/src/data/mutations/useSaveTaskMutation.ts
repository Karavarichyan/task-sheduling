import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { saveTask } from './tasks';

export const useSaveTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: any) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const savedTask = saveTask(taskData);
      if (!savedTask) {
        throw new Error('error save tasks');
      }
      return savedTask;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
