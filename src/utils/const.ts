export const MAP_TILELAYER_URL =
  'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'

export const API_BASE_URL =
  'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/parkings_velos_sur_rennes_metropole/records'
export const API_LIMIT = 100

export const UNCOVERED_KEY = 'Non abrité'
export const COVERED_KEY = 'Abrité'
export const BOXED_KEY = 'Box individuel'
export const KORRIGO_KEY = 'Abonnement Korrigo'

export enum SpotType {
  Uncovered = UNCOVERED_KEY,
  Covered = COVERED_KEY,
  Boxed = BOXED_KEY,
}

export enum SpotAccess {
  Korrigo = KORRIGO_KEY,
}
