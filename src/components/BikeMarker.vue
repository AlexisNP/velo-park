<script lang="ts" setup>
import { useRouting } from '@/composables/useRouting';
import { SPOTS_MAX, useMap } from '@/stores/map';
import type { BikeParking } from '@/types/Bikes';
import { cn } from '@/utils/cn';
import { BOXED_KEY, COVERED_KEY, KORRIGO_KEY, UNCOVERED_KEY } from '@/utils/const';
import { PhBicycle, PhLockKey, PhSquareHalf, PhWarehouse } from '@phosphor-icons/vue';
import { LIcon, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import type { PointTuple } from 'leaflet';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const props = defineProps<{
  park: BikeParking
  group: 'covered' | 'non-covered' | 'premium'
}>()

const normalIconSize: PointTuple = [30, 30]

const iconSize = ref<PointTuple>(normalIconSize)
const iconAnchor = computed<PointTuple>(() => [iconSize.value[0] / 2, iconSize.value[1]])
const popupOffset = [0, iconSize.value[0] * -0.66]

const { spotsRange, filterCargoOnly, filterStdOnly } = storeToRefs(useMap())

const isMarkerVisibleLayers = computed(() => {
  const [min, max] = spotsRange.value
  const spots = props.park.nb_total_place

  if (max >= SPOTS_MAX) return spots >= min
  return spots >= min && spots <= max
})

const isMarkerVisibleEquipments = computed(() => {
  const checks = [
    [filterCargoOnly.value, (props.park.nb_support_cargo ?? 0) > 0],
    [filterStdOnly.value, (props.park.nb_support_std ?? 0) > 0],
  ] as const

  return checks.every(([active, passes]) => !active || passes)
})

const isMarkerVisible = computed(() => isMarkerVisibleLayers.value && isMarkerVisibleEquipments.value)

// Routing
const { routeTo } = useRouting()
const { userCoords } = storeToRefs(useMap())

const emit = defineEmits<{
  nudgeGeolocation: []
}>()

async function handleMarkerClick() {
  if (!userCoords.value) {
    emit('nudgeGeolocation')
    return
  }

  await routeTo(props.park)
}
</script>

<template>
  <LMarker :lat-lng="[park.geo_point_2d.lat, park.geo_point_2d.lon]" :visible="isMarkerVisible"
    @click="handleMarkerClick">
    <LPopup :options="{ offset: popupOffset, maxWidth: 520, minWidth: 240 }">
      <div>
        <h2 class="font-bold">
          {{ park.nom_voie }}, {{ park.nom_commune }}
        </h2>

        <div class="text-xs">
          {{ park.type }}, <strong>{{ park.nb_total_place }} places</strong>

          <template v-if="park.nb_support_cargo">
            <br>
            …dont <strong>{{ park.nb_support_cargo }} cargo</strong>
          </template>

          <template v-if="park.nb_support_std">
            <br>
            …dont <strong>{{ park.nb_support_std }} STD</strong>
          </template>
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
      `group-${group}`,
      { 'korrigo': park.condition_acces === KORRIGO_KEY },
      { 'highlight': park.type === BOXED_KEY || park.type === COVERED_KEY },
    )">
      <PhBicycle v-if="park.type === UNCOVERED_KEY" size="18" />
      <PhWarehouse v-else-if="park.type === COVERED_KEY" size="18" weight="light" />
      <PhSquareHalf v-else-if="park.type === BOXED_KEY" size="18" weight="light" />
      <PhLockKey v-else-if="park.condition_acces === KORRIGO_KEY" size="18" weight="fill" />
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
    color: var(--color-amber-400);
    border: 2px solid color-mix(in srgb, var(--color-amber-400) 50%, var(--color-background));
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
