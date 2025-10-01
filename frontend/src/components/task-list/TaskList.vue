<template>
  <div class="flex justify-between items-center mb-4">
    <h2>Task list</h2>
    <Button
      @click="openCreateModal"
        class="flex items-center gap-2 bg-gray-400 text-white hover:bg-gray-300"
    >
      <Plus class="h-4 w-4" />
      Create New Task
    </Button>
  </div>

  <TaskModal
    :is-open="isModalOpen"
    :initial-data="taskToEdit"
    @close="isModalOpen = false"
    @success="handleSuccess"
  />
 <DeleteConfirmationModal
    :is-open="isDeleteModalOpen"
    :item-id="taskIdToDelete"
    :is-pending="isDeleting"
    @close="isDeleteModalOpen = false"
    @confirm="confirmDeletion"
  />
  <div class="space-y-6">
    <div v-if="isLoading" class="text-center py-12 text-lg text-gray-500">
      Loading tasks...
    </div>
    <div v-else-if="isError" class="text-center py-12 text-lg text-red-600">
      Error loading tasks: {{ (error as Error).message }}
    </div>
    <div v-else-if="!tasks || tasks.length === 0" class="text-center py-12 text-lg text-gray-500">
      No tasks created yet.
    </div>

    <div v-else>
      <AdvancedSearch
        :available-assignees="uniqueAssignees"
        :available-departments="uniqueDepartments"
        @on-filters-change="setFilters"
      />

      <Card>
        <CardContent class="py-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground">
              Showing {{ filteredTasks.length }} of {{ tasks.length }} tasks
            </span>
            <div class="flex items-center gap-4">
              <span class="text-muted-foreground">
                To Do:
                <span class="font-medium text-blue-600">{{ tasksByStatus.todo.length }}</span>
              </span>
              <span class="text-muted-foreground">
                In Progress:
                <span class="font-medium text-orange-600">{{ tasksByStatus["in-progress"].length }}</span>
              </span>
              <span class="text-muted-foreground">
                Completed:
                <span class="font-medium text-green-600">{{ tasksByStatus.completed.length }}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="([status, statusTasks]) in Object.entries(tasksByStatus)" :key="status" class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-lg capitalize flex items-center gap-2">
              {{ status.replace("-", " ") }}
              <Badge variant="secondary" class="text-xs">
                {{ statusTasks.length }}
              </Badge>
            </h3>
          </div>

          <div class="space-y-3">
            <Card v-for="task in statusTasks" :key="task.id" class="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent class="p-4">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-medium text-sm">{{ task.title }}</h4>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="sm" class="h-6 w-6 p-0">
                        <MoreHorizontal class="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleEdit(task)">Edit Task</DropdownMenuItem>
                      <DropdownMenuItem class="text-destructive" @click="handleDelete(task.id)">
                          Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p class="text-xs text-muted-foreground mb-3 line-clamp-2">{{ task.description }}</p>

                <div class="flex items-center justify-between text-xs mb-3">
                  <div class="flex items-center gap-1 text-muted-foreground">
                    <User class="h-3 w-3" />
                    <span>{{ task.assignee }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-muted-foreground">
                    <Calendar class="h-3 w-3" />
                    <span>{{ new Date(task.dueDate).toLocaleDateString() }}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <Badge :class="getPriorityColor(task.priority)">{{ task.priority }}</Badge>
                  <Badge variant="outline" class="text-xs">
                    {{ task.department || 'N/A' }}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div v-if="statusTasks.length === 0" class="text-center py-8 text-muted-foreground">
              <p class="text-sm">No tasks match your filters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';

import { getTasks, deleteTask } from '@/data/mutations/tasks';

import TaskModal from '@/components/Task-Modal/TaskModal.vue';
import AdvancedSearch from '@/components//advanced-search/AdvancedSearch.vue';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, User, MoreHorizontal, Plus } from 'lucide-vue-next';
import DeleteConfirmationModal from '../remove-modal/DeleteConfirmationModal.vue';
interface Task {
    id: string;
    title: string;
    description: string;
    status: "todo" | "in-progress" | "completed";
    assignee: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
    department?: string;
}

