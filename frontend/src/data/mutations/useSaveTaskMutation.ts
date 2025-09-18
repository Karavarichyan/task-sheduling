import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { saveTask } from './tasks'

export const useSaveTaskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskData: any) => {
      const savedTask = saveTask(taskData)
      if (!savedTask) {
        throw new Error('Failed to save task')
      }
      return savedTask
    },
    onSuccess: (newTask) => {
      queryClient.setQueryData(['tasks'], (oldTasks: any[] | undefined) => {
        return oldTasks ? [...oldTasks, newTask] : [newTask]
      })
    },
  })
}
