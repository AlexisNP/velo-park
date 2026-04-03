<script lang="ts" setup>
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { storeToRefs } from 'pinia'
import { useMap, SPOTS_MIN, SPOTS_MAX } from '@/stores/map'
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const { spotsRange } = storeToRefs(useMap())

const MIN = SPOTS_MIN
const MAX = SPOTS_MAX

const localRange = ref<[number, number]>([...spotsRange.value] as [number, number])

const commitToStore = useDebounceFn((val: [number, number]) => {
  spotsRange.value = val
}, 500)

function onRangeUpdate(val: number[] | undefined) {
  if (!val) return

  localRange.value = val as [number, number]
  commitToStore(val as [number, number])
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <span
        class="text-sm font-medium relative isolate before:contents-[''] before:block before:w-full before:bg-amber-500/15 before:h-2 before:absolute before:bottom-0.5 before:-z-10">Places
        totales</span>
      <span class="text-xs text-muted-foreground">
        {{ localRange[0] }} – {{ localRange[1] }}<template v-if="localRange[1] === MAX">+</template>
      </span>
    </div>

    <div class="mt-1">
      <SliderRoot :model-value="localRange" @update:model-value="onRangeUpdate"
        class="relative flex items-center select-none touch-none w-full pt-2 pb-1" :min="MIN" :max="MAX" :step="5">
        <SliderTrack class="bg-muted/10 relative grow rounded-full h-1.5">
          <SliderRange class="absolute bg-primary rounded-full h-full" />
        </SliderTrack>
        <SliderThumb
          class="cursor-pointer size-4 bg-white rounded-full hover:bg-primary shadow-sm focus:outline-none focus:ring-2" />
        <SliderThumb
          class="cursor-pointer size-4 bg-white rounded-full hover:bg-primary shadow-sm focus:outline-none focus:ring-2" />
      </SliderRoot>
    </div>
  </div>
</template>
