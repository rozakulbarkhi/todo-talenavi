<template>
  <div>
    <Toolbar
      :selected-task-ids="tasksStore.selectedTaskIds"
      @new-task="handleNewTask"
      @search="handleSearch"
      @openPersonFilter="showPersonFilterModal"
      @openSortModal="showSortModal"
      @delete="handleDelete"
    />

    <div class="rounded-lg overflow-hidden py-6">
      <Table
        :columns="columns"
        :dataSource="filteredTasks"
        :rowSelection="rowSelection"
        :loading="tasksStore.isLoading"
        :rowKey="(record) => record.id"
        size="middle"
        bordered
      >
        <template #bodyCell="{ column, value, record }">
          <template v-if="column.key === 'developers'">
            <EditableSelectCell
              v-model="editingValues[record.id + '_developer']"
              :is-editing="tasksStore.isCellEditing(record.id, 'developer')"
              :options="developerOptions"
              mode="multiple"
              placeholder="Select developers"
              :auto-save="false"
              @save="saveTask(record.id, 'developer')"
              @cancel="cancelEditing(record.id, 'developer')"
              @edit="startEditing(record as Task, 'developer')"
            >
              <template #default="{ value: displayValue }">
                <DeveloperAvatars :developers="value" />
              </template>
            </EditableSelectCell>
          </template>
          <template v-else-if="column.key === 'status'">
            <EditableSelectCell
              v-model="editingValues[record.id + '_status']"
              :is-editing="tasksStore.isCellEditing(record.id, 'status')"
              :options="statusOptions"
              :cell-class="getStatusColor(value)"
              :display-value="value"
              @save="saveTask(record.id, 'status')"
              @cancel="cancelEditing(record.id, 'status')"
              @edit="startEditing(record as Task, 'status')"
            />
          </template>
          <template v-else-if="column.key === 'priority'">
            <EditableSelectCell
              v-model="editingValues[record.id + '_priority']"
              :is-editing="tasksStore.isCellEditing(record.id, 'priority')"
              :options="priorityOptions"
              :cell-class="getPriorityColor(value)"
              :display-value="value"
              @save="saveTask(record.id, 'priority')"
              @cancel="cancelEditing(record.id, 'priority')"
              @edit="startEditing(record as Task, 'priority')"
            />
          </template>
          <template v-else-if="column.key === 'type'">
            <EditableSelectCell
              v-model="editingValues[record.id + '_type']"
              :is-editing="tasksStore.isCellEditing(record.id, 'type')"
              :options="typeOptions"
              :cell-class="getTypeColor(value)"
              :display-value="value"
              @save="saveTask(record.id, 'type')"
              @cancel="cancelEditing(record.id, 'type')"
              @edit="startEditing(record as Task, 'type')"
            />
          </template>
          <template v-else-if="column.key === 'title'">
            <EditableInputCell
              v-model="editingValues[record.id + '_title']"
              :is-editing="tasksStore.isCellEditing(record.id, 'title')"
              :display-value="value"
              @save="saveTask(record.id, 'title')"
              @cancel="cancelEditing(record.id, 'title')"
              @edit="startEditing(record as Task, 'title')"
            />
          </template>
          <template v-else-if="column.key === 'date'">
            <EditableDateCell
              v-model="editingValues[record.id + '_date']"
              :is-editing="tasksStore.isCellEditing(record.id, 'date')"
              :display-value="value ? dayjs(value).format('YYYY-MM-DD') : '-'"
              @save="saveTask(record.id, 'date')"
              @cancel="cancelEditing(record.id, 'date')"
              @edit="startEditing(record as Task, 'date')"
            />
          </template>
          <template
            v-else-if="
              column.key === 'estimatedSp' || column.key === 'actualSp'
            "
          >
            <EditableInputCell
              v-model="editingValues[record.id + '_' + column.key]"
              :is-editing="tasksStore.isCellEditing(record.id, column.key as string)"
              type="number"
              :min="0"
              :max="100"
              :display-value="formatCellValue(value, String(column.key || ''))"
              @save="saveTask(record.id, column.key as string)"
              @cancel="cancelEditing(record.id, column.key as string)"
              @edit="startEditing(record as Task, column.key as string)"
            />
          </template>
          <template v-else>
            <EditableInputCell
              v-model="editingValues[record.id + '_' + column.key]"
              :is-editing="tasksStore.isCellEditing(record.id, column.key as string)"
              :display-value="formatCellValue(value, String(column.key || ''))"
              @save="saveTask(record.id, column.key as string)"
              @cancel="cancelEditing(record.id, column.key as string)"
              @edit="startEditing(record as Task, column.key as string)"
            />
          </template>
        </template>

        <template #summary>
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell :index="0" />
              <Table.Summary.Cell :index="1" />
              <Table.Summary.Cell :index="2" />
              <Table.Summary.Cell :index="3">
                <div :style="segmentBarStyles">
                  <template
                    v-for="(segment, index) in statusSegments"
                    :key="index"
                  >
                    <div
                      :style="
                        getSegmentStyles(segment, index, statusSegments.length)
                      "
                    />
                  </template>
                </div>
              </Table.Summary.Cell>

              <Table.Summary.Cell :index="4">
                <div :style="segmentBarStyles">
                  <template
                    v-for="(segment, index) in prioritySegments"
                    :key="index"
                  >
                    <div
                      :style="
                        getSegmentStyles(
                          segment,
                          index,
                          prioritySegments.length
                        )
                      "
                    />
                  </template>
                </div>
              </Table.Summary.Cell>

              <Table.Summary.Cell :index="5">
                <div :style="segmentBarStyles">
                  <template
                    v-for="(segment, index) in typeSegments"
                    :key="index"
                  >
                    <div
                      :style="
                        getSegmentStyles(segment, index, typeSegments.length)
                      "
                    />
                  </template>
                </div>
              </Table.Summary.Cell>

              <Table.Summary.Cell :index="6" />
              <Table.Summary.Cell :index="7">
                <div class="text-secondary">{{ totalEstimatedSp }} SP</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell :index="8">
                <div class="text-secondary">{{ totalActualSp }} SP</div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        </template>
      </Table>

      <div
        v-if="filteredTasks.length === 0 && !tasksStore.isLoading"
        class="text-center py-12"
      >
        <p class="text-gray-400">No tasks found</p>
      </div>

      <div v-if="tasksStore.error" class="text-center py-4">
        <p class="text-red-500">{{ tasksStore.error }}</p>
        <button
          @click="tasksStore.fetchTasks()"
          class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    </div>

    <DeleteTaskModal
      v-model:visible="showDeleteModal"
      :title="deleteModalTitle"
      :content="deleteModalContent"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <PersonFilterModal
      :visible="personFilterVisible"
      :initial-developers="tasksStore.selectedDevelopers"
      @update:visible="personFilterVisible = $event"
      @apply="handlePersonFilterApply"
    />

    <SortModal
      :visible="sortModalVisible"
      :initial-sort="tasksStore.appliedSortColumns"
      @update:visible="sortModalVisible = $event"
      @apply="handleSortApply"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Table, message } from "ant-design-vue";
