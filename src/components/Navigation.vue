<template>
  <nav class="flex gap-12 items-center border-b border-slate-600 relative">
    <div
      v-for="item in navigationItems"
      :key="item.value"
      @click="handleViewChange(item.value)"
      :class="{
        'opacity-100': activeView === item.value,
        'opacity-60': activeView !== item.value,
      }"
      class="relative py-4 cursor-pointer"
    >
      <div class="flex gap-3 items-center">
        <component v-if="item.icon" :is="item.icon" :size="20" class="mb-2" />
        <h1>{{ item.label }}</h1>
      </div>
      <div
        v-if="activeView === item.value"
        class="absolute -bottom-0.5 left-0 right-0 h-0.5 w-30 bg-blue-500"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { HomeFilled } from "@ant-design/icons-vue";

import type { NavigationItemType, ViewType } from "@/types/components";

defineProps<{
  activeView: ViewType;
}>();

const emit = defineEmits<{
  "view-change": [view: ViewType];
}>();

const navigationItems = computed<NavigationItemType[]>(() => [
  {
    value: "main-table",
    label: "Main Table",
    icon: HomeFilled,
  },
  {
    value: "kanban",
    label: "Kanban",
    icon: null,
  },
]);

const handleViewChange = (view: ViewType) => {
  emit("view-change", view);
};
</script>

<style scoped></style>
