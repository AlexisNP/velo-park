<script setup lang="ts">
import BikeMap from '@/components/BikeMap.vue';
</script>

<template>
  <header class="sr-only">
    <h1>
      Carte interactive des parkings vélo de Rennes Métropole
    </h1>
  </header>

  <Suspense>
    <BikeMap />
  </Suspense>
</template>
