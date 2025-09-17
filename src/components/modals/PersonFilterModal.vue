<template>
  <Modal
    :open="visible"
    title="Filter by Person"
    @update:open="$emit('update:visible', $event)"
    :footer="null"
  >
    <div class="py-4">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Select Developers
        </label>
        <Select
          v-model:value="selectedDevelopers"
          mode="multiple"
          placeholder="Select developers to filter by"
          :options="developerOptions"
          class="w-full"
          allowClear
        />
      </div>

      <div class="text-sm text-gray-500">
        <p>
          Select one or more developers to filter tasks. Leave empty to show all
          tasks.
        </p>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <Button @click="handleCancel">Cancel</Button>
      <Button type="primary" @click="handleOk">Apply Filter</Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Modal, Select, Button } from "ant-design-vue";
import { developerOptions } from "@/data/options";

interface Props {
  visible: boolean;
  initialDevelopers?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  initialDevelopers: () => [],
});

const emit = defineEmits<{
  (e: "update:visible", visible: boolean): void;
  (e: "apply", developers: string[]): void;
}>();

const selectedDevelopers = ref<string[]>([]);

watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible) {
      selectedDevelopers.value = [...props.initialDevelopers];
    }
  }
);

watch(
  () => props.initialDevelopers,
  (newDevelopers) => {
    selectedDevelopers.value = [...newDevelopers];
  },
  { immediate: true }
);

const handleOk = () => {
  emit("apply", selectedDevelopers.value);
  emit("update:visible", false);
};

const handleCancel = () => {
  selectedDevelopers.value = [...props.initialDevelopers];
  emit("update:visible", false);
};
</script>
