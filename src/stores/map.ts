import type { PointTuple } from 'leaflet'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMap = defineStore('map', () => {
  const zoom = ref(7)
  const minZoom = 4
  const center = ref<PointTuple>([47.809376, -0.637207])

  return {
    zoom,
    minZoom,
    center,
  }
})
