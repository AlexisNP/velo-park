<script setup lang="ts">
import { useMap } from '@/stores/map';
import { PhMapPin } from '@phosphor-icons/vue';
import { LIcon, LMarker } from '@vue-leaflet/vue-leaflet';
import type { PointTuple } from 'leaflet';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const normalIconSize: PointTuple = [30, 30]

const iconSize = ref<PointTuple>(normalIconSize)
const iconAnchor = computed<PointTuple>(() => [iconSize.value[0] / 2, iconSize.value[1]])

// Geolocation
const { userCoords } = storeToRefs(useMap())
</script>

<template>
  <LMarker v-if="userCoords" :lat-lng="[userCoords.latitude, userCoords.longitude]" :icon-size :icon-anchor>
    <LIcon>
      <PhMapPin size="20" weight="fill" class="text-amber-400" />
    </LIcon>
  </LMarker>
</template>
