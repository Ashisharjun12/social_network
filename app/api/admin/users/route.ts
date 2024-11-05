import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'

export async function GET() {
  try {
    await connectDB()

    const users = await User.find({})
      .select('username role karmaPoints lastActive createdAt isVerified verifiedAt verifiedBy followers following')
      .lean()
      .exec()

    const transformedUsers = users.map(user => ({
      ...user,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0
    }))

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    const user = await User.findByIdAndUpdate(
      body.userId,
      { $set: body.updates },
      { new: true, runValidators: true }
    ).select('username role karmaPoints lastActive createdAt isVerified verifiedAt verifiedBy followers following')

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user.toJSON(),
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0
      }
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
} 