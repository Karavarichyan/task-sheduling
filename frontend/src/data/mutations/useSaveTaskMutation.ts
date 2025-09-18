// import { useMutation, useQueryClient } from '@tanstack/vue-query';
// import { saveTask } from './tasks';

// export const useSaveTaskMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (taskData: any) => {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       const savedTask = saveTask(taskData);
//       if (!savedTask) {
//         throw new Error('error save tasks');
//       }
//       return savedTask;
//     },
//     onSuccess: async () => {
//       await queryClient.invalidateQueries({ queryKey: ['tasks'] });
//     },
//   });
// };
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { saveTask } from './tasks';

// Примечание: taskData теперь типизирована как та, которую возвращает saveTask (Task),
// но для простоты оставим any, если у вас нет полной типизации.

export const useSaveTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: any) => {
      // **(Опционально) Удалить имитацию задержки в реальном приложении**
      // await new Promise((resolve) => setTimeout(resolve, 500));
     
      const savedTask = saveTask(taskData);
      if (!savedTask) {
        throw new Error('Failed to save task');
      }
      return savedTask; // Мутация должна вернуть созданный объект!
    },
   
    onSuccess: (newTask) => { // Tanstack Query передает результат mutationFn сюда (newTask)
      // ✅ УЛУЧШЕНИЕ: Мгновенное обновление кэша без лишнего запроса
      queryClient.setQueryData(['tasks'], (oldTasks: any[] | undefined) => {
        // Убеждаемся, что старые данные существуют, и добавляем новую задачу
        return oldTasks ? [...oldTasks, newTask] : [newTask];
      });
    },
  });
};