import type { TableRowSelection } from "ant-design-vue/es/table/interface";
import dayjs from "dayjs";

import Toolbar from "./Toolbar.vue";
import DeveloperAvatars from "./DeveloperAvatars.vue";
import EditableSelectCell from "./EditableSelectCell.vue";
import EditableInputCell from "./EditableInputCell.vue";
import EditableDateCell from "./EditableDateCell.vue";
import DeleteTaskModal from "./DeleteTaskModal.vue";
import PersonFilterModal from "./PersonFilterModal.vue";
import SortModal from "./SortModal.vue";

import { useTasksStore } from "@/stores/tasks";

import { useTaskEditing } from "@/composables/use-task-editing";
import { useTableSummary } from "@/composables/use-table-summary";

import type {
  Task,
  TaskRequest,
  Priority,
  Status,
  TaskType,
} from "@/types/api/tasks";
import { columns } from "@/data/columns";

import { formatCellValue } from "@/utils/format-cell-value";
import {
  getPriorityColor,
  getStatusColor,
  getTypeColor,
} from "@/utils/cell-color";
import { getSegmentBarStyles, getSegmentStyles } from "@/utils/segment-bars";
import {
  developerOptions,
  priorityOptions,
  statusOptions,
  typeOptions,
} from "@/data/options";

