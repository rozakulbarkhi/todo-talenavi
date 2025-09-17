<template>
  <template v-if="isEditing">
    <DatePicker
      v-model:value="localValue"
      style="width: 100%"
      format="YYYY-MM-DD"
      @pressEnter="handleSave"
      @blur="handleSave"
      @keyup.esc="handleCancel"
    />
  </template>
  <template v-else>
    <div @dblclick="handleEdit">
      <slot :value="displayValue">
        {{ displayValue }}
      </slot>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { DatePicker } from "ant-design-vue";

interface Props {
  modelValue: any;
  isEditing: boolean;
  displayValue?: string;
}

interface Emits {
  (e: "update:modelValue", value: any): void;
  (e: "save"): void;
  (e: "cancel"): void;
  (e: "edit"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleSave = () => {
  emit("save");
};

const handleCancel = () => {
  emit("cancel");
};

const handleEdit = () => {
  emit("edit");
};
</script>
