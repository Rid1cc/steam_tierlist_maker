import { NextResponse } from 'next/server'
import { steamCache } from '@/lib/cache'

export async function POST() {
  try {
    // Clear the cache
    steamCache.clear()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error clearing cache:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get cache stats
    const stats = steamCache.getStats()
    
    return NextResponse.json({ 
      success: true, 
      stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error getting cache stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get cache stats' },
      { status: 500 }
    )
  }
}