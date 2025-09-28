<!-- <template>
  <div>
    <h2>Task list</h2>
    <div v-if="isLoading">Loading tasks</div>
    <div v-else-if="isError">Error loading tasks</div>

    <div v-else-if="tasks && tasks.length > 0">
      <ul>
        <li v-for="task in tasks" :key="task.id">
          <strong>{{ task.title }}</strong> - {{ task.description }}
          <br>
          <small>Priority {{ task.priority }}</small>
        </li>
      </ul>
    </div>

    <div v-else>
      <p>Create a new one</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTasksQuery } from '@/data/mutations/useTasksQuery';
const { data: tasks, isLoading, isError } = useTasksQuery();
</script> -->
<!--

<template>

  <div>
    <div class="flex justify-between items-center mb-4">
      <h2>Task list</h2>

      <Button
        @click="isModalOpen = true"
          class="flex items-center gap-2 bg-gray-400 text-white hover:bg-gray-300"
      >
                  <Plus class="h-4 w-4" />
 Create New Task
      </Button>
    </div>

    <div v-if="isLoading">Loading tasks</div>
    <div v-else-if="isError">Error loading tasks</div>

    <div v-else-if="tasks && tasks.length > 0">
      <ul>
        <li v-for="task in tasks" :key="task.id" class="border-b py-2">
          <strong>{{ task.title }}</strong> - {{ task.description }}
          <br>
          <small>Priority {{ task.priority }}</small>
        </li>
      </ul>
    </div>

    <div v-else>
      <p>No tasks found. Create a new one!</p>
    </div>

    <TaskModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTasksQuery } from '@/data/mutations/useTasksQuery';
import TaskModal from '@/components/Task-Modal/TaskModal.vue';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-vue-next'

const isModalOpen = ref(false);

const { data: tasks, isLoading, isError } = useTasksQuery();
<!-- </script> -->
<!--

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2>Task list</h2>
      <Button
        @click="isModalOpen = true"
        class="flex items-center gap-2 bg-gray-400 text-white hover:bg-gray-300"
      >
        <Plus class="h-4 w-4" />
        Create New Task
      </Button>
    </div>

    <AdvancedSearch />

    <div v-if="isLoading">Loading tasks</div>
    <div v-else-if="isError">Error loading tasks</div>
    <div v-else-if="tasks && tasks.length > 0">
      <ul>
        <li v-for="task in tasks" :key="task.id" class="border-b py-2">
          <strong>{{ task.title }}</strong> - {{ task.description }}
          <br />
          <small>Priority {{ task.priority }}</small>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No tasks found. Create a new one!</p>
    </div>
    <TaskModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTasksQuery } from '@/data/mutations/useTasksQuery';
import TaskModal from '@/components/Task-Modal/TaskModal.vue';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-vue-next';
import AdvancedSearch from '@/components//advanced-search/AdvancedSearch.vue';

const isModalOpen = ref(false);

const { data: tasks, isLoading, isError } = useTasksQuery();
</script> -->

<!--

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2>Task list</h2>

      <Button
        @click="isModalOpen = true"
        class="flex items-center gap-2 bg-gray-400 text-white hover:bg-gray-300"
      >
        <Plus class="h-4 w-4" />
        Create New Task
      </Button>
    </div>

    <AdvancedSearch
      :available-assignees="availableAssignees"
      :available-departments="availableDepartments"
      @on-filters-change="handleFiltersChange"
      class="mb-6"
    />

    <div v-if="isLoading">Loading tasks</div>
    <div v-else-if="isError">Error loading tasks</div>

    <div v-else-if="filteredTasks && filteredTasks.length > 0">
      <ul>
        <li
          v-for="task in filteredTasks"
          :key="task.id"
          class="border-b py-2"
        >
          <strong>{{ task.title }}</strong> - {{ task.description }}
          <br />
          <small>Priority {{ task.priority }}</small>
        </li>
      </ul>
    </div>

    <div v-else>
      <p>No tasks found. Create a new one!</p>
    </div>

    <TaskModal :is-open="isModalOpen" @close="isModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';
import { useTasksQuery } from '@/data/mutations/useTasksQuery';
import TaskModal from '@/components/Task-Modal/TaskModal.vue';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-vue-next';
import AdvancedSearch from '@/components//advanced-search/AdvancedSearch.vue';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignee?: string;
  department?: string;
  dueDate?: Date;
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
const activeFilters = ref<SearchFilters>({
  searchTerm: '',
  status: 'all',
  assignee: 'all',
  priority: 'all',
  department: 'all',
  dateFrom: undefined,
  dateTo: undefined,
});

const { data: tasks, isLoading, isError } = useTasksQuery() as {
  data: Ref<Task[] | undefined>;
  isLoading: Ref<boolean>;
  isError: Ref<boolean>;
};

const availableAssignees = computed(() => {
  if (!tasks.value) return [];
  return [...new Set(tasks.value.map(task => task.assignee).filter((a): a is string => a !== undefined))];
});

const availableDepartments = computed(() => {
  if (!tasks.value) return [];
  return [...new Set(tasks.value.map(task => task.department).filter((d): d is string => d !== undefined))];
});

const handleFiltersChange = (filters: SearchFilters) => {
  activeFilters.value = filters;
};

