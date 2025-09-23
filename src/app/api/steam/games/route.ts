import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge';

interface SteamGame {
  appid: number
  name: string
  playtime_forever: number
  img_icon_url: string
  has_community_visible_stats?: boolean
}

interface SteamGamesResponse {
  response: {
    game_count: number
    games: SteamGame[]
  }
}

// Function to extract Steam ID from profile URL or validate existing ID
async function resolveSteamId(input: string, apiKey: string): Promise<string> {
  // If it's already a numeric Steam ID, return it
  if (/^\d{17}$/.test(input)) {
    return input;
  }
  
  // If it's a profile URL, extract the custom URL or ID
  let customUrl = input;
  const urlMatch = input.match(/steamcommunity\.com\/id\/([^\/]+)/);
  if (urlMatch) {
    customUrl = urlMatch[1];
  } else {
    const idMatch = input.match(/steamcommunity\.com\/profiles\/(\d+)/);
    if (idMatch) {
      return idMatch[1];
    }
  }
  
  // Resolve custom URL to Steam ID using Steam API
  const resolveUrl = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${customUrl}`;
  const response = await fetch(resolveUrl);
  
  if (!response.ok) {
    throw new Error('Failed to resolve Steam profile URL');
  }
  
  const data = await response.json();
  if (data.response.success === 1) {
    return data.response.steamid;
  } else {
    throw new Error('Invalid Steam profile URL or username');
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const steamIdInput = searchParams.get('steamId')
    
    console.log(`[STEAM GAMES API] GET /api/steam/games - steamId input: ${steamIdInput}`)
    
    if (!steamIdInput) {
      console.error('[STEAM GAMES API] No steamId provided')
      return NextResponse.json(
        { error: 'Steam ID is required' }, 
        { status: 400 }
      )
    }

    const apiKey = process.env.STEAM_API_KEY
    if (!apiKey) {
      console.error('[STEAM GAMES API] No Steam API key configured')
      return NextResponse.json(
        { error: 'Steam API key not configured' }, 
        { status: 500 }
      )
    }

    // Resolve Steam ID from URL or validate existing ID
    const steamId = await resolveSteamId(steamIdInput, apiKey)
    console.log(`[STEAM GAMES API] Resolved steamId: ${steamId}`)

    console.log(`[STEAM GAMES API] Fetching from Steam API for steamId: ${steamId}`)
    console.log(`[STEAM GAMES API] steamId type: ${typeof steamId}, length: ${steamId?.length}`)
    console.log(`[STEAM GAMES API] apiKey available: ${!!apiKey}, length: ${apiKey?.length}`)
    
    // Fetch games from Steam API
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=1`
    console.log(`[STEAM GAMES API] Request URL: ${url.replace(apiKey, 'REDACTED')}`)
    
    const response = await fetch(url)
    console.log(`[STEAM GAMES API] Steam API response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[STEAM GAMES API] Steam API error: ${response.status} - ${errorText}`)
      return NextResponse.json(
        { 
          error: `Steam API error: ${response.status}`, 
          details: errorText 
        }, 
        { status: response.status }
      )
    }

    const data: SteamGamesResponse = await response.json()
    console.log(`[STEAM GAMES API] Steam API response:`, {
      game_count: data.response?.game_count,
      hasGames: !!data.response?.games
    })

    if (!data.response || !data.response.games) {
      console.warn('[STEAM GAMES API] No games found or profile is private')
      return NextResponse.json({
        success: false,
        error: 'No games found. Profile might be private.',
        games: []
      })
    }

    // Transform game data
    const games = data.response.games.map(game => ({
      id: game.appid,
      name: game.name,
      image: game.img_icon_url ? 
        `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg` :
        '', // Use same format as family API for consistency
      playtimeMinutes: game.playtime_forever,
      playtimeHours: Math.round(game.playtime_forever / 60 * 10) / 10
    }))

    console.log(`[STEAM GAMES API] Successfully processed ${games.length} games`)

    const result = {
      success: true,
      games,
      totalGames: games.length
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('[STEAM GAMES API] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch Steam games',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}