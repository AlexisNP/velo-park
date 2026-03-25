<script setup lang="ts">
import Map from '@/components/Map.vue';
</script>

<template>
  <header class="sr-only">
    <h1>
      Carte interactive des parkings vélo de Rennes Métropole
    </h1>
  </header>

  <Suspense>
    <Map />
  </Suspense>
</template>