const tasksStore = useTasksStore();
const { editingValues, startEditing, saveTask, cancelEditing } =
  useTaskEditing();

const showDeleteModal = ref(false);
const deleteModalTitle = ref("");
const deleteModalContent = ref("");
const selectedIdsToDelete = ref<string[]>([]);
const personFilterVisible = ref(false);
const sortModalVisible = ref(false);

const filteredTasks = computed<Task[]>(() => {
  return tasksStore.filteredTasks;
});

const {
  statusSegments,
  prioritySegments,
  typeSegments,
  totalEstimatedSp,
  totalActualSp,
} = useTableSummary(filteredTasks);

onMounted(() => {
  tasksStore.fetchTasks();
});

const handleNewTask = async (): Promise<void> => {
  try {
    const newTask: TaskRequest = {
      title: "New Task",
      developer: "Alice",
      status: "Ready to start" as Status,
      priority: "Medium" as Priority,
      type: "Feature Enhancements" as TaskType,
      date: new Date().toISOString(),
      estimatedSp: 0,
      actualSp: 0,
    };

    await tasksStore.addTask(newTask);

    const tasks = tasksStore.tasks;
    const createdTask = tasks[0];

    if (createdTask) {
      startEditing(createdTask, "title");
      message.success("New task created successfully!");
    }
  } catch (error) {
    console.error("Error creating new task:", error);
    message.error("Failed to create new task. Please try again.");
  }
};

const handleSearch = (query: string): void => {
  tasksStore.setSearchQuery(query);
};

const showPersonFilterModal = (): void => {
  personFilterVisible.value = true;
};

const showSortModal = (): void => {
  sortModalVisible.value = true;
};

const handlePersonFilterApply = (selectedDevelopers: string[]): void => {
  tasksStore.setDeveloperFilter(selectedDevelopers);
  personFilterVisible.value = false;
};

const handleSortApply = (
  sortColumns: Array<{ column: string; order: "asc" | "desc" }>
): void => {
  tasksStore.setSortColumns(sortColumns);
  sortModalVisible.value = false;
};

const handleDelete = (): void => {
  const selectedCount = tasksStore.selectedTaskIds.length;
  const taskText = selectedCount === 1 ? "task" : "tasks";

  selectedIdsToDelete.value = [...tasksStore.selectedTaskIds];
  deleteModalTitle.value = `Delete ${selectedCount} ${taskText}?`;
  deleteModalContent.value = `Are you sure you want to delete the selected ${taskText}?`;
  showDeleteModal.value = true;
};

const confirmDelete = async (): Promise<void> => {
  try {
    const selectedIds = selectedIdsToDelete.value;
    const selectedCount = selectedIds.length;

    if (selectedCount === 1) {
      await tasksStore.deleteTask(selectedIds[0]);
      message.success("Task deleted successfully!");
    } else {
      await tasksStore.deleteTasks(selectedIds);
      message.success(`${selectedCount} tasks deleted successfully!`);
    }

    tasksStore.selectAllTasks(false);
  } catch (error) {
    console.error("Error deleting tasks:", error);
    message.error("Failed to delete tasks. Please try again.");
  }
};

const cancelDelete = (): void => {
  selectedIdsToDelete.value = [];
};

const rowSelection = computed(
  (): TableRowSelection => ({
    selectedRowKeys: tasksStore.selectedTaskIds,
    onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
      tasksStore.selectedTaskIds.length = 0;
      tasksStore.selectedTaskIds.push(...selectedRowKeys.map(String));
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows:",
        selectedRows
      );
    },
    onSelectAll: (
      selected: boolean,
      selectedRows: any[],
      changeRows: any[]
    ) => {
      tasksStore.selectAllTasks(selected);
      console.log(selected, selectedRows, changeRows);
    },
    type: "checkbox" as const,
  })
);

const segmentBarStyles = getSegmentBarStyles();
</script>

<style scoped>
:deep(.ant-table-tbody > tr > td:has(.colored-cell)) {
  padding: 0 !important;
}

.colored-cell {
  width: 100%;
  height: 100%;
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 16px;
  color: white;
  font-weight: 500;
  font-size: 14px;
}
</style>
