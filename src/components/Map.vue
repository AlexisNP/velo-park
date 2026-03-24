<script lang="ts" setup>
import type { ApiResponse } from '@/types/Api'
import type { BikeParking } from '@/types/Bikes'
import { ref } from 'vue'

const BASE_URL = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/parkings_velos_sur_rennes_metropole/records'
const LIMIT = 100

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
