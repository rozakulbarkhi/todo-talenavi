<template>
  <Modal
    :open="visible"
    title="Sort Tasks"
    @update:open="$emit('update:visible', $event)"
    :footer="null"
    width="600px"
  >
    <div class="py-4">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Select Columns to Sort By
        </label>
        <div class="space-y-3">
          <div
            v-for="(sortItem, index) in sortColumns"
            :key="index"
            class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
          >
            <div class="flex-1">
              <Select
                v-model:value="sortItem.column"
                placeholder="Select column"
                :options="availableColumnOptions"
                class="w-full"
              />
            </div>
            <div class="w-24">
              <Select
                v-model:value="sortItem.order"
                :options="sortOrderOptions"
                class="w-full"
              />
            </div>
            <Button
              type="text"
              danger
              @click="removeSortColumn(index)"
              :disabled="sortColumns.length === 1"
            >
              <DeleteOutlined />
            </Button>
          </div>
        </div>

        <Button
          type="dashed"
          @click="addSortColumn"
          class="w-full mt-3"
          :disabled="sortColumns.length >= availableColumnOptions.length"
        >
          <PlusOutlined />
          Add Sort Column
        </Button>
      </div>

      <div class="text-sm text-gray-500">
        <p>
          Select one or more columns to sort by. The first column has the
          highest priority.
        </p>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <Button @click="handleCancel">Cancel</Button>
      <Button type="primary" @click="handleOk">Apply Sort</Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Modal, Select, Button } from "ant-design-vue";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons-vue";

interface SortColumn {
  column: string;
  order: "asc" | "desc";
}

interface Props {
  visible: boolean;
  initialSort?: SortColumn[];
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  initialSort: () => [{ column: "title", order: "asc" }],
});

const emit = defineEmits<{
  (e: "update:visible", visible: boolean): void;
  (e: "apply", sortColumns: SortColumn[]): void;
}>();

const sortColumns = ref<SortColumn[]>([]);

const availableColumnOptions = [
  { value: "title", label: "Task" },
  { value: "developers", label: "Developer" },
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
  { value: "type", label: "Type" },
  { value: "date", label: "Date" },
  { value: "estimatedSp", label: "Estimated SP" },
  { value: "actualSp", label: "Actual SP" },
];

const sortOrderOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible) {
      sortColumns.value =
        props.initialSort.length > 0
          ? [...props.initialSort]
          : [{ column: "title", order: "asc" }];
    }
  }
);

watch(
  () => props.initialSort,
  (newSort) => {
    sortColumns.value =
      newSort.length > 0 ? [...newSort] : [{ column: "title", order: "asc" }];
  },
  { immediate: true }
);

const addSortColumn = () => {
  const usedColumns = sortColumns.value.map((item) => item.column);
  const availableColumn = availableColumnOptions.find(
    (option) => !usedColumns.includes(option.value)
  );

  if (availableColumn) {
    sortColumns.value.push({
      column: availableColumn.value,
      order: "asc",
    });
  }
};

const removeSortColumn = (index: number) => {
  if (sortColumns.value.length > 1) {
    sortColumns.value.splice(index, 1);
  }
};

const handleOk = () => {
  const validSortColumns = sortColumns.value.filter(
    (item) => item.column && item.order
  );

  emit("apply", validSortColumns);
  emit("update:visible", false);
};

const handleCancel = () => {
  sortColumns.value =
    props.initialSort.length > 0
      ? [...props.initialSort]
      : [{ column: "title", order: "asc" }];
  emit("update:visible", false);
};
</script>

<style scoped></style>
