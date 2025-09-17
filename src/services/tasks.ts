import { api } from "@/api";

import type { Task, TaskRequest } from "@/types/api/tasks";

import { normalizeTask } from "@/utils/normalize-task";

let cachedTasks: Task[] | null = null;

export async function getTasks(): Promise<Task[]> {
  if (cachedTasks !== null) {
    return [...cachedTasks];
  }

  const response = await api.get("");
  const { data } = response.data;

  if (!Array.isArray(data)) {
    throw new Error("Expected array of tasks");
  }

  cachedTasks = data.map((task, index) => normalizeTask(task, index));
  return [...cachedTasks];
}

export async function updateTask(
  id: string,
  updates: Partial<TaskRequest>
): Promise<Partial<Task>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!cachedTasks) {
      throw new Error("No tasks loaded");
    }

    const taskIndex = cachedTasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    const existingTask = cachedTasks[taskIndex];
    const updatedFields: Partial<Task> = { id };

    if (updates.title !== undefined) {
      existingTask.title = updates.title;
      updatedFields.title = updates.title;
    }
    if (updates.developer !== undefined) {
      existingTask.developers = updates.developer
        .split(",")
        .map((dev) => dev.trim());
      updatedFields.developers = existingTask.developers;
    }
    if (updates.priority !== undefined) {
      existingTask.priority = updates.priority;
      updatedFields.priority = updates.priority;
    }
    if (updates.status !== undefined) {
      existingTask.status = updates.status;
      updatedFields.status = updates.status;
    }
    if (updates.type !== undefined) {
      existingTask.type = updates.type;
      updatedFields.type = updates.type;
    }
    if (updates.estimatedSp !== undefined) {
      existingTask.estimatedSp = updates.estimatedSp;
      updatedFields.estimatedSp = updates.estimatedSp;
    }
    if (updates.actualSp !== undefined) {
      existingTask.actualSp = updates.actualSp;
      updatedFields.actualSp = updates.actualSp;
    }
    if (updates.date !== undefined) {
      existingTask.date = updates.date;
      updatedFields.date = updates.date;
    }

    console.log(`Updated task ${id}:`, updatedFields);
    return updatedFields;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
}

export async function createTask(task: TaskRequest): Promise<Task> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newTask: Task = {
      id: Date.now().toString(),
      title: task.title,
      developers: task.developer.split(",").map((dev) => dev.trim()),
      priority: task.priority,
      status: task.status,
      type: task.type,
      estimatedSp: task.estimatedSp,
      actualSp: task.actualSp,
      date: task.date || new Date().toISOString(),
    };

    if (cachedTasks) {
      cachedTasks.unshift(newTask);
    }

    return newTask;
  } catch (error) {
    throw new Error("Failed to create task");
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!cachedTasks) {
      throw new Error("No tasks loaded");
    }

    const taskIndex = cachedTasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    cachedTasks.splice(taskIndex, 1);
    console.log(`Deleted task ${id}`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
}

export async function deleteTasks(ids: string[]): Promise<void> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!cachedTasks) {
      throw new Error("No tasks loaded");
    }

    cachedTasks = cachedTasks.filter((task) => !ids.includes(task.id));
    console.log(`Deleted tasks:`, ids);
  } catch (error) {
    console.error("Error deleting tasks:", error);
    throw new Error("Failed to delete tasks");
  }
}
