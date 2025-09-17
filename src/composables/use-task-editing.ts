import { ref } from 'vue';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import { useTasksStore } from '@/stores/tasks';
import { validateTaskField } from '@/utils/validation';
import type { Task } from '@/types/api/tasks';

export const useTaskEditing = () => {
  const tasksStore = useTasksStore();
  const editingValues = ref<Record<string, any>>({});

  const startEditing = (record: Task, field: string) => {
    tasksStore.startEditing(record.id, field);

    const fieldValue = getFieldValue(record, field);
    editingValues.value[`${record.id}_${field}`] = fieldValue;
  };

  const getFieldValue = (record: Task, field: string) => {
    switch (field) {
      case 'developer':
        return record.developers;
      case 'date':
        return record.date ? dayjs(record.date) : null;
      case 'title':
      case 'status':
      case 'priority':
      case 'type':
      case 'estimatedSp':
      case 'actualSp':
        return (record as any)[field];
      default:
        return (record as any)[field];
    }
  };

  const saveTask = async (taskId: string, field?: string) => {
    if (!field) return;
    try {
      const key = `${taskId}_${field}`;
      const value = editingValues.value[key];

      const error = validateTaskField(field, value);
      if (error) {
        message.error(`Validation error: ${error}`);
        return;
      }

      const updates = prepareUpdates(field, value);
      await tasksStore.updateTask(taskId, updates);

      delete editingValues.value[key];
      tasksStore.stopEditing(taskId, field);

      message.success(`Field ${field} updated successfully`);
    } catch (error) {
      console.error('Error saving task:', error);
      message.error('Failed to save task. Please try again.');
    }
  };

  const prepareUpdates = (field: string, value: any) => {
    const updates: any = {};

    switch (field) {
      case 'developer':
        updates.developer = Array.isArray(value) ? value.join(', ') : value;
        break;
      case 'date':
        updates.date = value ? dayjs(value).toISOString() : null;
        break;
      case 'title':
        updates.title = value.trim();
        break;
      case 'estimatedSp':
      case 'actualSp':
        updates[field] = Number(value) || 0;
        break;
      default:
        updates[field] = value;
    }

    return updates;
  };

  const cancelEditing = (taskId: string, field?: string) => {
    if (field) {
      tasksStore.stopEditing(taskId, field);
      const key = `${taskId}_${field}`;
      delete editingValues.value[key];
    } else {
      tasksStore.stopEditing();
      Object.keys(editingValues.value).forEach((key) => {
        if (key.startsWith(`${taskId}_`)) {
          delete editingValues.value[key];
        }
      });
    }
  };

  return {
    editingValues,
    startEditing,
    saveTask,
    cancelEditing,
  };
};