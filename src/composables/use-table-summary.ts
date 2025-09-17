import { computed } from "vue";

import type { Task } from "@/types/api/tasks";

import { calculateSegments } from "@/utils/segment-bars";

export const useTableSummary = (filteredTasks: any) => {
  const statusSegments = computed(() =>
    calculateSegments(filteredTasks.value, "status")
  );

  const prioritySegments = computed(() =>
    calculateSegments(filteredTasks.value, "priority")
  );

  const typeSegments = computed(() =>
    calculateSegments(filteredTasks.value, "type")
  );

  const totalEstimatedSp = computed(() => {
    if (!filteredTasks.value) return 0;
    return filteredTasks.value.reduce((sum: number, task: Task) => {
      return sum + (task.estimatedSp >= 0 ? task.estimatedSp : 0);
    }, 0);
  });

  const totalActualSp = computed(() => {
    if (!filteredTasks.value) return 0;
    return filteredTasks.value.reduce((sum: number, task: Task) => {
      return sum + (task.actualSp >= 0 ? task.actualSp : 0);
    }, 0);
  });

  return {
    statusSegments,
    prioritySegments,
    typeSegments,
    totalEstimatedSp,
    totalActualSp,
  };
};
