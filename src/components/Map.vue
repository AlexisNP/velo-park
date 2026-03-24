<script lang="ts" setup>
import type { ApiResponse } from '@/types/Api'
import type { BikeParking } from '@/types/Bikes'
import { API_BASE_URL, API_LIMIT } from '@/utils/const'
import { useQuery } from '@pinia/colada'

async function fetchAllBikeParkings(): Promise<BikeParking[]> {
  const firstPage = await fetch(`${API_BASE_URL}?limit=${API_LIMIT}`).then(r => r.json()) as ApiResponse
  const { total_count } = firstPage

  const remainingPages = await Promise.all(
    Array.from(
      { length: Math.ceil((total_count - API_LIMIT) / API_LIMIT) },
      (_, i) => fetch(`${API_BASE_URL}?limit=${API_LIMIT}&offset=${(i + 1) * API_LIMIT}`).then(r => r.json()) as Promise<ApiResponse>
    )
  )

  return [
    ...(firstPage.results ?? []),
    ...remainingPages.flatMap(page => page.results ?? [])
  ]
}

const { state } = useQuery({
  key: ['bike-parkings'],
  query: fetchAllBikeParkings,
})
</script>

<template>
  <header class="sr-only">
    <h1>
      Carte interactive des parkings vélo de Rennes Métropole
    </h1>
  </header>

  <main class="h-screen w-screen grid place-items-center">
    <div v-if="state.status === 'pending'">Loading...</div>
    <div v-else-if="state.status === 'error'">Error: {{ state.error.message }}</div>
    <pre v-else>{{ state.data }}</pre>
  </main>
</template>
