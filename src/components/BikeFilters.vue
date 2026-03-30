<script lang="ts" setup>
import { useMap } from '@/stores/map'
import { storeToRefs } from 'pinia'
import Checkbox from './forms/Checkbox.vue'
import ParkingSpaceRange from './filters/ParkingSpaceRange.vue';

const { filterCovered, filterUncovered, filterKorrigo } = storeToRefs(useMap())

defineProps<{
  nbUncovered?: number
  nbCovered?: number
  nbKorrigo?: number
}>()
</script>

<template>
  <aside class="max-w-xs absolute top-5 left-5 z-10 p-2 bg-slate-50 text-slate-950 text-xs rounded-xs">
    <form>
      <div class="grid grid-cols-2 gap-1.5">
        <div class="col-span-2">
          <Checkbox v-model="filterUncovered" :count="nbUncovered">Non-abrités</Checkbox>
        </div>
        <div class="col-span-2">
          <Checkbox v-model="filterCovered" :count="nbCovered">Abrités</Checkbox>
        </div>
        <div class="col-span-2">
          <Checkbox v-model="filterKorrigo" :count="nbKorrigo">Abonnement Korrigo</Checkbox>
        </div>

        <ParkingSpaceRange />
      </div>
    </form>
  </aside>
</template>
