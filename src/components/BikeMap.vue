<script lang="ts" setup>
import 'leaflet/dist/leaflet.css'
import 'vue-leaflet-markercluster/dist/style.css'

import L from 'leaflet'
globalThis.L = L

import { useMap } from '@/stores/map'
import type { ApiResponse } from '@/types/Api'
import type { BikeParking } from '@/types/Bikes'
import { API_BASE_URL, API_LIMIT, MAP_TILELAYER_URL, SpotAccess, SpotType } from '@/utils/const'
import { useQuery } from '@pinia/colada'
import { LControlZoom, LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import BikeFilters from './BikeFilters.vue'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import BikeClusterLayer from './BikeClusterLayer.vue'
import { PhCircleNotch } from '@phosphor-icons/vue'

const fetchedPages = ref(0)
const totalPages = ref(1)
const progress = computed(() => Math.round((fetchedPages.value / totalPages.value) * 100))

async function fetchAllBikeParkings(): Promise<BikeParking[]> {
  fetchedPages.value = 0

  const firstPage = await fetch(`${API_BASE_URL}?limit=${API_LIMIT}`).then(r => r.json()) as ApiResponse
  const { total_count } = firstPage

  const remainingCount = Math.ceil((total_count - API_LIMIT) / API_LIMIT)
  totalPages.value = remainingCount + 1
  fetchedPages.value = 1

  const results: BikeParking[] = [...(firstPage.results ?? [])]

  await Promise.all(
    Array.from({ length: remainingCount }, (_, i) =>
      fetch(`${API_BASE_URL}?limit=${API_LIMIT}&offset=${(i + 1) * API_LIMIT}`)
        .then(r => r.json() as Promise<ApiResponse>)
        .then(page => {
          results.push(...(page.results ?? []))
          fetchedPages.value++
        })
    )
  )

  return results
}

const { state } = useQuery({
  key: ['bike-parkings'],
  query: fetchAllBikeParkings,
})

// Groups different parking spot by types
const nonCoveredParkings = computed(() =>
  state.value.data?.filter(p => p.type === SpotType.Uncovered) ?? []
)
const nonCoveredParkingsSpots = computed(() =>
  nonCoveredParkings.value.reduce((acc, val) => acc + val.nb_total_place, 0)
)

const coveredTypes = new Set([SpotType.Covered, SpotType.Boxed])

const coveredParkings = computed(() =>
  state.value.data?.filter(p => coveredTypes.has(p.type as SpotType)) ?? []
)
const coveredParkingsSpots = computed(() =>
  coveredParkings.value.reduce((acc, val) => acc + val.nb_total_place, 0)
)

const premiumParkings = computed(() =>
  state.value.data?.filter(p => p.condition_acces === SpotAccess.Korrigo) ?? []
)
const premiumParkingsSpots = computed(() =>
  premiumParkings.value.reduce((acc, val) => acc + val.nb_total_place, 0)
)

const { zoom, minZoom, center, maxBounds, maxBoundsViscosity, maxClusterRadius, disableClusteringAtZoom, extraOptions } = useMap()
const { filterUncovered, filterCovered, filterKorrigo } = storeToRefs(useMap())
</script>

<template>
  <Transition enter-from-class="opacity-0 translate-y-2"
    enter-active-class="transition-all duration-300 ease-out delay-500" enter-to-class="opacity-100 translate-y-0">
    <BikeFilters v-if="state.status === 'success'" :nb-uncovered="nonCoveredParkingsSpots"
      :nb-covered="coveredParkingsSpots" :nb-korrigo="premiumParkingsSpots" />
  </Transition>

  <main class="relative z-0 h-screen w-screen grid place-items-center">
    <div v-if="state.status === 'pending'" class="flex flex-col items-center gap-3 text-sm">
      <span>Chargement des parkings… {{ progress }}%</span>
      <progress :value="progress" max="100"
        class="w-48 h-1.5 rounded-full bg-muted [&::-webkit-progress-bar]:bg-muted-foreground [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary" />
      <PhCircleNotch :size="24" class="animate-spin text-primary" />
    </div>

    <div v-else-if="state.status === 'error'">Error: {{ state.error.message }}</div>

    <template v-else>
      <LMap ref="map" :min-zoom v-model:zoom="zoom" :center="center" :max-bounds :max-bounds-viscosity
        :options="extraOptions" :useGlobalLeaflet="true">
        <LControlZoom position="bottomright" />
        <LTileLayer v-once :url="MAP_TILELAYER_URL" layer-type="base" />

        <BikeClusterLayer :parkings="coveredParkings" group="covered" :visible="filterCovered" :max-cluster-radius
          :disable-clustering-at-zoom />
        <BikeClusterLayer :parkings="nonCoveredParkings" group="non-covered" :visible="filterUncovered"
          :max-cluster-radius :disable-clustering-at-zoom />
        <BikeClusterLayer :parkings="premiumParkings" group="premium" :visible="filterKorrigo" :max-cluster-radius
          :disable-clustering-at-zoom />
      </LMap>
    </template>
  </main>
</template>

<style lang="scss">
.leaflet-container {
  background-color: var(--background);
}
</style>
