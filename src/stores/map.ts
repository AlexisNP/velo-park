import type { PointTuple } from 'leaflet'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMap = defineStore('map', () => {
  const zoom = ref(10)
  const minZoom = 6
  const center = ref<PointTuple>([48.11180645878813, -1.6637869497745246])

  const maxClusterRadius = 30
  const disableClusteringAtZoom = 17

  const filterUncovered = ref(true)
  const filterCovered = ref(true)
  const filterKorrigo = ref(true)

  return {
    zoom,
    minZoom,
    center,
    maxClusterRadius,
    disableClusteringAtZoom,
    filterUncovered,
    filterCovered,
    filterKorrigo,
  }
})
