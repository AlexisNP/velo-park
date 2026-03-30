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
