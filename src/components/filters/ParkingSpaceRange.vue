<script lang="ts" setup>
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { ref, watch } from 'vue'

const MIN = 0
const MAX = 100

const minSpots = ref(MIN)
const maxSpots = ref(MAX)
const spotsRange = ref([minSpots.value, maxSpots.value])

watch(spotsRange, ([newMin, newMax]) => {
  if (newMin === undefined || newMax === undefined) return
  minSpots.value = newMin
  maxSpots.value = newMax
})

watch(minSpots, (val) => {
  if (val !== spotsRange.value[0])
    spotsRange.value = [Math.min(val, spotsRange.value[1]!), spotsRange.value[1]!]
})

watch(maxSpots, (val) => {
  if (val !== spotsRange.value[1])
    spotsRange.value = [spotsRange.value[0]!, Math.max(val, spotsRange.value[0]!)]
})
</script>

<template>
  <div class="mt-1 col-span-2">
    <label class="flex justify-between">
      <span>Nombre de places</span>
      <span class="text-muted-foreground">
        {{ spotsRange[0] }} – {{ spotsRange[1] }}<template v-if="spotsRange[1] === MAX">+</template>
      </span>
    </label>

    <div class="mt-1">
      <SliderRoot v-model="spotsRange" class="relative flex items-center select-none touch-none w-full py-2" :min="MIN"
        :max="MAX" :step="5">
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
