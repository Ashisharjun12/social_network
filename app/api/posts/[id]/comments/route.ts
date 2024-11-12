import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Comment from '@/lib/models/Comment';
import User from '@/lib/models/User';
import Post from '@/lib/models/Post';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const postId = params.id;

    const comments = await Comment.find({ 
      postId,
      isDeleted: false 
    })
    .populate('authorId', 'avatarUrl isVerified')
    .sort({ createdAt: -1 })
    .lean();

    const transformedComments = comments.map(comment => ({
      ...comment,
      userAvatarUrl: comment.authorId?.avatarUrl,
      isVerified: comment.authorId?.isVerified
    }));
    
    return NextResponse.json(transformedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const postId = params.id;
    const { content, username } = await req.json();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const comment = await Comment.create({
      postId,
      authorId: user._id,
      username,
      content,
      userAvatarUrl: user.avatarUrl,
      isVerified: user.isVerified
    });

    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 }
    });

    return NextResponse.json({
      ...comment.toObject(),
      userAvatarUrl: user.avatarUrl,
      isVerified: user.isVerified
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
} 