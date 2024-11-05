import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { followerUsername, targetUsername } = await req.json();

    // Validate input
    if (!followerUsername || !targetUsername) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Can't follow yourself
    if (followerUsername === targetUsername) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    // Get both users
    const [follower, target] = await Promise.all([
      User.findOne({ username: followerUsername }),
      User.findOne({ username: targetUsername })
    ]);

    if (!follower || !target) {
      return NextResponse.json(
        { error: 'One or both users not found' },
        { status: 404 }
      );
    }

    // Check if already following
    const isFollowing = follower.following.includes(targetUsername);

    if (isFollowing) {
      // Unfollow
      follower.following = follower.following.filter(username => username !== targetUsername);
      target.followers = target.followers.filter(username => username !== followerUsername);
    } else {
      // Follow
      follower.following.push(targetUsername);
      target.followers.push(followerUsername);
    }

    // Save both users
    await Promise.all([
      follower.save(),
      target.save()
    ]);

    return NextResponse.json({
      success: true,
      isFollowing: !isFollowing,
      followersCount: target.followers.length,
      followingCount: follower.following.length
    });

  } catch (error) {
    console.error('Follow error:', error);
    return NextResponse.json(
      { error: 'Failed to update follow status' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const followerUsername = url.searchParams.get('followerUsername');
    const targetUsername = url.searchParams.get('targetUsername');

    if (!followerUsername || !targetUsername) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const follower = await User.findOne({ username: followerUsername });
    if (!follower) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isFollowing = follower.following.includes(targetUsername);

    return NextResponse.json({ isFollowing });
  } catch (error) {
    console.error('Error checking follow status:', error);
    return NextResponse.json(
      { error: 'Failed to check follow status' },
      { status: 500 }
    );
  }
} 