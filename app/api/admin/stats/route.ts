import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import Post from '@/lib/models/Post'

export async function GET() {
  try {
    await connectDB()

    const [totalUsers, totalPosts, activeUsers] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      User.countDocuments({ 
        lastActive: { 
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) 
        } 
      })
    ])

    return NextResponse.json({
      totalUsers,
      totalPosts,
      totalGroups: 0, // Add when group model is implemented
      activeUsers
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 