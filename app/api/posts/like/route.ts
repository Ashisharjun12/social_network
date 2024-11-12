import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/lib/models/Post';
import Like from '@/lib/models/Like';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { postId, username } = await req.json();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({ post: postId, likedBy: user._id });

    if (existingLike) {
      // If like exists, remove it (unlike)
      await Like.findByIdAndDelete(existingLike._id);

      // Decrement likes count in post
      await Post.findByIdAndUpdate(postId, {
        $inc: { likesCount: -1 }
      });

      return NextResponse.json({ success: true, action: 'unliked' });
    } else {
      // If like doesn't exist, create it
      await Like.create({
        post: postId,
        likedBy: user._id
      });

      // Increment likes count in post
      await Post.findByIdAndUpdate(postId, {
        $inc: { likesCount: 1 }
      });

      return NextResponse.json({ success: true, action: 'liked' });
    }

  } catch (error: any) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
} 