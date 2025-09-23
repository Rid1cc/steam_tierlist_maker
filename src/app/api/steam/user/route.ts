import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const steamId = searchParams.get('steamId')
    
    console.log(`[STEAM USER API] GET /api/steam/user - steamId: ${steamId}`)
    
    if (!steamId) {
      return NextResponse.json(
        { error: 'Steam ID is required' }, 
        { status: 400 }
      )
    }

    const apiKey = process.env.STEAM_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Steam API key not configured' }, 
        { status: 500 }
      )
    }

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
    console.error('Steam User API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Steam user info' }, 
      { status: 500 }
    )
  }
}