<script lang="ts" setup>
import 'leaflet/dist/leaflet.css'
import 'vue-leaflet-markercluster/dist/style.css'

import L, { type PointTuple } from 'leaflet'
globalThis.L = L

import type { ApiResponse } from '@/types/Api'
import type { BikeParking } from '@/types/Bikes'
import { API_BASE_URL, API_LIMIT } from '@/utils/const'
import { useQuery } from '@pinia/colada'
import { LControlZoom, LIcon, LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { LMarkerClusterGroup } from 'vue-leaflet-markercluster'
import { useMap } from '@/stores/map'
import { computed, ref } from 'vue'
import { PhBicycle } from '@phosphor-icons/vue'

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
const normalIconSize: PointTuple = [30, 30]

const iconSize = ref<PointTuple>(normalIconSize)
const iconAnchor = computed<PointTuple>(() => [iconSize.value[0] / 2, iconSize.value[1]])
const popupOffset = [0, iconSize.value[0] * -0.66]
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
        <LMarkerClusterGroup v-if="state.data.length > 0" :max-cluster-radius="30" :disable-clustering-at-zoom="20">
          <LMarker v-once v-for="park in state.data" :key="park.code_insee"
            :lat-lng="[park.geo_point_2d.lat, park.geo_point_2d.lon]">
            <LPopup :options="{ offset: popupOffset, maxWidth: 380, minWidth: 180 }">
              <div>
                <h2 class="font-bold">
                  {{ park.nom_voie }}, {{ park.nom_commune }}
                </h2>

                <div class="text-xs">
                  {{ park.type }}, <strong>{{ park.nb_total_place }} places</strong>
                </div>

                <hr class="border-muted-foreground opacity-50 my-1">

                <div v-if="park.annee_mes" class="italic text-xs">
                  Mis en service en {{ park.annee_mes }}
                </div>

                <div v-if="park.commentaire" v-html="park.commentaire"
                  class="before:content-[''] before:inline-block before:w-1 before:h-[1em] before:-my-0.5 before:mr-1 before:rounded-xs before:bg-muted-foreground italic text-xs text-muted-foreground" />
              </div>
            </LPopup>

            <LIcon :icon-size :icon-anchor>
              <PhBicycle size="18" />
            </LIcon>
          </LMarker>
        </LMarkerClusterGroup>
      </LMap>
    </template>
  </main>
</template>

<style lang="scss">
.leaflet-marker-icon:not(.marker-cluster) {
  border-radius: 50%;
  color: var(--color-muted-foreground);
  background-color: var(--color-background);
  display: grid;
  place-items: center;
}

.leaflet-popup-content-wrapper {
  border-radius: 5px;

  .leaflet-popup-content {
    margin: 10px 20px 10px 15px;

    p {
      margin-bottom: 0;
    }
  }
}

.marker-cluster span {
  font-weight: var(--font-weight-medium);
}

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