interface SearchFilters {
  searchTerm: string;
  status: string;
  assignee: string;
  priority: string;
  department: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}


const isModalOpen = ref(false);
const taskToEdit = ref<Task | null>(null);
const isDeleteModalOpen = ref(false);
const taskIdToDelete = ref<string | null>(null);
const isDeleting = ref(false);
const queryClient = useQueryClient();

const { data: tasks, isLoading, isError, error } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const fetchedTasks = getTasks() as unknown as Task[];

      return fetchedTasks.map(t => ({
          ...t,
          status: t.status || 'todo',
          department: t.department || 'N/A'
      }));
    },
    initialData: [],
});



const openCreateModal = () => {
    taskToEdit.value = null;
    isModalOpen.value = true;
};

const handleEdit = (task: Task) => {
    taskToEdit.value = task;
    isModalOpen.value = true;
};

const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    isModalOpen.value = false;
};


const handleDelete = (taskId: string) => {
    taskIdToDelete.value = taskId;
    isDeleteModalOpen.value = true;
};
const confirmDeletion = async () => {
    if (!taskIdToDelete.value) return;

    isDeleting.value = true;

    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const success = deleteTask(taskIdToDelete.value);

        if (success) {
            handleSuccess();
        } else {
            alert('Failed to delete task.');
        }
    } catch (error) {
        console.error("Deletion error:", error);
        alert('An unexpected error occurred during deletion.');
    } finally {
        isDeleting.value = false;
        isDeleteModalOpen.value = false;
        taskIdToDelete.value = null;
    }
};

const filters = ref<SearchFilters>({
  searchTerm: '',
  status: 'all',
  assignee: 'all',
  priority: 'all',
  department: 'all',
  dateFrom: undefined,
  dateTo: undefined,
});

const setFilters = (newFilters: SearchFilters) => {
  filters.value = newFilters;
};

const filteredTasks = computed(() => {
    if (!tasks.value) return [];

    const term = filters.value.searchTerm.toLowerCase();

    return tasks.value.filter((task) => {
        const matchesSearch =
            !term ||
            task.title.toLowerCase().includes(term) ||
            task.description.toLowerCase().includes(term) ||
            task.assignee.toLowerCase().includes(term);

        const matchesStatus = filters.value.status === 'all' || task.status === filters.value.status;
        const matchesAssignee = filters.value.assignee === 'all' || task.assignee === filters.value.assignee;
        const matchesPriority = filters.value.priority === 'all' || task.priority === filters.value.priority;
        const matchesDepartment = filters.value.department === 'all' || task.department === filters.value.department;

        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        const taskDateMs = taskDate.getTime();

        const dateFromMs = filters.value.dateFrom
            ? new Date(filters.value.dateFrom).setHours(0, 0, 0, 0)
            : null;

        const dateToMs = filters.value.dateTo
            ? new Date(filters.value.dateTo).setHours(23, 59, 59, 999)
            : null;

        const matchesDateFrom = !dateFromMs || taskDateMs >= dateFromMs;
        const matchesDateTo = !dateToMs || taskDateMs <= dateToMs;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesAssignee &&
            matchesPriority &&
            matchesDepartment &&
            matchesDateFrom &&
            matchesDateTo
        );
    });
});

const tasksByStatus = computed(() => {
  const allFilteredTasks = filteredTasks.value;
  return {
    todo: allFilteredTasks.filter((task) => task.status === "todo"),
    "in-progress": allFilteredTasks.filter((task) => task.status === "in-progress"),
    completed: allFilteredTasks.filter((task) => task.status === "completed"),
  };
});



const uniqueAssignees = computed(() => {
    if (!tasks.value) return [];
    return Array.from(new Set(tasks.value.map((task) => task.assignee)));
});

const uniqueDepartments = computed(() => {
    if (!tasks.value) return [];
    return Array.from(new Set(tasks.value.map((task) => task.department).filter((d): d is string => !!d)));
});

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-800 border-red-200";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
</script>
