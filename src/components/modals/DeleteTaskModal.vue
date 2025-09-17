<template>
  <Modal
    v-model:open="open"
    :title="title"
    :width="400"
    :centered="true"
    :footer="null"
  >
    <div class="py-4">
      <div>
        <p class="text-gray-800 font-medium">{{ content }}</p>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <Button @click="handleCancel"> Cancel </Button>
      <Button type="text" danger @click="handleConfirm"> Delete </Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Modal, Button } from "ant-design-vue";

interface Props {
  visible?: boolean;
  title?: string;
  content?: string;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: "Confirm Delete",
  content: "Are you sure you want to delete this item?",
});

const emit = defineEmits<{
  "update:visible": [value: boolean];
  confirm: [];
  cancel: [];
}>();

const open = ref(props.visible);

watch(
  () => props.visible,
  (newValue) => {
    open.value = newValue;
  }
);

watch(open, (newValue) => {
  emit("update:visible", newValue);
});

const handleConfirm = () => {
  emit("confirm");
  open.value = false;
};

const handleCancel = () => {
  emit("cancel");
  open.value = false;
};
</script>

<style scoped>
:deep(.ant-modal-header) {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 24px;
}

:deep(.ant-modal-body) {
  padding: 0 24px 24px 24px;
}
</style>
