<template>
  <Modal
    :open="visible"
    title="Create New Task"
    @update:open="$emit('update:visible', $event)"
    :footer="null"
    width="600px"
  >
    <div class="py-4">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Task Title *
          </label>
          <Input
            v-model:value="formData.title"
            placeholder="Enter task title"
            :status="errors.title ? 'error' : ''"
          />
          <div v-if="errors.title" class="text-red-500 text-xs mt-1">
            {{ errors.title }}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Developer *
            </label>
            <Select
              v-model:value="formData.developer"
              placeholder="Select developer"
              :options="developerOptions"
              class="w-full"
              :status="errors.developer ? 'error' : ''"
            />
            <div v-if="errors.developer" class="text-red-500 text-xs mt-1">
              {{ errors.developer }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <Select
              v-model:value="formData.status"
              placeholder="Select status"
              :options="statusOptions"
              class="w-full"
              :status="errors.status ? 'error' : ''"
            />
            <div v-if="errors.status" class="text-red-500 text-xs mt-1">
              {{ errors.status }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Priority *
            </label>
            <Select
              v-model:value="formData.priority"
              placeholder="Select priority"
              :options="priorityOptions"
              class="w-full"
              :status="errors.priority ? 'error' : ''"
            />
            <div v-if="errors.priority" class="text-red-500 text-xs mt-1">
              {{ errors.priority }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <Select
              v-model:value="formData.type"
              placeholder="Select type"
              :options="typeOptions"
              class="w-full"
              :status="errors.type ? 'error' : ''"
            />
            <div v-if="errors.type" class="text-red-500 text-xs mt-1">
              {{ errors.type }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Estimated SP
            </label>
            <InputNumber
              v-model:value="formData.estimatedSp"
              placeholder="0"
              :min="0"
              :max="100"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <DatePicker
              v-model:value="formData.date"
              placeholder="Select date"
              class="w-full"
              format="YYYY-MM-DD"
            />
          </div>
        </div>
      </form>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <Button @click="handleCancel" :disabled="loading"> Cancel </Button>
      <Button type="primary" @click="handleSubmit" :loading="loading">
        Create Task
      </Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import {
  Modal,
  Input,
  Select,
  Button,
  InputNumber,
  DatePicker,
  message,
} from "ant-design-vue";
import { type Dayjs } from "dayjs";

import { useTasksStore } from "@/stores/tasks";
import type {
  TaskRequest,
  Priority,
  Status,
  TaskType,
} from "@/types/api/tasks";
import {
  developerOptions,
  priorityOptions,
  statusOptions,
  typeOptions,
} from "@/data/options";

interface Props {
  visible: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
});

const emit = defineEmits<{
  (e: "update:visible", visible: boolean): void;
  (e: "created", task: any): void;
}>();

const tasksStore = useTasksStore();
const loading = ref(false);

const formData = reactive({
  title: "",
  developer: "Alice",
  status: "Ready to start" as Status,
  priority: "Medium" as Priority,
  type: "Feature Enhancements" as TaskType,
  estimatedSp: 0,
  date: undefined as Dayjs | undefined,
});

const errors = reactive({
  title: "",
  developer: "",
  status: "",
  priority: "",
  type: "",
});

const resetForm = () => {
  formData.title = "";
  formData.developer = "";
  formData.status = "Ready to start";
  formData.priority = "Medium";
  formData.type = "Feature Enhancements";
  formData.estimatedSp = 0;
  formData.date = undefined;

  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });
};

const validateForm = (): boolean => {
  let isValid = true;

  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  if (!formData.title.trim()) {
    errors.title = "Task title is required";
    isValid = false;
  }

  if (!formData.developer) {
    errors.developer = "Developer is required";
    isValid = false;
  }

  if (!formData.status) {
    errors.status = "Status is required";
    isValid = false;
  }

  if (!formData.priority) {
    errors.priority = "Priority is required";
    isValid = false;
  }

  if (!formData.type) {
    errors.type = "Type is required";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    const newTask: TaskRequest = {
      title: formData.title.trim(),
      developer: formData.developer,
      status: formData.status,
      priority: formData.priority,
      type: formData.type,
      date: formData.date
        ? formData.date.toISOString()
        : new Date().toISOString(),
      estimatedSp: formData.estimatedSp || 0,
      actualSp: 0,
    };

    await tasksStore.addTask(newTask);

    message.success("Task created successfully!");
    emit("created", newTask);
    emit("update:visible", false);
    resetForm();
  } catch (error) {
    console.error("Error creating task:", error);
    message.error("Failed to create task. Please try again.");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  emit("update:visible", false);
  resetForm();
};

watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible) {
      resetForm();
    }
  }
);
</script>

<style scoped></style>
