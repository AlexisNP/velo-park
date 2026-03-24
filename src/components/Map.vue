<script lang="ts" setup>
import { ref } from 'vue'

const BASE_URL = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/parkings_velos_sur_rennes_metropole/records'
const LIMIT = 100

interface GeoPoint {
  lon: number
  lat: number
}

interface GeoShape {
  type: 'Feature'
  geometry: {
    coordinates: [number, number]
    type: 'Point'
  }
  properties: Record<string, unknown>
}

interface BikeParking {
  geo_point_2d: GeoPoint
  geo_shape: GeoShape
  gml_id: string
  id_parc_velo: number
  nom: string | null
  code_insee: number
  nom_commune: string
  nom_voie: string
  id_voie: number
  type: string
  gestionnaire: string
  localisation: string
  condition_acces: string
  annee_mes: number
  nb_support_std: number | null
  nb_support_cargo: number | null
  nb_total_place: number
  date_maj: string
  commentaire: string | null
}

interface ApiResponse {
  total_count: number
  results: BikeParking[]
}

const res = ref<BikeParking[]>([])

const firstPage = await fetch(`${BASE_URL}?limit=${LIMIT}`).then(r => r.json()) as ApiResponse
const { total_count } = firstPage

const remainingPages = await Promise.all(
  Array.from(
    { length: Math.ceil((total_count - LIMIT) / LIMIT) },
    (_, i) => fetch(`${BASE_URL}?limit=${LIMIT}&offset=${(i + 1) * LIMIT}`).then(r => r.json()) as Promise<ApiResponse>
  )
)

res.value = [
  ...(firstPage.results ?? []),
  ...remainingPages.flatMap(page => page.results ?? [])
]
</script>

<template>
  <header class="sr-only">
    <h1>
      Carte interactive des parkings vélo de Rennes Métropole
    </h1>
  </header>

  <main class="h-screen w-screen grid place-items-center">
    <pre>
      {{ res }}
    </pre>
  </main>
</template>
