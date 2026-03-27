<script lang="ts" setup>
import { useMap } from '@/stores/map';
import { PhCheck } from '@phosphor-icons/vue';
import { storeToRefs } from 'pinia';
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

const { filterCovered, filterUncovered, filterKorrigo } = storeToRefs(useMap())

defineProps<{
  nbUncovered?: number
  nbCovered?: number
  nbKorrigo?: number
}>()
</script>

<template>
  <aside class="absolute top-5 left-5 z-10 p-2 bg-slate-50 text-slate-950 text-xs rounded-xs">
    <form>
      <div class="grid gap-1.5">
        <label class="flex flex-row gap-1.5 items-center [&>.checkbox]:hover:bg-foreground text-sm cursor-pointer">
          <CheckboxRoot v-model="filterUncovered"
            class="hover:bg-stone-50 flex size-4 appearance-none items-center justify-center rounded-xs bg-foreground shadow-sm border focus-within:ring-1 cursor-pointer">
            <CheckboxIndicator class="bg-foreground size-full flex items-center justify-center">
              <PhCheck :size="10" />
            </CheckboxIndicator>
          </CheckboxRoot>

          <span class="select-none">
            Non-abrités

            <small v-if="nbUncovered">
              ({{ nbUncovered }})
            </small>
          </span>
        </label>

        <label class="flex flex-row gap-1.5 items-center [&>.checkbox]:hover:bg-foreground text-sm cursor-pointer">
          <CheckboxRoot v-model="filterCovered"
            class="hover:bg-stone-50 flex size-4 appearance-none items-center justify-center rounded-xs bg-foreground shadow-sm border focus-within:ring-1 cursor-pointer">
            <CheckboxIndicator class="bg-foreground size-full flex items-center justify-center">
              <PhCheck :size="10" />
            </CheckboxIndicator>
          </CheckboxRoot>

          <span class="select-none">
            Abrités

            <small v-if="nbCovered">
              ({{ nbCovered }})
            </small>
          </span>
        </label>

        <label class="flex flex-row gap-1.5 items-center [&>.checkbox]:hover:bg-foreground text-sm cursor-pointer">
          <CheckboxRoot v-model="filterKorrigo"
            class="hover:bg-stone-50 flex size-4 appearance-none items-center justify-center rounded-xs bg-foreground shadow-sm border focus-within:ring-1 cursor-pointer">
            <CheckboxIndicator class="bg-foreground size-full flex items-center justify-center">
              <PhCheck :size="10" />
            </CheckboxIndicator>
          </CheckboxRoot>

          <span class="select-none">
            Abonnement Korrigo

            <small v-if="nbKorrigo">
              ({{ nbKorrigo }})
            </small>
          </span>
        </label>
      </div>
    </form>
  </aside>
</template>
