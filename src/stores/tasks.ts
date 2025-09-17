import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Task, TaskRequest } from "@/types/api/tasks";
import {
  getTasks as getTasksAPI,
  updateTask as updateTaskAPI,
  createTask as createTaskAPI,
  deleteTask as deleteTaskAPI,
  deleteTasks as deleteTasksAPI,
} from "@/services/tasks";

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const editingCells = ref<Record<string, string>>({});
  const searchQuery = ref<string>("");
  const selectedTaskIds = ref<string[]>([]);
  const selectedDevelopers = ref<string[]>([]);
  const sortColumns = ref<Array<{ column: string; order: "asc" | "desc" }>>([]);
  const appliedSortColumns = ref<
    Array<{ column: string; order: "asc" | "desc" }>
  >([]);

  const filteredTasks = computed(() => {
    let filtered = [...tasks.value];

    if (searchQuery.value) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }

    if (selectedDevelopers.value.length > 0) {
      filtered = filtered.filter((task) =>
        task.developers.some((dev) => selectedDevelopers.value.includes(dev))
      );
    }

    if (appliedSortColumns.value.length > 0) {
      filtered.sort((a, b) => {
        for (const sortCol of appliedSortColumns.value) {
          const { column, order } = sortCol;
          let aValue = a[column as keyof Task];
          let bValue = b[column as keyof Task];

          if (column === "developers") {
            aValue = (aValue as string[]).join(", ");
            bValue = (bValue as string[]).join(", ");
          } else if (column === "date") {
            aValue = new Date(aValue as string).getTime();
            bValue = new Date(bValue as string).getTime();
          } else if (column === "estimatedSp" || column === "actualSp") {
            aValue = Number(aValue) || 0;
            bValue = Number(bValue) || 0;
          } else {
            aValue = String(aValue).toLowerCase();
            bValue = String(bValue).toLowerCase();
          }

          if (aValue < bValue) {
            return order === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return order === "asc" ? 1 : -1;
          }
        }
        return 0;
      });
    }

    return filtered;
  });

  const getTaskById = computed(() => {
    return (id: string) => tasks.value.find((task) => task.id === id);
  });

  const isCellEditing = computed(() => {
    return (taskId: string, field: string) =>
      editingCells.value[`${taskId}_${field}`] === "editing";
  });

  const isTaskEditing = computed(() => {
    return (id: string) =>
      Object.keys(editingCells.value).some((key) => key.startsWith(`${id}_`));
  });

  async function fetchTasks() {
    if (tasks.value.length > 0) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const fetchedTasks = await getTasksAPI();
      tasks.value = fetchedTasks;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch tasks";
      console.error("Error fetching tasks:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateTask(id: string, updates: Partial<TaskRequest>) {
    try {
      isLoading.value = true;
      error.value = null;

      const existingTask = tasks.value.find((task) => task.id === id);
      if (!existingTask) {
        throw new Error("Task not found");
      }

      const updatedTask = await updateTaskAPI(id, updates);

      const mergedTask = {
        ...existingTask,
        ...updatedTask,

        id: existingTask.id,
      };

      const index = tasks.value.findIndex((task) => task.id === id);
      if (index > -1) {
        tasks.value[index] = mergedTask;
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to update task";
      console.error("Error updating task:", err);
    } finally {
      isLoading.value = false;
      stopEditing();
    }
  }

  function startEditing(taskId: string, field: string) {
    editingCells.value[`${taskId}_${field}`] = "editing";
  }

  function stopEditing(taskId?: string, field?: string) {
    if (taskId && field) {
      delete editingCells.value[`${taskId}_${field}`];
    } else {
      editingCells.value = {};
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  function setDeveloperFilter(developers: string[]) {
    selectedDevelopers.value = developers;
  }

  function setSortColumns(
    columns: Array<{ column: string; order: "asc" | "desc" }>
  ) {
    appliedSortColumns.value = columns;
  }

  function clearFilters() {
    searchQuery.value = "";
    selectedDevelopers.value = [];
    sortColumns.value = [];
    appliedSortColumns.value = [];
  }

  function toggleTaskSelection(id: string) {
    const index = selectedTaskIds.value.indexOf(id);
    if (index > -1) {
      selectedTaskIds.value.splice(index, 1);
    } else {
      selectedTaskIds.value.push(id);
    }
  }

  function selectAllTasks(selected: boolean) {
    if (selected) {
      selectedTaskIds.value = filteredTasks.value.map((task) => task.id);
    } else {
      selectedTaskIds.value = [];
    }
  }

  async function addTask(task: TaskRequest) {
    try {
      isLoading.value = true;
      error.value = null;

      const newTask = await createTaskAPI(task);

      tasks.value.unshift(newTask);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to create task";
      console.error("Error creating task:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTask(id: string) {
    try {
      isLoading.value = true;
      error.value = null;

      await deleteTaskAPI(id);

      const index = tasks.value.findIndex((task) => task.id === id);
      if (index > -1) {
        tasks.value.splice(index, 1);

        const selectionIndex = selectedTaskIds.value.indexOf(id);
        if (selectionIndex > -1) {
          selectedTaskIds.value.splice(selectionIndex, 1);
        }
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to delete task";
      console.error("Error deleting task:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTasks(ids: string[]) {
    try {
      isLoading.value = true;
      error.value = null;

      await deleteTasksAPI(ids);

      tasks.value = tasks.value.filter((task) => !ids.includes(task.id));

      selectedTaskIds.value = selectedTaskIds.value.filter(
        (id) => !ids.includes(id)
      );
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to delete tasks";
      console.error("Error deleting tasks:", err);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    tasks,
    isLoading,
    error,
    editingCells,
    searchQuery,
    selectedTaskIds,
    selectedDevelopers,
    sortColumns,
    appliedSortColumns,

    filteredTasks,
    getTaskById,
    isCellEditing,
    isTaskEditing,

    fetchTasks,
    updateTask,
    startEditing,
    stopEditing,
    setSearchQuery,
    setDeveloperFilter,
    setSortColumns,
    clearFilters,
    toggleTaskSelection,
    selectAllTasks,
    addTask,
    deleteTask,
    deleteTasks,
  };
});
