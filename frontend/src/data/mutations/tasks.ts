export const TASKS_STORAGE_KEY = 'tasks';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

export type NewTaskPayload = Omit<Task, 'id' | 'createdAt'>;
export type UpdateTaskPayload = Partial<Task> & { id: string };


export const getTasks = (): Task[] => {
  try {
    const tasksString = localStorage.getItem(TASKS_STORAGE_KEY);
    const tasks: Task[] = tasksString ? JSON.parse(tasksString) : [];
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    return [];
  }
};


export const saveTask = (taskData: NewTaskPayload): Task | null => {
  try {
    const tasks = getTasks();

    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return newTask;
  } catch (error) {
    return null;
  }
};


export const updateTask = (payload: UpdateTaskPayload): Task | null => {
  try {
    const tasks = getTasks();
    const index = tasks.findIndex(t => t.id === payload.id);

    if (index === -1) {
      console.error(`Task with ID ${payload.id} not found.`);
      return null;
    }

    const updatedTask: Task = {
      ...tasks[index],
      ...payload,
    };

    tasks[index] = updatedTask;
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return updatedTask;

  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
};


export const deleteTask = (taskId: string): boolean => {
  try {
    let tasks = getTasks();
    const initialLength = tasks.length;

    tasks = tasks.filter(t => t.id !== taskId);

    if (tasks.length === initialLength) {
        console.warn(`Task with ID ${taskId} not found for deletion.`);
        return false;
    }

    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
};
