<template>
  <div class="p-12">
    <ErrorBoundary @error="handleGlobalError">
      <Navigation @view-change="handleViewChange" :active-view="activeView" />

      <div class="mt-8">
        <MainTable v-if="activeView === 'main-table'" />
        <Kanban v-else-if="activeView === 'kanban'" />
      </div>

      <Footer />
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import Navigation from "./components/ui/Navigation.vue";
import MainTable from "./components/views/MainTable.vue";
import Kanban from "./components/views/Kanban.vue";
import Footer from "./components/ui/Footer.vue";
import ErrorBoundary from "./components/ui/ErrorBoundary.vue";

const activeView = ref<"main-table" | "kanban">("main-table");

const handleViewChange = (view: "main-table" | "kanban") => {
  activeView.value = view;
};

const handleGlobalError = (error: Error) => {
  console.error("Global error caught:", error);
};
</script>
