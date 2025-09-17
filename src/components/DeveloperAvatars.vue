<template>
  <div class="flex items-center">
    <div v-if="developerList.length === 1">
      <Tooltip :title="developerList[0]" placement="top">
        <Avatar
          :style="{ backgroundColor: getAvatarColor(developerList[0]) }"
          size="small"
          class="border-2 border-white cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg"
        >
          {{ getInitialDevName(developerList[0]) }}
        </Avatar>
      </Tooltip>
    </div>

    <div v-else-if="developerList.length > 1" class="flex items-center">
      <Tooltip :title="developerList.join(', ')" placement="top">
        <div class="flex items-center">
          <Avatar
            v-for="(dev, index) in developerList.slice(0, 3)"
            :key="dev"
            :style="{
              backgroundColor: getAvatarColor(dev),
              zIndex: developerList.length - index,
              marginLeft: index > 0 ? '-8px' : '0',
            }"
            size="small"
            class="border-2 border-white cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg relative"
          >
            {{ getInitialDevName(dev) }}
          </Avatar>
          <Avatar
            v-if="developerList.length > 3"
            size="small"
            class="border-2 border-white bg-gray-100 text-gray-600"
            :style="{ marginLeft: '-8px' }"
          >
            +{{ developerList.length - 3 }}
          </Avatar>
        </div>
      </Tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Avatar, Tooltip } from "ant-design-vue";

import { getAvatarColor } from "@/utils/avatar-color";
import { getInitialDevName } from "@/utils/initial-dev-name";

import type { DeveloperType } from "@/types/components";

const props = defineProps<DeveloperType>();

const developerList = computed(() => {
  if (!props.developers || !Array.isArray(props.developers)) return [];
  return props.developers.filter(Boolean);
});
</script>
