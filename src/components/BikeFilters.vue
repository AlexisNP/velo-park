<script lang="ts" setup>
import { useMap } from '@/stores/map'
import { storeToRefs } from 'pinia'
import Checkbox from './forms/Checkbox.vue'
import ParkingSpaceRange from './filters/ParkingSpaceRange.vue';

const { filterCovered, filterUncovered, filterKorrigo, filterCargoOnly, filterStdOnly } = storeToRefs(useMap())

defineProps<{
  nbUncovered?: number
  nbCovered?: number
  nbKorrigo?: number
}>()
</script>

<template>
  <aside class="max-w-xs absolute top-5 left-5 z-10 p-2 bg-slate-50 text-slate-950 rounded-xs">
    <form class="grid grid-cols-1 gap-3">
      <fieldset>
        <legend
          class="mb-1.5 text-sm font-medium relative isolate before:contents-[''] before:block before:w-full before:bg-amber-500/15 before:h-2 before:absolute before:bottom-0.5 before:-z-10">
          Types d'emplacements
        </legend>

        <div class="grid grid-cols-1 gap-1.5">
          <Checkbox v-model="filterUncovered" :count="nbUncovered">Non-abrités</Checkbox>
          <Checkbox v-model="filterCovered" :count="nbCovered">Abrités</Checkbox>
          <Checkbox v-model="filterKorrigo" :count="nbKorrigo">Abonnement Korrigo</Checkbox>
        </div>
      </fieldset>

      <ParkingSpaceRange />

      <fieldset>
        <legend
          class="mb-1.5 text-sm font-medium relative isolate before:contents-[''] before:block before:w-full before:bg-amber-500/15 before:h-2 before:absolute before:bottom-0.5 before:-z-10">
          Équipements
        </legend>

        <div class="grid grid-cols-1 gap-1.5">
          <Checkbox v-model="filterCargoOnly">Cargos</Checkbox>
          <Checkbox v-model="filterStdOnly">STD</Checkbox>
        </div>
      </fieldset>
    </form>
  </aside>
</template>
