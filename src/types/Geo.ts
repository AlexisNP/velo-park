export interface GeoPoint {
  lon: number
  lat: number
}

export interface GeoShape {
  type: 'Feature'
  geometry: {
    coordinates: [number, number]
    type: 'Point'
  }
  properties: Record<string, unknown>
}
