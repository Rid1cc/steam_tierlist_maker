import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() {
  try {
    // No cache to clear in simplified version
    return NextResponse.json({ 
      success: true, 
      message: 'No cache to clear (simplified version)',
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
    // No cache stats in simplified version
    return NextResponse.json({ 
      success: true, 
      stats: { message: 'No cache in simplified version' },
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