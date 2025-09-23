import { useState, useCallback } from 'react'
import { Game } from '@/types/game'

interface SteamUser {
  steamId: string
  username: string
  realName?: string
  profileUrl: string
  avatar: string
  isPublic: boolean
  country?: string
  accountCreated?: string
}

interface UseSteamApiReturn {
  loading: boolean
  error: string | null
  user: SteamUser | null
  games: Game[]
  fetchUserGames: (steamId: string) => Promise<void>
  fetchUserInfo: (steamId: string) => Promise<void>
  fetchFamilyGames: (webApiToken: string, familyGroupId?: string) => Promise<void>
  clearError: () => void
}

// Simple client-side request deduplication
const pendingRequests = new Map<string, Promise<any>>()

export function useSteamApi(): UseSteamApiReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<SteamUser | null>(null)
  const [games, setGames] = useState<Game[]>([])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchUserInfo = useCallback(async (steamId: string) => {
    if (!steamId) {
      setError('Steam ID is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/steam/user?steamId=${encodeURIComponent(steamId)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user info')
      }

      if (data.success) {
        setUser(data.user)
      }
    } catch (err) {
      console.error('Error fetching Steam user info:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUserGames = useCallback(async (steamId: string) => {
    if (!steamId) {
      setError('Steam ID is required')
      return
    }

    // Check for pending request with same steamId
    const requestKey = `games_${steamId}`
    if (pendingRequests.has(requestKey)) {
      try {
        await pendingRequests.get(requestKey)
        return // Request already completed
      } catch (err) {
        // Previous request failed, continue with new one
        pendingRequests.delete(requestKey)
      }
    }

    setLoading(true)
    setError(null)

    const requestPromise = (async () => {
      try {
        // First fetch user info
        await fetchUserInfo(steamId)

        // Then fetch games
        const response = await fetch(`/api/steam/games?steamId=${encodeURIComponent(steamId)}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch games')
        }

        if (data.success) {
          setGames(data.games)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching Steam games:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        setGames([])
        throw err // Re-throw for pending request handling
      } finally {
        setLoading(false)
        pendingRequests.delete(requestKey)
      }
    })()

    // Store the promise for deduplication
    pendingRequests.set(requestKey, requestPromise)
    await requestPromise
  }, [fetchUserInfo])

  const fetchFamilyGames = useCallback(async (webApiToken: string, familyGroupId: string = '0') => {
    if (!webApiToken.trim()) {
      setError('Web API token is required for Family Sharing games')
      return
    }

    // Check for pending request with same token + familyGroupId
    const tokenHash = webApiToken.slice(-8) // Use last 8 chars for privacy
    const requestKey = `family_${tokenHash}_${familyGroupId}`
    if (pendingRequests.has(requestKey)) {
      try {
        await pendingRequests.get(requestKey)
        return // Request already completed
      } catch (err) {
        // Previous request failed, continue with new one
        pendingRequests.delete(requestKey)
      }
    }

    setLoading(true)
    setError(null)

    const requestPromise = (async () => {
      try {
        const response = await fetch(`/api/steam/family?webApiToken=${encodeURIComponent(webApiToken)}&familyGroupId=${encodeURIComponent(familyGroupId)}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch family shared games')
        }

        if (data.success) {
          setGames(data.games)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching Steam family games:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        setGames([])
        throw err // Re-throw for pending request handling
      } finally {
        setLoading(false)
        pendingRequests.delete(requestKey)
      }
    })()

    // Store the promise for deduplication
    pendingRequests.set(requestKey, requestPromise)
    await requestPromise
  }, [])

  return {
    loading,
    error,
    user,
    games,
    fetchUserGames,
    fetchUserInfo,
    fetchFamilyGames,
    clearError
  }
}

// Helper function to extract Steam ID from various Steam URL formats
export function extractSteamId(input: string): string | null {
  // Remove whitespace
  input = input.trim()
  
  // If it's already a Steam ID (17 digits starting with 765611...)
  if (/^765611\d{10}$/.test(input)) {
    return input
  }
  
  // Extract from Steam profile URLs
  const urlPatterns = [
    /steamcommunity\.com\/profiles\/(\d+)/,
    /steamcommunity\.com\/id\/([^\/]+)/
  ]
  
  for (const pattern of urlPatterns) {
    const match = input.match(pattern)
    if (match) {
      // If it's a custom URL (/id/), we'd need another API call to resolve it
      // For now, return the matched part and let the API handle it
      return match[1]
    }
  }
  
  // If no pattern matches, return the input as-is (might be a custom ID)
  return input || null
}

// Helper to validate Steam ID format
export function isValidSteamId(steamId: string): boolean {
  return /^765611\d{10}$/.test(steamId)
}