export const TASKS_STORAGE_KEY = 'tasks';

export const getTasks = () => {
  try {
    const tasksString = localStorage.getItem(TASKS_STORAGE_KEY);
    return tasksString ? JSON.parse(tasksString) : [];
  } catch (error) {
    console.error('Failed to retrieve tasks from localStorage:', error);
    return [];
  }
};

export const saveTask = (taskData: any) => {
  try {
    const tasks = getTasks();

    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return newTask;
  } catch (error) {
    console.error('Failed to save task to localStorage:', error);
    return null;
  }
};
