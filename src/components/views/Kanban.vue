<template>
  <div class="flex flex-col h-full">
    <Toolbar
      @new-task="handleNewTask"
      @search="handleSearch"
      @openPersonFilter="showPersonFilterModal"
      @openSortModal="showSortModal"
    />

    <div class="flex-1 py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div
          v-for="status in statusColumns"
          :key="status"
          class="rounded-lg overflow-hidden transition-all duration-200"
          :class="{
            'ring-2 ring-blue-400 ring-opacity-50': dragOverColumn === status,
            'scale-105': dragOverColumn === status,
          }"
          :style="{ backgroundColor: 'oklch(0.35 0.05 270)' }"
          @drop="handleDrop($event, status)"
          @dragover.prevent
          @dragenter="handleDragEnter(status)"
          @dragleave="handleDragLeave($event)"
        >
          <div
            class="px-4 py-3 text-white font-medium text-sm flex items-center justify-between"
            :style="{ backgroundColor: getStatusHeaderColor(status) }"
          >
            <span>{{ status }}</span>
            <span class="bg-black bg-opacity-20 px-2 py-1 rounded text-xs">
              {{ getTasksByStatus(status).length }}
            </span>
          </div>

          <div class="p-4 space-y-3">
            <div
              v-if="getTasksByStatus(status).length === 0"
              class="text-center py-8 text-gray-400"
            >
              <p class="text-sm">
                {{ hasActiveFilters ? "Not found" : "No tasks" }}
              </p>
            </div>
            <div
              v-for="task in getTasksByStatus(status)"
              :key="task.id"
              class="bg-card rounded-lg p-3 cursor-move hover:bg-opacity-80 transition-all duration-200 space-y-4"
              :class="{
                'opacity-50 scale-95': draggedTask?.id === task.id,
              }"
              :style="{
                backgroundColor: 'oklch(0.30 0.05 270)',
              }"
              draggable="true"
              @dragstart="handleDragStart($event, task)"
              @dragend="handleDragEnd"
            >
              <h4 class="text-sm font-medium text-white">
                {{ task.title }}
              </h4>

              <div class="flex flex-wrap gap-2 items-center">
                <div
                  class="px-2 py-1 rounded text-xs font-medium text-white w-fit border-l-2 bg-gray-500"
                  :style="{
                    borderLeftColor: getPriorityColorHex(task.priority),
                  }"
                >
                  {{ task.priority }}
                </div>
                <div
                  class="px-2 py-1 rounded text-xs font-medium text-white w-fit border-l-2 bg-gray-500"
                  :style="{ borderLeftColor: getTypeColorHex(task.type) }"
                >
                  {{ task.type }}
                </div>
                <div
                  class="flex text-xs px-2 py-1 rounded text-white w-fit bg-gray-500"
                >
                  <span>{{ task.estimatedSp }} SP</span>
                </div>
              </div>

              <div class="flex items-center">
                <DeveloperAvatars :developers="task.developers" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NewTaskModal
      :visible="newTaskModalVisible"
      @update:visible="newTaskModalVisible = $event"
    />

    <PersonFilterModal
      :visible="personFilterVisible"
      :initial-developers="tasksStore.selectedDevelopers"
      @update:visible="personFilterVisible = $event"
      @apply="handlePersonFilterApply"
    />

    <SortModal
      :visible="sortModalVisible"
      :initial-sort="tasksStore.appliedSortColumns"
      @update:visible="sortModalVisible = $event"
      @apply="handleSortApply"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { message } from "ant-design-vue";

import Toolbar from "../ui/Toolbar.vue";
import DeveloperAvatars from "../ui/DeveloperAvatars.vue";
import NewTaskModal from "../modals/NewTaskModal.vue";
import PersonFilterModal from "../modals/PersonFilterModal.vue";
import SortModal from "../modals/SortModal.vue";

import { useTasksStore } from "@/stores/tasks";

import type { Task, Status } from "@/types/api/tasks";
import { STATUS_COLORS, PRIORITY_COLORS, TYPE_COLORS } from "@/constants/index";

const tasksStore = useTasksStore();
const newTaskModalVisible = ref(false);
const personFilterVisible = ref(false);
const sortModalVisible = ref(false);

onMounted(() => {
  tasksStore.fetchTasks();
});

const statusColumns: Status[] = [
  "Ready to start",
  "In Progress",
  "Waiting for review",
  "Stuck",
  "Done",
  "Pending Deploy",
];

const filteredTasks = computed(() => {
  return tasksStore.filteredTasks;
});

const hasActiveFilters = computed(() => {
  return (
    tasksStore.searchQuery.length > 0 ||
    tasksStore.selectedDevelopers.length > 0
  );
});

const getTasksByStatus = (status: Status) => {
  return filteredTasks.value.filter((task: Task) => task.status === status);
};

const getStatusHeaderColor = (status: Status): string => {
  return STATUS_COLORS[status] || "#6b7280";
};

const getPriorityColorHex = (priority: string): string => {
  return PRIORITY_COLORS[priority] || "#6b7280";
};

const getTypeColorHex = (type: string): string => {
  return TYPE_COLORS[type] || "#6b7280";
};

const handleNewTask = () => {
  newTaskModalVisible.value = true;
};

const handleSearch = (query: string) => {
  tasksStore.setSearchQuery(query);
};

const showPersonFilterModal = () => {
  personFilterVisible.value = true;
};

const showSortModal = () => {
  sortModalVisible.value = true;
};

const handlePersonFilterApply = (selectedDevelopers: string[]) => {
  tasksStore.setDeveloperFilter(selectedDevelopers);
  personFilterVisible.value = false;
};

const handleSortApply = (
  sortColumns: Array<{ column: string; order: "asc" | "desc" }>
) => {
  tasksStore.setSortColumns(sortColumns);
  sortModalVisible.value = false;
};

const draggedTask = ref<Task | null>(null);
const dragOverColumn = ref<Status | null>(null);

const handleDragStart = (event: DragEvent, task: Task) => {
  draggedTask.value = task;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", task.id);
  }
};

const handleDragEnter = (status: Status) => {
  dragOverColumn.value = status;
};

const handleDragLeave = (event: DragEvent) => {
  const target = event.currentTarget as HTMLElement;
  const relatedTarget = event.relatedTarget as HTMLElement;

  if (!target.contains(relatedTarget)) {
    dragOverColumn.value = null;
  }
};

const handleDragEnd = () => {
  draggedTask.value = null;
  dragOverColumn.value = null;
};

const handleDrop = async (event: DragEvent, newStatus: Status) => {
  event.preventDefault();
  dragOverColumn.value = null;

  if (!draggedTask.value || draggedTask.value.status === newStatus) {
    return;
  }

  const oldStatus = draggedTask.value.status;
  const taskTitle = draggedTask.value.title;

  try {
    await tasksStore.updateTaskStatus(draggedTask.value.id, newStatus);
    message.success(
      `Task "${taskTitle}" moved from "${oldStatus}" to "${newStatus}"`
    );
  } catch (error) {
    console.error("Failed to update task status:", error);
    message.error("Failed to move task. Please try again.");
  } finally {
    draggedTask.value = null;
  }
};
</script>

<style scoped></style>
