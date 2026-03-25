import type { GeoPoint, GeoShape } from './Geo'

export interface BikeParking {
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
