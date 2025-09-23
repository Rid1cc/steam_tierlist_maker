import { NextRequest, NextResponse } from 'next/server'
import { steamCache, rateLimiter } from '@/lib/cache'

interface FamilyApp {
  appid: number
  name: string
  sort_as: string
  owner_steamid: string
  rt_time_acquired: number
  rt_last_played: number
  rt_playtime: number
  excluded_by_library_owner: boolean
  free_weekend_id?: number
}

interface FamilyAppsResponse {
  response: {
    apps: FamilyApp[]
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const webApiToken = searchParams.get('webApiToken')
    const familyGroupId = searchParams.get('familyGroupId') || '0'
    
    console.log(`[STEAM FAMILY API] GET /api/steam/family - familyGroupId: ${familyGroupId}`)
    
    if (!webApiToken) {
      console.log('[STEAM FAMILY API] Error: Web API token is required')
      return NextResponse.json(
        { error: 'Web API token is required for Family Sharing games' }, 
        { status: 400 }
      )
    }

    // Rate limiting - max 3 requests per minute per IP (family API is more intensive)
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    if (!rateLimiter.isAllowed(`family_${clientIP}`, 3, 1)) {
      const resetTime = rateLimiter.getResetTime(`family_${clientIP}`)
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: resetTime ? new Date(resetTime).toISOString() : null
        }, 
        { status: 429 }
      )
    }

    // Check cache first (15 minutes TTL - shorter because tokens can expire)
    const tokenHash = webApiToken.slice(-8) // Use last 8 chars for privacy
    const cacheKey = `family_${tokenHash}_${familyGroupId}`
    const cachedData = steamCache.get(cacheKey)
    if (cachedData) {
      console.log(`[STEAM FAMILY API] Cache HIT for key: ${cacheKey}`)
      return NextResponse.json({
        ...cachedData,
        cached: true
      })
    }
    
    console.log(`[STEAM FAMILY API] Cache MISS for key: ${cacheKey} - fetching from Steam API`)

    // Fetch family shared games from Steam API
    const steamApiUrl = `https://api.steampowered.com/IFamilyGroupsService/GetSharedLibraryApps/v1/?access_token=${webApiToken}&family_groupid=${familyGroupId}&include_own=true&include_excluded=false&include_free=true&include_non_games=false`
    
    console.log(`[STEAM FAMILY API] Fetching family games from Steam API`)
    
    const response = await fetch(steamApiUrl)
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid or expired web API token')
      }
      throw new Error(`Steam Family API responded with status: ${response.status}`)
    }

    const data: FamilyAppsResponse = await response.json()
    
    if (!data.response || !data.response.apps) {
      return NextResponse.json(
        { error: 'No family shared apps found' }, 
        { status: 404 }
      )
    }

    // Transform Steam family apps to our format
    const games = data.response.apps
      .filter(app => !app.excluded_by_library_owner) // Only non-excluded apps
      .sort((a, b) => b.rt_playtime - a.rt_playtime) // Sort by playtime
      // Remove limit - return ALL games
      .map(app => ({
        id: app.appid,
        name: app.name || `App ${app.appid}`,
        image: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${app.appid}/header.jpg`,
        playtime: Math.round(app.rt_playtime / 60), // Convert to hours
        genre: 'Unknown',
        releaseYear: new Date().getFullYear(),
        isShared: app.owner_steamid !== '', // Mark as shared if has different owner
        ownerSteamId: app.owner_steamid,
        lastPlayed: app.rt_last_played ? new Date(app.rt_last_played * 1000).toISOString() : null
      }))

    const responseData = {
      success: true,
      gameCount: data.response.apps.length,
      games,
      familyGroupId,
      timestamp: Date.now()
    }

    // Cache the response for 15 minutes (shorter TTL for family API)
    steamCache.set(cacheKey, responseData, 15)

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Steam Family API Error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch family shared games',
        details: 'Make sure you are logged into Steam and using a valid webapi_token'
      }, 
      { status: 500 }
    )
  }
}