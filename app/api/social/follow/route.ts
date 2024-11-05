import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Follow from '@/lib/models/Follow';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { followerId, targetId } = await req.json();

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(followerId) || !mongoose.Types.ObjectId.isValid(targetId)) {
      return NextResponse.json({ error: 'Invalid user IDs' }, { status: 400 });
    }

    // Can't follow yourself
    if (followerId === targetId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check if already following
      const existingFollow = await Follow.findOne({ 
        follower: followerId, 
        following: targetId,
        status: 'active'
      });

      if (existingFollow) {
        // Unfollow
        await Follow.findByIdAndDelete(existingFollow._id);
        
        // Update stats
        await User.findByIdAndUpdate(followerId, { $inc: { 'stats.following': -1 } });
        await User.findByIdAndUpdate(targetId, { $inc: { 'stats.followers': -1 } });

        await session.commitTransaction();
        return NextResponse.json({ 
          success: true, 
          action: 'unfollow',
          message: 'Successfully unfollowed user'
        });
      }

      // Create new follow
      await Follow.create([{
        follower: followerId,
        following: targetId
      }], { session });

      // Update stats
      await User.findByIdAndUpdate(followerId, { $inc: { 'stats.following': 1 } });
      await User.findByIdAndUpdate(targetId, { $inc: { 'stats.followers': 1 } });

      await session.commitTransaction();
      return NextResponse.json({ 
        success: true, 
        action: 'follow',
        message: 'Successfully followed user'
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Follow error:', error);
    return NextResponse.json({ error: 'Failed to update follow status' }, { status: 500 });
  }
}

// Get follow status and stats
export async function GET(req: Request) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const followerId = url.searchParams.get('followerId');
    const targetId = url.searchParams.get('targetId');

    if (!followerId || !targetId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const [followStatus, targetUser] = await Promise.all([
      Follow.findOne({ 
        follower: followerId, 
        following: targetId,
        status: 'active'
      }),
      User.findById(targetId).select('stats username avatarUrl')
    ]);

    return NextResponse.json({
      isFollowing: !!followStatus,
      user: {
        username: targetUser?.username,
        avatarUrl: targetUser?.avatarUrl,
        stats: targetUser?.stats
      }
    });

  } catch (error) {
    console.error('Get follow status error:', error);
    return NextResponse.json({ error: 'Failed to get follow status' }, { status: 500 });
  }
} 