import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(
  req: Request,
  { params }: { params: { action: 'follow' | 'unfollow' } }
) {
  try {
    await connectDB();
    const { followerId, followingId } = await req.json();

    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower || !following) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (params.action === 'follow') {
      // Add to follower's following list
      await follower.follow(followingId);

      // Add to following's followers list
      following.followers.push(followerId);
      following.followersCount += 1;
      await following.save();

    } else {
      // Remove from follower's following list
      await follower.unfollow(followingId);

      // Remove from following's followers list
      following.followers = following.followers.filter(id => !id.equals(followerId));
      following.followersCount -= 1;
      await following.save();
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${params.action}ed user`
    });
  } catch (error) {
    console.error(`Error ${params.action}ing user:`, error);
    return NextResponse.json(
      { error: `Failed to ${params.action} user` },
      { status: 500 }
    );
  }
} 