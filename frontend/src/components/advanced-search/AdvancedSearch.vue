<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Calendar as CalendarIcon } from "lucide-vue-next"

interface SearchFilters {
  searchTerm: string
  status: string
  assignee: string
  priority: string
  department: string
  dateFrom: Date | undefined
  dateTo: Date | undefined
}

const props = defineProps<{
  onFiltersChange?: (filters: SearchFilters) => void
  availableAssignees: string[]
  availableDepartments: string[]
}>()

const filters = ref<SearchFilters>({
  searchTerm: "",
  status: "all",
  assignee: "all",
  priority: "all",
  department: "all",
  dateFrom: undefined,
  dateTo: undefined,
})

const isExpanded = ref(false)

const getActiveFiltersCount = computed(() => {
  let count = 0
  if (filters.value.searchTerm) count++
  if (filters.value.status !== "all") count++
  if (filters.value.assignee !== "all") count++
  if (filters.value.priority !== "all") count++
  if (filters.value.department !== "all") count++
  if (filters.value.dateFrom || filters.value.dateTo) count++
  return count
})

const updateFilter = (key: keyof SearchFilters, value: any) => {
  filters.value = { ...filters.value, [key]: value }
}

const clearFilters = () => {
  const clearedFilters: SearchFilters = {
    searchTerm: "",
    status: "all",
    assignee: "all",
    priority: "all",
    department: "all",
    dateFrom: undefined,
    dateTo: undefined,
  }
  filters.value = clearedFilters
}

const clearDateRange = () => {
  updateFilter("dateFrom", undefined)
  updateFilter("dateTo", undefined)
}

watch(
  filters,
  (newFilters) => {
    if (props.onFiltersChange) {
      props.onFiltersChange(newFilters)
    }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="flex items-center gap-2">
          <Search class="h-5 w-5" />
          Search & Filter
          <Badge v-if="getActiveFiltersCount > 0" variant="secondary" class="ml-2">
            {{ getActiveFiltersCount }} active
          </Badge>
        </CardTitle>
        <div class="flex items-center gap-2">
          <Button v-if="getActiveFiltersCount > 0" variant="outline" size="sm" @click="clearFilters">
            <X class="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button variant="outline" size="sm" @click="isExpanded = !isExpanded">
            <Filter class="h-4 w-4 mr-1" />
            {{ isExpanded ? "Hide" : "Show" }} Filters
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks by title, description, or assignee..."
          :model-value="filters.searchTerm"
          @update:model-value="(value) => updateFilter('searchTerm', value)"
          class="pl-10"
        />
      </div>

      <div v-if="isExpanded" class="space-y-4 pt-4 border-t">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="space-y-2">
            <Label>Status</Label>
            <Select :model-value="filters.status" @update:model-value="(value) => updateFilter('status', value)">
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Priority</Label>
            <Select :model-value="filters.priority" @update:model-value="(value) => updateFilter('priority', value)">
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Assignee</Label>
            <Select :model-value="filters.assignee" @update:model-value="(value) => updateFilter('assignee', value)">
              <SelectTrigger>
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem v-for="assignee in availableAssignees" :key="assignee" :value="assignee">
                  {{ assignee }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Department</Label>
            <Select :model-value="filters.department" @update:model-value="(value) => updateFilter('department', value)">
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem v-for="dept in availableDepartments" :key="dept" :value="dept">
                  {{ dept }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Due Date From</Label>
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="cn('w-full justify-start text-left font-normal', !filters.dateFrom && 'text-muted-foreground')"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ filters.dateFrom ? format(filters.dateFrom, "PPP") : "Select date" }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  :selected="filters.dateFrom"
                  @update:selected="(date: any) => updateFilter('dateFrom', date)"
                  initial-focus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div class="space-y-2">
            <Label>Due Date To</Label>
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="cn('w-full justify-start text-left font-normal', !filters.dateTo && 'text-muted-foreground')"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ filters.dateTo ? format(filters.dateTo, "PPP") : "Select date" }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  :selected="filters.dateTo"
                  @update:selected="(date: any) => updateFilter('dateTo', date)"
                  initial-focus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div v-if="getActiveFiltersCount > 0" class="flex flex-wrap gap-2 pt-2 border-t">
          <span class="text-sm text-muted-foreground">Active filters:</span>
          <Badge v-if="filters.searchTerm" variant="outline" class="gap-1">
            Search: {{ filters.searchTerm }}
            <X class="h-3 w-3 cursor-pointer" @click="updateFilter('searchTerm', '')" />
          </Badge>
          <Badge v-if="filters.status !== 'all'" variant="outline" class="gap-1">
            Status: {{ filters.status }}
            <X class="h-3 w-3 cursor-pointer" @click="updateFilter('status', 'all')" />
          </Badge>
          <Badge v-if="filters.priority !== 'all'" variant="outline" class="gap-1">
            Priority: {{ filters.priority }}
            <X class="h-3 w-3 cursor-pointer" @click="updateFilter('priority', 'all')" />
          </Badge>
          <Badge v-if="filters.assignee !== 'all'" variant="outline" class="gap-1">
            Assignee: {{ filters.assignee }}
            <X class="h-3 w-3 cursor-pointer" @click="updateFilter('assignee', 'all')" />
          </Badge>
          <Badge v-if="filters.department !== 'all'" variant="outline" class="gap-1">
            Department: {{ filters.department }}
            <X class="h-3 w-3 cursor-pointer" @click="updateFilter('department', 'all')" />
          </Badge>
          <Badge v-if="filters.dateFrom || filters.dateTo" variant="outline" class="gap-1">
            Date Range
            <X class="h-3 w-3 cursor-pointer" @click="clearDateRange" />
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
