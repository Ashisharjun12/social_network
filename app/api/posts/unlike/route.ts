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

    // Remove like
    const result = await Like.findOneAndDelete({
      post: postId,
      likedBy: user._id
    });

    if (result) {
      // Decrement likes count in post
      await Post.findByIdAndUpdate(postId, {
        $inc: { likesCount: -1 }
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Like not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Error unliking post:', error);
    return NextResponse.json({ error: 'Failed to unlike post' }, { status: 500 });
  }
} 