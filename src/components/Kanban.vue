<template>
  <div class="flex flex-col h-full">
    <Toolbar
      @new-task="handleNewTask"
      @search="handleSearch"
      @person-filter="handlePersonFilter"
      @sort="handleSort"
    />

    <div class="flex-1 p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div
          v-for="status in statusColumns"
          :key="status"
          class="bg-gray-800 rounded-lg p-4"
        >
          <h3 class="text-sm font-medium text-gray-300 mb-4">{{ status }}</h3>
          <div class="space-y-3">
            <div
              v-for="task in getTasksByStatus(status)"
              :key="task.id"
              class="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <h4 class="text-sm font-medium text-white mb-2">
                {{ task.title }}
              </h4>
              <div
                class="flex items-center justify-between text-xs text-gray-400"
              >
                <span>{{ task.priority }}</span>
                <span>{{ task.type }}</span>
              </div>
              <div class="mt-2 text-xs text-gray-400">
                {{ task.developers.join(", ") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Toolbar from "./Toolbar.vue";
import { useTasksStore } from "@/stores/tasks";
import type { Task, Status } from "@/types/api/tasks";

const tasksStore = useTasksStore();
const searchQuery = ref("");

onMounted(() => {
  tasksStore.fetchTasks();
});

const statusColumns: Status[] = [
  "Ready to start",
  "In Progress",
  "Waiting for review",
  "Done",
  "Stuck",
  "Pending Deploy",
];

const filteredTasks = computed(() => {
  if (!tasksStore.tasks) return [];

  if (!searchQuery.value) return tasksStore.tasks;

  return tasksStore.tasks.filter((task: Task) =>
    task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const getTasksByStatus = (status: Status) => {
  return filteredTasks.value.filter((task: Task) => task.status === status);
};

const handleNewTask = () => {
  console.log("New task clicked");
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const handlePersonFilter = () => {
  console.log("Person filter clicked");
};

const handleSort = () => {
  console.log("Sort clicked");
};
</script>

<style scoped></style>
