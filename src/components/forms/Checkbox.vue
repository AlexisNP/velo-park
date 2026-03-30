<script lang="ts" setup>
import { PhCheck } from '@phosphor-icons/vue'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

defineProps<{
  count?: number
}>()

const checked = defineModel<boolean>()
</script>

<template>
  <label class="flex flex-row gap-1.5 items-center text-sm cursor-pointer group">
    <CheckboxRoot v-model="checked"
      class="hover:bg-stone-100 flex size-4 appearance-none items-center justify-center rounded-xs bg-foreground shadow-sm border focus-within:ring-1 cursor-pointer">
      <CheckboxIndicator class="size-full flex items-center justify-center bg-primary text-primary-foreground">
        <PhCheck :size="10" weight="bold" />
      </CheckboxIndicator>
    </CheckboxRoot>

    <span class="select-none">
      <span class="group-hover:underline underline-offset-2">
        <slot />
      </span>

      <small v-if="count" class="ml-1 opacity-50">({{ count }})</small>
    </span>
  </label>
</template>
