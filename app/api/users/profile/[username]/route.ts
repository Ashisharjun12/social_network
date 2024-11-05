import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Post from '@/lib/models/Post';

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    await connectDB();
    
    const user = await User.findOne({ username: params.username })
      .select('username avatarUrl avatarType personalInfo interests isVerified verifiedAt followers following');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's posts
    const posts = await Post.find({ 
      username: params.username,
      isDeleted: false 
    }).sort({ createdAt: -1 });

    // Combine user data with posts
    const profile = {
      username: user.username,
      avatarUrl: user.avatarUrl,
      avatarType: user.avatarType,
      personalInfo: user.personalInfo,
      interests: user.interests,
      isVerified: user.isVerified,
      verifiedAt: user.verifiedAt,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      posts: posts.map(post => ({
        ...post.toJSON(),
        isVerified: user.isVerified // Add verification status to each post
      }))
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 