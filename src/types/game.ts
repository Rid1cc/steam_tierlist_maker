export interface Game {
  id: number
  name: string
  image: string
  genre: string
  releaseYear: number
}

export interface TierData {
  S: Game[]
  A: Game[]
  B: Game[]
  C: Game[]
  D: Game[]
  F: Game[]
}

export type TierKey = keyof TierData