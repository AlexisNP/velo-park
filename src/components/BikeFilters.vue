<script lang="ts" setup>
import { useMap } from '@/stores/map';
import { storeToRefs } from 'pinia';
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { ref, watch } from 'vue';
import Checkbox from './forms/Checkbox.vue';

const { filterCovered, filterUncovered, filterKorrigo } = storeToRefs(useMap())

defineProps<{
  nbUncovered?: number
  nbCovered?: number
  nbKorrigo?: number
}>()

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
  <aside class="max-w-xs absolute top-5 left-5 z-10 p-2 bg-slate-50 text-slate-950 text-xs rounded-xs">
    <form>
      <div class="grid grid-cols-2 gap-1.5">
        <div class="col-span-2">
          <Checkbox v-model="filterUncovered" :count="nbUncovered">
            Non-abrités
          </Checkbox>
        </div>

        <div class="col-span-2">
          <Checkbox v-model="filterCovered" :count="nbCovered">
            Abrités
          </Checkbox>
        </div>

        <div class="col-span-2">
          <Checkbox v-model="filterKorrigo" :count="nbKorrigo">
            Abonnement Korrigo
          </Checkbox>
        </div>

        <div class="mt-1 col-span-2">
          <label class="flex justify-between">
            <span>Nombre de places</span>

            <span class="text-muted-foreground">
              {{ spotsRange[0] }}
              –
              {{ spotsRange[1] }}<template v-if="spotsRange[1] === 100">+</template>
            </span>
          </label>

          <div class="mt-1">
            <SliderRoot v-model="spotsRange" class="relative flex items-center select-none touch-none w-full py-2"
              :min="MIN" :max="MAX" :step="5">
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

        <!-- <div>
          <NumberFieldRoot :min="MIN" :max="maxSpots" :step="5" v-model="minSpots" class="max-w-full">
            <label>Min.</label>
            <div
              class="mt-1 flex items-center justify-center overflow-hidden border bg-white hover:bg-stone-50 rounded-lg shadow-sm h-8 focus-within:ring-2">
              <NumberFieldDecrement class="p-2 pr-1 disabled:opacity-20 shrink-0">
                <PhMinus :size="10" />
              </NumberFieldDecrement>
              <NumberFieldInput class="w-0 min-w-0 flex-1 bg-transparent text-center focus:outline-0 p-1" />
              <NumberFieldIncrement class="p-2 pl-1 disabled:opacity-20 shrink-0">
                <PhPlus :size="10" />
              </NumberFieldIncrement>
            </div>
          </NumberFieldRoot>
        </div>

        <div>
          <NumberFieldRoot :min="minSpots" :max="MAX" :step="5" v-model="maxSpots" class="max-w-full">
            <label>Max.</label>
            <div
              class="mt-1 flex items-center justify-center overflow-hidden border bg-white hover:bg-stone-50 rounded-lg shadow-sm h-8 focus-within:ring-2">
              <NumberFieldDecrement class="p-2 pr-1 disabled:opacity-20 shrink-0">
                <PhMinus :size="10" />
              </NumberFieldDecrement>
              <NumberFieldInput class="w-0 min-w-0 flex-1 bg-transparent text-center focus:outline-0 p-1" />
              <NumberFieldIncrement class="p-2 pl-1 disabled:opacity-20 shrink-0">
                <PhPlus :size="10" />
              </NumberFieldIncrement>
            </div>
          </NumberFieldRoot>
        </div> -->
      </div>
    </form>
  </aside>
</template>
