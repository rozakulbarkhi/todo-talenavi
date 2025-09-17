<template>
  <div 
    class="flex flex-col items-center justify-center p-8"
    :class="{ 'fixed inset-0 bg-white bg-opacity-90 z-50': fullScreen }"
  >
    <div class="relative">
      <div 
        class="border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin"
        :class="spinnerSizeClass"
      ></div>
    </div>
    <p v-if="message" class="mt-4 text-gray-500 text-sm">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  fullScreen: false
});

const spinnerSizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'w-5 h-5';
    case 'large':
      return 'w-15 h-15';
    default:
      return 'w-10 h-10';
  }
});
</script>