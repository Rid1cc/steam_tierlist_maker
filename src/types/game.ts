export interface Game {
  id: number
  name: string
  image: string
  genre: string
  releaseYear: number
  playtime?: number // Hours played (optional, from Steam API)
  isShared?: boolean // Is this a family shared game?
  ownerSteamId?: string // Steam ID of the game owner (for shared games)
  lastPlayed?: string | null // Last played date (ISO string)
}

export interface TierData {
  S: Game[]
  A: Game[]
  B: Game[]
  C: Game[]
  D: Game[]
  F: Game[]
  [key: string]: Game[] // Allow dynamic tier keys
}

export type TierKey = keyof TierData