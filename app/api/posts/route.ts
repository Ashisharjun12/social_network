import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/lib/models/Post';
import User from '@/lib/models/User';
import Like from '@/lib/models/Like';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const username = url.searchParams.get('username');

    let posts = await Post.find({ isDeleted: false })
      .populate('authorId', 'isVerified')
      .sort({ createdAt: -1 })
      .lean();

    // Transform posts to include isVerified from author
    posts = posts.map(post => ({
      ...post,
      isVerified: post.authorId?.isVerified || false,
      authorId: post.authorId?._id
    }));

    // If username provided, get like status for each post
    if (username) {
      const user = await User.findOne({ username });
      if (user) {
        const likes = await Like.find({
          likedBy: user._id,
          post: { $in: posts.map(p => p._id) }
        });

        const likedPostIds = new Set(likes.map(l => l.post.toString()));
        
        posts = posts.map(post => ({
          ...post,
          isLiked: likedPostIds.has((post._id as mongoose.Types.ObjectId).toString())
        }));
      }
    }

    return NextResponse.json(posts);

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const user = await User.findOne({ username: body.username });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const postData: any = {
      authorId: user._id,
      username: user.username,
      content: body.content,
      tags: body.content.match(/#[\w]+/g)?.map((tag: string) => tag.slice(1)) || [],
      userAvatarUrl: user.avatarUrl,
      userAvatarType: user.avatarType,
      likesCount: 0,
      commentsCount: 0,
      isDeleted: false
    };

    // Add media if present
    if (body.mediaUrl) {
      postData.media = {
        type: 'image',
        url: body.mediaUrl,
        cloudinaryPublicId: body.cloudinaryPublicId
      };
    }

    // Add poll if present
    if (body.poll) {
      postData.poll = {
        options: body.poll.options,
        totalVotes: 0,
        endsAt: body.poll.endsAt
      };
    }

    const post = await Post.create(postData);
    
    return NextResponse.json({
      success: true,
      post: {
        ...post.toJSON(),
        isVerified: user.isVerified
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const postId = url.searchParams.get('id');
    const username = url.searchParams.get('username');

    if (!postId || !username) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user owns the post
    if (post.username !== username) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Soft delete
    post.isDeleted = true;
    await post.save();

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 