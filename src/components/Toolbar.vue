<template>
  <div class="flex items-center gap-4">
    <Button type="primary" @click="handleNewTask">
      New task
      <DownOutlined />
    </Button>

    <div class="w-1/4">
      <InputSearch
        placeholder="Search"
        v-model="searchQuery"
        @update:value="handleSearch"
      />
    </div>

    <Button @click="showPersonFilter">
      <FilterOutlined />
      Person
    </Button>

    <Button @click="showSortModal">
      <SortAscendingOutlined />
      Sort
    </Button>

    <Button
      type="text"
      danger
      v-if="selectedTaskIds.length > 0"
      @click="handleDelete"
    >
      <DeleteOutlined />
      Delete ({{ selectedTaskIds.length }})
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Button, InputSearch } from "ant-design-vue";
import {
  DownOutlined,
  SortAscendingOutlined,
  UserOutlined,
  DeleteOutlined,
  FilterOutlined,
} from "@ant-design/icons-vue";

interface Props {
  selectedTaskIds?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  selectedTaskIds: () => [],
});

const searchQuery = ref("");

const emit = defineEmits<{
  "new-task": [];
  search: [query: string];
  "person-filter": [];
  sort: [];
  delete: [];
  openPersonFilter: [];
  openSortModal: [];
}>();

const handleNewTask = () => {
  emit("new-task");
};

const handleSearch = (value?: string) => {
  const query = value !== undefined ? value : searchQuery.value;
  emit("search", query);
};

const handlePersonFilter = () => {
  emit("person-filter");
};

const handleSort = () => {
  emit("sort");
};

const showPersonFilter = () => {
  emit("openPersonFilter");
};

const showSortModal = () => {
  emit("openSortModal");
};

const handleDelete = () => {
  emit("delete");
};
</script>

<style scoped></style>
