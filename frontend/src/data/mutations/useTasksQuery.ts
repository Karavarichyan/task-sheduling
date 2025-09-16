import { useQuery } from '@tanstack/vue-query';
import { getTasks } from './tasks';

export const useTasksQuery = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getTasks();
    },
  });
};
