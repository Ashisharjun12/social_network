import { sign } from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import { NextResponse } from 'next/server'
import { generateAndSendTempId } from '@/lib/utils/tempId'
import User from '@/lib/models/User'

export async function POST(req: Request) {
  try {
    await connectDB()
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.username || !body.recoveryEmail || !body.avatarUrl) {
      return NextResponse.json({
        message: 'Missing required fields',
        success: false
      }, { status: 400 })
    }

    // Generate tempId
    const tempId = await generateAndSendTempId(body.recoveryEmail, body.username)
    
    // Create new user
    const userData = {
      username: body.username,
      avatarType: body.avatarType || 'generated',
      avatarUrl: body.avatarUrl,
      cloudinaryPublicId: body.cloudinaryPublicId || null,
      personalInfo: {
        age: body.personalInfo.age,
        gender: body.personalInfo.gender,
        personality: body.personalInfo.personality,
        profession: body.personalInfo.profession
      },
      interests: body.interests,
      recoveryEmail: body.recoveryEmail,
      tempId,
      isEmailVerified: false,
      role: 'user',
      karmaPoints: 0
    }

    const user = await User.create(userData)

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
      message: 'Registration successful!',
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
    }, { status: 201 })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({
      message: error.code === 11000 ? 'Username or email already exists' : 'Registration failed',
      success: false
    }, { status: 500 })
  }
} 