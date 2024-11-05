import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import { sign } from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    await connectDB()
    
    const { username, tempId } = await req.json()
    const user = await User.findOne({ username, tempId })
      .select('+avatarUrl +avatarType') // Explicitly select avatar fields

    if (!user) {
      return NextResponse.json({
        message: 'Invalid credentials',
        success: false
      }, { status: 401 })
    }

    // Generate JWT token
    const token = sign(
      { 
        userId: user._id,
        username: user.username,
        tempId: user.tempId,
        role: user.role,
        avatarUrl: user.avatarUrl,
        avatarType: user.avatarType
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    )

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          username: user.username,
          tempId: user.tempId,
          role: user.role,
          avatarUrl: user.avatarUrl,
          avatarType: user.avatarType
        }
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      message: 'Login failed',
      success: false
    }, { status: 500 })
  }
} 