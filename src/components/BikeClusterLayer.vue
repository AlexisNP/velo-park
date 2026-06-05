<script lang="ts" setup>
import type { BikeParking } from '@/types/Bikes'
import { LMarkerClusterGroup } from 'vue-leaflet-markercluster'
import BikeMarker from './BikeMarker.vue'

defineProps<{
  parkings: BikeParking[]
  group: 'covered' | 'non-covered' | 'premium'
  visible: boolean
  maxClusterRadius: number
  disableClusteringAtZoom: number
}>()
</script>

<template>
  <LMarkerClusterGroup v-if="parkings.length > 0" :visible :max-cluster-radius :disable-clustering-at-zoom>
    <BikeMarker v-once v-for="park in parkings" :key="park.id_parc_velo" :park :group />
  </LMarkerClusterGroup>
</template>

<style lang="scss">
.marker-cluster div {
  font-family: var(--default-font-family);
  font-size: .95em;
}

.marker-cluster span {
  font-weight: var(--font-weight-bold);
  opacity: .5;
}

.marker-cluster-small {
  background-color: color-mix(in srgb, var(--color-green-400) 7.5%, transparent);

  div {
    background-color: color-mix(in srgb, var(--color-green-400) 10%, transparent);
  }
}

.marker-cluster-medium {
  background-color: color-mix(in srgb, var(--color-amber-500) 12.5%, transparent);

  div {
    background-color: color-mix(in srgb, var(--color-amber-500) 15%, transparent);
  }
}

.marker-cluster-large {
  background-color: color-mix(in srgb, var(--color-rose-500) 15%, transparent);

  div {
    background-color: color-mix(in srgb, var(--color-rose-500) 20%, transparent);
  }
}
</style>
