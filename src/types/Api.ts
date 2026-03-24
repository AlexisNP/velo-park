import type { BikeParking } from './Bikes'

export interface ApiResponse {
  total_count: number
  results: BikeParking[]
}
