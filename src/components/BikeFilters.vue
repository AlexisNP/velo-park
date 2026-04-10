<script lang="ts" setup>
import { useMap } from '@/stores/map'
import { PhMapPin, PhSpinner } from '@phosphor-icons/vue'
import { useGeolocation, usePermission } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import ParkingSpaceRange from './filters/ParkingSpaceRange.vue'
import Checkbox from './forms/Checkbox.vue'

const { userCoords, filterCovered, filterUncovered, filterKorrigo, filterCargoOnly, filterStdOnly } = storeToRefs(useMap())

defineProps<{
  nbUncovered?: number
  nbCovered?: number
  nbKorrigo?: number
}>()

// Geolocation features
const { coords, error, resume, pause, locatedAt } = useGeolocation({ immediate: false })

const geolocationPermission = usePermission('geolocation')

const isRequesting = ref(false)
const hasLocation = computed(() => locatedAt.value !== null && !error.value)

// Auto-start if permission was already granted
watch(geolocationPermission, (permission) => {
  if (permission === 'granted' && !hasLocation.value) {
    resume()
  }
}, { immediate: true })

function toggleGeolocation() {
  if (hasLocation.value) {
    pause()
    isRequesting.value = false
    emit('click-geoloc')
  } else {
    isRequesting.value = true
    resume()
  }
}

watch(locatedAt, () => { isRequesting.value = false })
watch(error, () => { isRequesting.value = false })
watch(coords, () => {
  if (coords.value.latitude && coords.value.longitude) {
    userCoords.value = coords.value
  }
})

const emit = defineEmits(['click-geoloc'])
</script>

<template>
  <div class="max-w-xs absolute top-5 left-5 z-10 grid gap-2">
    <button @click="toggleGeolocation" :title="error?.message ?? (hasLocation ? 'Aller à ma position' : 'Me localiser')"
      :class="[
        'size-9 grid place-items-center border shadow rounded-full cursor-pointer transition-colors',
        hasLocation
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-slate-50 text-slate-950 border-transparent hover:bg-background hover:text-primary hover:border-primary',
        error ? 'text-destructive border-destructive hover:text-destructive hover:border-destructive' : ''
      ]">
      <PhSpinner v-if="isRequesting" :size="20" class="animate-spin" />
      <PhMapPin v-else :size="20" weight="fill" />
    </button>

    <form class="p-2 bg-slate-50 text-slate-950 rounded-xs grid grid-cols-1 gap-3">
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
  </div>
</template>
