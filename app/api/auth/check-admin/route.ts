import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import { AUTH_COOKIE_NAME } from '@/lib/utils/cookies'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME)

    if (!authCookie) {
      return NextResponse.json({ isAdmin: false })
    }

    const userData = JSON.parse(authCookie.value)

    await connectDB()
    const user = await User.findOne({ 
      username: userData.username,
      tempId: userData.tempId 
    })

    return NextResponse.json({
      isAdmin: user?.role === 'admin'
    })

  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false })
  }
} 