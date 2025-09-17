<template>
  <template v-if="isEditing">
    <InputNumber
      v-if="type === 'number'"
      v-model:value="localValue"
      :min="min"
      :max="max"
      style="width: 100%"
      @pressEnter="handleSave"
      @blur="handleSave"
      @keyup.esc="handleCancel"
    />
    <Input
      v-else
      v-model:value="localValue"
      @pressEnter="handleSave"
      @blur="handleSave"
      @keyup.esc="handleCancel"
    />
  </template>
  <template v-else>
    <div
      @dblclick="handleEdit"
      class="cursor-pointer hover:bg-gray-50 p-1 rounded"
    >
      <slot :value="displayValue">
        {{ displayValue }}
      </slot>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Input, InputNumber } from "ant-design-vue";

interface Props {
  modelValue: any;
  isEditing: boolean;
  type?: "text" | "number";
  min?: number;
  max?: number;
  displayValue?: string;
}

interface Emits {
  (e: "update:modelValue", value: any): void;
  (e: "save"): void;
  (e: "cancel"): void;
  (e: "edit"): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
});

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
