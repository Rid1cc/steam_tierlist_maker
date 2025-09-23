import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge';

interface SteamUser {
  steamid: string
  communityvisibilitystate: number
  profilestate: number
  personaname: string
  profileurl: string
  avatar: string
  avatarmedium: string
  avatarfull: string
  personastate: number
  realname?: string
  primaryclanid?: string
  timecreated?: number
  personastateflags?: number
  loccountrycode?: string
}

interface SteamUserResponse {
  response: {
    players: SteamUser[]
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
    
    console.log(`[STEAM USER API] GET /api/steam/user - steamId input: ${steamIdInput}`)
    
    if (!steamIdInput) {
      console.error('[STEAM USER API] No steamId provided')
      return NextResponse.json(
        { error: 'Steam ID is required' }, 
        { status: 400 }
      )
    }

    const apiKey = process.env.STEAM_API_KEY
    if (!apiKey) {
      console.error('[STEAM USER API] No Steam API key configured')
      return NextResponse.json(
        { error: 'Steam API key not configured' }, 
        { status: 500 }
      )
    }

    // Resolve Steam ID from URL or validate existing ID
    const steamId = await resolveSteamId(steamIdInput, apiKey)
    console.log(`[STEAM USER API] Resolved steamId: ${steamId}`)

    // Fetch user info from Steam API
    const steamApiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`
    
    console.log(`[STEAM USER API] Fetching user info from Steam API for steamId: ${steamId}`)
    
    const response = await fetch(steamApiUrl)
    
    if (!response.ok) {
      console.log(`[STEAM USER API] Steam API error - Status: ${response.status}`)
      throw new Error(`Steam API responded with status: ${response.status}`)
    }

    const data: SteamUserResponse = await response.json()
    console.log(`[STEAM USER API] Received user data for: ${data.response?.players?.[0]?.personaname || 'Unknown'}`)
    
    if (!data.response || !data.response.players || data.response.players.length === 0) {
      return NextResponse.json(
        { error: 'Steam user not found' }, 
        { status: 404 }
      )
    }

    const user = data.response.players[0]
    
    // Transform user data
    const userData = {
      steamId: user.steamid,
      username: user.personaname,
      realName: user.realname || null,
      profileUrl: user.profileurl,
      avatar: user.avatarfull,
      isPublic: user.communityvisibilitystate === 3,
      country: user.loccountrycode || null,
      accountCreated: user.timecreated ? new Date(user.timecreated * 1000).toISOString() : null
    }

    return NextResponse.json({
      success: true,
      user: userData
    })

  } catch (error) {
    console.error('[STEAM USER API] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch Steam user info',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}