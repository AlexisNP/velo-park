import type { PointTuple } from 'leaflet'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const SPOTS_MIN = 1
export const SPOTS_MAX = 99

export const useMap = defineStore('map', () => {
  // Map config and options
  const zoom = ref(10)
  const minZoom = 8
  const center = ref<PointTuple>([48.11180645878813, -1.6637869497745246])
  const topLeftCorner: PointTuple = [48.88261491330733, -3.437430524894775]
  const bottomRightCorner: PointTuple = [47.31027605502938, 0.6437600778583776]
  const maxBounds: PointTuple[] = [topLeftCorner, bottomRightCorner]
  const maxBoundsViscosity = 0.9

  const extraOptions: Record<string, any> = {
    zoomControl: false,
  }

  // Cluster layers options
  const maxClusterRadius = 40
  const disableClusteringAtZoom = 17

  // Geolocation
  const userCoords = ref<Omit<GeolocationCoordinates, 'toJSON'> | null>(null)

  // Active filters
  const filterUncovered = ref(true)
  const filterCovered = ref(true)
  const filterKorrigo = ref(true)

  const filterCargoOnly = ref(false)
  const filterStdOnly = ref(false)

  const spotsRange = ref<[number, number]>([SPOTS_MIN, SPOTS_MAX])

  // Routing
  const activeRoute = ref<GeoJSON.LineString | null>(null)
  const isRoutingLoading = ref(false)

  return {
    zoom,
    minZoom,
    center,
    maxBounds,
    maxBoundsViscosity,
    extraOptions,
    maxClusterRadius,
    disableClusteringAtZoom,
    userCoords,
    filterUncovered,
    filterCovered,
    filterKorrigo,
    filterCargoOnly,
    filterStdOnly,
    spotsRange,
    activeRoute,
    isRoutingLoading,
  }
})
