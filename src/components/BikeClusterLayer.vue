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
  font-size: .9em;
}

.marker-cluster span {
  font-weight: var(--font-weight-bold);
  opacity: .85;
}

.marker-cluster-small {
  background-color: color-mix(in srgb, var(--color-green-500) 12.5%, transparent);

  div {
    background-color: color-mix(in srgb, var(--color-green-500) 20%, transparent);
  }
}

.marker-cluster-medium {
  background-color: color-mix(in srgb, var(--color-yellow-400) 12.5%, transparent);

  div {
    background-color: color-mix(in srgb, var(--color-yellow-400) 20%, transparent);
  }
}

.marker-cluster-large {
  background-color: color-mix(in srgb, var(--color-rose-400) 12.5%, transparent);

  div {
    background-color: color-mix(in srgb, var(--color-rose-400) 20%, transparent);
  }
}
</style>
