<script lang="ts" setup>
import { cn } from '@/utils/cn';
import type { BikeParking } from '@/types/Bikes';
import { PhBicycle, PhLockKey, PhSquareHalf, PhWarehouse } from '@phosphor-icons/vue';
import { LIcon, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import type { PointTuple } from 'leaflet';
import { computed, ref } from 'vue';

defineProps<{
  park: BikeParking
}>()

const normalIconSize: PointTuple = [30, 30]

const iconSize = ref<PointTuple>(normalIconSize)
const iconAnchor = computed<PointTuple>(() => [iconSize.value[0] / 2, iconSize.value[1]])
const popupOffset = [0, iconSize.value[0] * -0.66]
</script>

<template>
  <LMarker :lat-lng="[park.geo_point_2d.lat, park.geo_point_2d.lon]">
    <LPopup :options="{ offset: popupOffset, maxWidth: 520, minWidth: 240 }">
      <div>
        <h2 class="font-bold">
          {{ park.nom_voie }}, {{ park.nom_commune }}
        </h2>

        <div class="text-xs">
          {{ park.type }}, <strong>{{ park.nb_total_place }} places</strong>
        </div>

        <div v-if="park.condition_acces === 'Abonnement Korrigo'">
          <img src="/korrigo-logo.webp" alt="" width="50" class="max-w-12" title="Requiert un abonnement Korrigo">
        </div>

        <hr class="border-muted-foreground opacity-50 my-1">

        <div v-if="park.annee_mes" class="italic text-xs">
          Mis en service en {{ park.annee_mes }}
        </div>

        <div v-if="park.commentaire" v-html="park.commentaire"
          class="before:content-[''] before:inline-block before:w-1 before:h-[1em] before:-my-0.5 before:mr-1 before:rounded-xs before:bg-muted-foreground italic text-xs text-muted-foreground" />
      </div>
    </LPopup>

    <LIcon :icon-size :icon-anchor :class-name="cn(
      { 'korrigo': park.condition_acces === 'Abonnement Korrigo' },
      { 'highlight': park.type === 'Box individuel' || park.type === 'Abrité' },
    )">
      <PhBicycle v-if="park.type === 'Non abrité'" size="18" />
      <PhWarehouse v-else-if="park.type === 'Abrité'" size="18" />
      <PhSquareHalf v-else-if="park.type === 'Box individuel'" size="18" />
      <PhLockKey v-else-if="park.type === 'Collectif sécurisé'" size="18" weight="fill" />
    </LIcon>
  </LMarker>
</template>

<style lang="scss">
.leaflet-marker-icon:not(.marker-cluster) {
  border-radius: 50%;
  color: var(--color-muted-foreground);
  background-color: var(--color-background);
  display: grid;
  place-items: center;

  &.korrigo {
    color: var(--color-background);
    background-color: var(--color-amber-400);
  }

  &.highlight {
    color: var(--color-background);
    border: 2px solid var(--color-muted-foreground);
    background-color: var(--color-foreground);
  }
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
</style>
