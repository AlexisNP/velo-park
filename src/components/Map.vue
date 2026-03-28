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
import { LMarkerClusterGroup } from 'vue-leaflet-markercluster'
import BikeMarker from './BikeMarker.vue'
import BikeFilters from './BikeFilters.vue'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

async function fetchAllBikeParkings(): Promise<BikeParking[]> {
  const firstPage = await fetch(`${API_BASE_URL}?limit=${API_LIMIT}`).then(r => r.json()) as ApiResponse
  const { total_count } = firstPage

  const remainingPages = await Promise.all(
    Array.from(
      { length: Math.ceil((total_count - API_LIMIT) / API_LIMIT) },
      (_, i) => fetch(`${API_BASE_URL}?limit=${API_LIMIT}&offset=${(i + 1) * API_LIMIT}`).then(r => r.json()) as Promise<ApiResponse>
    )
  )

  return [
    ...(firstPage.results ?? []),
    ...remainingPages.flatMap(page => page.results ?? [])
  ]
}

const { state } = useQuery({
  key: ['bike-parkings'],
  query: fetchAllBikeParkings,
})

// Groups different parking spot by types
const nonCoveredParkings = computed(() =>
  state.value.data?.filter(p => p.type === SpotType.Uncovered) ?? []
)
const nonCoveredParkingsSpots = computed(() => {
  return nonCoveredParkings.value.reduce((acc, val) => acc + val.nb_total_place, 0)
})

const coveredTypes = new Set([SpotType.Covered, SpotType.Boxed])

const coveredParkings = computed(() =>
  state.value.data?.filter(p => coveredTypes.has(p.type as SpotType)) ?? []
)
const coveredParkingsSpots = computed(() => {
  return coveredParkings.value.reduce((acc, val) => acc + val.nb_total_place, 0)
})

const premiumParkings = computed(() =>
  state.value.data?.filter(p => p.condition_acces === SpotAccess.Korrigo) ?? []
)
const premiumParkingsSpots = computed(() => {
  return premiumParkings.value.reduce((acc, val) => acc + val.nb_total_place, 0)
})

const { zoom, minZoom, center, maxClusterRadius, disableClusteringAtZoom } = useMap()
const { filterUncovered, filterCovered, filterKorrigo } = storeToRefs(useMap())
</script>

<template>
  <Transition enter-from-class="opacity-0 translate-y-2"
    enter-active-class="transition-all duration-500 ease-out delay-300" enter-to-class="opacity-100 translate-y-0">
    <BikeFilters v-if="state.status === 'success'" :nb-uncovered="nonCoveredParkingsSpots"
      :nb-covered="coveredParkingsSpots" :nb-korrigo="premiumParkingsSpots" />
  </Transition>

  <main class="relative z-0 h-screen w-screen grid place-items-center">
    <div v-if="state.status === 'pending'">Loading...</div>
    <div v-else-if="state.status === 'error'">Error: {{ state.error.message }}</div>
    <template v-else>
      <LMap ref="map" :min-zoom v-model:zoom="zoom" v-model:center="center" :options="{ zoomControl: false }"
        :useGlobalLeaflet="true">
        <LControlZoom position="bottomright" />

        <LTileLayer v-once :url="MAP_TILELAYER_URL" layer-type="base" />

        <!-- Covered parkings: Abrité, Box individuel -->
        <LMarkerClusterGroup :visible="filterCovered" v-if="coveredParkings.length > 0" :max-cluster-radius
          :disable-clustering-at-zoom>
          <BikeMarker v-once v-for="park in coveredParkings" :key="park.id_parc_velo" :park group="covered" />
        </LMarkerClusterGroup>

        <!-- Non-covered parkings: Non abrité -->
        <LMarkerClusterGroup :visible="filterUncovered" v-if="nonCoveredParkings.length > 0" :max-cluster-radius
          :disable-clustering-at-zoom>
          <BikeMarker v-once v-for="park in nonCoveredParkings" :key="park.id_parc_velo" :park group="non-covered" />
        </LMarkerClusterGroup>

        <!-- Premium parkings: Abonnement Korrigo -->
        <LMarkerClusterGroup :visible="filterKorrigo" v-if="premiumParkings.length > 0" :max-cluster-radius
          :disable-clustering-at-zoom>
          <BikeMarker v-once v-for="park in premiumParkings" :key="park.id_parc_velo" :park group="premium" />
        </LMarkerClusterGroup>
      </LMap>
    </template>
  </main>
</template>

<style lang="scss">
.marker-cluster-small {
  background-color: color-mix(in srgb, var(--color-green-500) 25%, transparent);

  div {
    background-color: color-mix(in srgb, var(--color-green-500) 33%, transparent);
  }
}

.marker-cluster-medium {
  background-color: color-mix(in srgb, var(--color-yellow-400) 25%, transparent);

  div {
    background-color: color-mix(in srgb, var(--color-yellow-400) 33%, transparent);
  }
}

.marker-cluster-large {
  background-color: color-mix(in srgb, var(--color-rose-400) 25%, transparent);

  div {
    background-color: color-mix(in srgb, var(--color-rose-400) 33%, transparent);
  }
}
</style>
