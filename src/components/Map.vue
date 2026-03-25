<script lang="ts" setup>
import 'leaflet/dist/leaflet.css'
import 'vue-leaflet-markercluster/dist/style.css'

import L from 'leaflet'
globalThis.L = L

import { useMap } from '@/stores/map'
import type { ApiResponse } from '@/types/Api'
import type { BikeParking } from '@/types/Bikes'
import { API_BASE_URL, API_LIMIT } from '@/utils/const'
import { useQuery } from '@pinia/colada'
import { LControlZoom, LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { LMarkerClusterGroup } from 'vue-leaflet-markercluster'
import BikeMarker from './BikeMarker.vue'

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

const { zoom, minZoom, center } = useMap()
</script>

<template>
  <header class="sr-only">
    <h1>
      Carte interactive des parkings vélo de Rennes Métropole
    </h1>
  </header>

  <main class="h-screen w-screen grid place-items-center">
    <div v-if="state.status === 'pending'">Loading...</div>
    <div v-else-if="state.status === 'error'">Error: {{ state.error.message }}</div>
    <template v-else>
      <LMap ref="map" :min-zoom v-model:zoom="zoom" v-model:center="center" :options="{ zoomControl: false }"
        :useGlobalLeaflet="true">
        <LControlZoom position="bottomright" />

        <LTileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" layer-type="base" />

        <!-- Review CSGroup -->
        <LMarkerClusterGroup v-if="state.data.length > 0" :max-cluster-radius="30" :disable-clustering-at-zoom="17">
          <BikeMarker v-once v-for="park in state.data" :key="park.code_insee" :park />
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
