<template>
  <div class="p-12">
    <Navigation @view-change="handleViewChange" :active-view="activeView" />

    <div class="mt-8">
      <MainTable v-if="activeView === 'main-table'" />
      <Kanban v-else-if="activeView === 'kanban'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import Navigation from "./components/Navigation.vue";
import MainTable from "./components/MainTable.vue";
import Kanban from "./components/Kanban.vue";

const activeView = ref<"main-table" | "kanban">("main-table");

const handleViewChange = (view: "main-table" | "kanban") => {
  activeView.value = view;
};
</script>

<style scoped></style>
