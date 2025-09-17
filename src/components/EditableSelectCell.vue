<template>
  <template v-if="isEditing">
    <Select
      v-model:value="localValue"
      :options="options"
      :mode="mode"
      :placeholder="placeholder"
      style="width: 100%"
      @pressEnter="handleSave"
      @blur="handleSave"
      @keyup.esc="handleCancel"
      @change="autoSave ? handleSave() : undefined"
    />
  </template>
  <template v-else>
    <div
      :class="['colored-cell', cellClass]"
      @dblclick="handleEdit"
    >
      <slot :value="displayValue">
        {{ displayValue }}
      </slot>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Select } from 'ant-design-vue';

interface Props {
  modelValue: any;
  isEditing: boolean;
  options: Array<{ label: string; value: any }>;
  cellClass?: string;
  mode?: 'multiple' | undefined;
  placeholder?: string;
  autoSave?: boolean;
  displayValue?: string;
}

interface Emits {
  (e: 'update:modelValue', value: any): void;
  (e: 'save'): void;
  (e: 'cancel'): void;
  (e: 'edit'): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select option',
  autoSave: true,
});

const emit = defineEmits<Emits>();

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const handleSave = () => {
  emit('save');
};

const handleCancel = () => {
  emit('cancel');
};

const handleEdit = () => {
  emit('edit');
};
</script>