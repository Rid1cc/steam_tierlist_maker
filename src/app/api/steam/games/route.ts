import { NextRequest, NextResponse } from 'next/server'
import { steamCache, rateLimiter } from '@/lib/cache'

interface SteamGame {
  appid: number
  name: string
  playtime_forever: number
  img_icon_url: string
  has_community_visible_stats?: boolean
}

interface SteamApiResponse {
  response: {
    game_count: number
    games: SteamGame[]
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const steamId = searchParams.get('steamId')
    
    console.log(`[STEAM API] GET /api/steam/games - steamId: ${steamId}`)
    
    if (!steamId) {
      console.log('[STEAM API] Error: Steam ID is required')
      return NextResponse.json(
        { error: 'Steam ID is required' }, 
        { status: 400 }
      )
    }

    // Rate limiting - max 5 requests per minute per IP
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    console.log(`[STEAM API] Rate limiting check for IP: ${clientIP}`)
    
    if (!rateLimiter.isAllowed(`games_${clientIP}`, 5, 1)) {
      const resetTime = rateLimiter.getResetTime(`games_${clientIP}`)
      console.log(`[STEAM API] Rate limit exceeded for IP: ${clientIP}`)
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: resetTime ? new Date(resetTime).toISOString() : null
        }, 
        { status: 429 }
      )
    }

    // Check cache first (30 minutes TTL)
    const cacheKey = `games_${steamId}`
    const cachedData = steamCache.get(cacheKey)
    if (cachedData) {
      console.log(`[STEAM API] Cache HIT for key: ${cacheKey}`)
      return NextResponse.json(cachedData)
    }
    
    console.log(`[STEAM API] Cache MISS for key: ${cacheKey} - fetching from Steam API`)

    const apiKey = process.env.STEAM_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Steam API key not configured' }, 
        { status: 500 }
      )
    }

    // Fetch owned games from Steam API
    const steamApiUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=true&include_played_free_games=true`
    
    console.log(`[STEAM API] Fetching games from Steam API for steamId: ${steamId}`)
    
    const response = await fetch(steamApiUrl)
    
    if (!response.ok) {
      console.log(`[STEAM API] Steam API error - Status: ${response.status}`)
      throw new Error(`Steam API responded with status: ${response.status}`)
    }

    const data: SteamApiResponse = await response.json()
    console.log(`[STEAM API] Received ${data.response?.games?.length || 0} games from Steam`)
    
    if (!data.response || !data.response.games) {
      return NextResponse.json(
        { error: 'No games found or profile is private' }, 
        { status: 404 }
      )
    }

    // Transform Steam games to our format
    const games = data.response.games
      .filter(game => game.playtime_forever > 0) // Only games that were played
      .sort((a, b) => b.playtime_forever - a.playtime_forever) // Sort by playtime
      // Remove limit - return ALL games
      .map(game => ({
        id: game.appid,
        name: game.name,
        image: game.img_icon_url 
          ? `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`
          : `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`,
        playtime: Math.round(game.playtime_forever / 60), // Convert to hours
        genre: 'Unknown', // Steam API doesn't provide genre in this endpoint
        releaseYear: new Date().getFullYear() // Placeholder
      }))

    const responseData = {
      success: true,
      gameCount: data.response.game_count,
      games,
      timestamp: Date.now()
    }

    // Cache the response for 30 minutes
    steamCache.set(cacheKey, responseData, 30)

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Steam API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Steam games' }, 
      { status: 500 }
    )
  }
}