import { storeToRefs } from 'pinia'
import { useMap } from '@/stores/map'
import type { BikeParking } from '@/types/Bikes'

export function useRouting() {
  const { userCoords, activeRoute, isRoutingLoading } = storeToRefs(useMap())

  async function routeTo(park: BikeParking) {
    if (!userCoords.value) return false // caller handles the nudge

    isRoutingLoading.value = true
    activeRoute.value = null

    const { latitude: uLat, longitude: uLon } = userCoords.value
    const { lat: pLat, lon: pLon } = park.geo_point_2d

    const url = `https://router.project-osrm.org/route/v1/bike/${uLon},${uLat};${pLon},${pLat}?geometries=geojson&overview=full`
    const data = await fetch(url).then((r) => r.json())

    activeRoute.value = data.routes[0].geometry
    isRoutingLoading.value = false

    return true
  }

  return { routeTo, activeRoute, isRoutingLoading }
}