const filteredTasks = computed(() => {
  if (!tasks.value) {
    return [];
  }

  return tasks.value.filter((task: Task) => {
    const { searchTerm, status, assignee, priority, department, dateFrom, dateTo } = activeFilters.value;

    const matchesSearchTerm =
      !searchTerm ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.assignee && task.assignee.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = status === 'all' || task.status === status;
    const matchesPriority = priority === 'all' || task.priority === priority;
    const matchesAssignee = assignee === 'all' || task.assignee === assignee;
    const matchesDepartment = department === 'all' || task.department === department;

    const matchesDate =
      (!dateFrom || (task.dueDate && new Date(task.dueDate) >= new Date(dateFrom))) &&
      (!dateTo || (task.dueDate && new Date(task.dueDate) <= new Date(dateTo)));

    return (
      matchesSearchTerm &&
      matchesStatus &&
      matchesPriority &&
      matchesAssignee &&
      matchesDepartment &&
      matchesDate
    );
  });
});
</script> -->



<template>
    <div class="flex justify-between items-center mb-4">
      <h2>Task list</h2>
      <Button
        @click="isModalOpen = true"
        class="flex items-center gap-2 bg-gray-400 text-white hover:bg-gray-300"
      >
        <Plus class="h-4 w-4" />
        Create New Task
      </Button>
    </div>
        <TaskModal :is-open="isModalOpen" @close="isModalOpen = false" />

  <div class="space-y-6">
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
                    <DropdownMenuItem>Edit Task</DropdownMenuItem>
                    <DropdownMenuItem>Change Status</DropdownMenuItem>
                    <DropdownMenuItem class="text-destructive">Delete Task</DropdownMenuItem>
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
                  {{ task.department }}
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TaskModal from '@/components/Task-Modal/TaskModal.vue';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, User, MoreHorizontal } from 'lucide-vue-next';
import AdvancedSearch from '@/components//advanced-search/AdvancedSearch.vue'; // Предполагаемое имя файла
const isModalOpen = ref(false);


// Типы данных
interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  assignee: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  department: string;
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

// Моковые данные
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Clean Conference Room A",
    description: "Deep clean and sanitize conference room A for tomorrow's meeting",
    status: "todo",
    assignee: "John Smith",
    dueDate: "2024-01-15",
    priority: "high",
    department: "Housekeeping",
  },
  {
    id: "2",
    title: "Maintenance Check - HVAC System",
    description: "Monthly maintenance check for HVAC system on 3rd floor",
    status: "in-progress",
    assignee: "Sarah Johnson",
    dueDate: "2024-01-16",
    priority: "medium",
    department: "Maintenance",
  },
  {
    id: "3",
    title: "Inventory Count - Supplies",
    description: "Count and update inventory for office supplies",
    status: "completed",
    assignee: "Mike Davis",
    dueDate: "2024-01-14",
    priority: "low",
    department: "Facilities",
  },
  {
    id: "4",
    title: "Security System Update",
    description: "Update security system software and test all cameras",
    status: "todo",
    assignee: "Lisa Wilson",
    dueDate: "2024-01-17",
    priority: "high",
    department: "Security",
  },
  {
    id: "5",
    title: "Network Equipment Check",
    description: "Inspect and test all network equipment in server room",
    status: "in-progress",
    assignee: "Lisa Wilson",
    dueDate: "2024-01-18",
    priority: "medium",
    department: "IT Support",
  },
  {
    id: "6",
    title: "Bathroom Supplies Restock",
    description: "Restock all bathroom supplies on floors 1-5",
    status: "todo",
    assignee: "John Smith",
    dueDate: "2024-01-19",
    priority: "low",
    department: "Housekeeping",
  },
];

const tasks = ref<Task[]>(mockTasks);
const filters = ref<SearchFilters>({
  searchTerm: '',
  status: 'all',
  assignee: 'all',
  priority: 'all',
  department: 'all',
  dateFrom: undefined,
  dateTo: undefined,
});

// Метод для обновления фильтров
const setFilters = (newFilters: SearchFilters) => {
  filters.value = newFilters;
};

// Вычисляемое свойство для фильтрации
const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {
    const matchesSearch =
      !filters.value.searchTerm ||
      task.title.toLowerCase().includes(filters.value.searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.value.searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(filters.value.searchTerm.toLowerCase());

    const matchesStatus = filters.value.status === 'all' || task.status === filters.value.status;
    const matchesAssignee = filters.value.assignee === 'all' || task.assignee === filters.value.assignee;
    const matchesPriority = filters.value.priority === 'all' || task.priority === filters.value.priority;
    const matchesDepartment = filters.value.department === 'all' || task.department === filters.value.department;

    const taskDate = new Date(task.dueDate);
    const matchesDateFrom = !filters.value.dateFrom || taskDate.getTime() >= filters.value.dateFrom.getTime();
    const matchesDateTo = !filters.value.dateTo || taskDate.getTime() <= filters.value.dateTo.getTime();

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

// Вычисляемое свойство для сортировки задач по статусу
const tasksByStatus = computed(() => {
  return {
    todo: filteredTasks.value.filter((task) => task.status === "todo"),
    "in-progress": filteredTasks.value.filter((task) => task.status === "in-progress"),
    completed: filteredTasks.value.filter((task) => task.status === "completed"),
  };
});

// Вычисляемые свойства для уникальных списков
const uniqueAssignees = computed(() => {
  return Array.from(new Set(tasks.value.map((task) => task.assignee)));
});

const uniqueDepartments = computed(() => {
  return Array.from(new Set(tasks.value.map((task) => task.department)));
});

// Методы для стилей
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-800 border-red-200";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
</script>
