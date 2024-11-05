import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/lib/models/Post';
import User from '@/lib/models/User';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const posts = await Post.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Get all unique author IDs
    const authorIds = [...new Set(posts.map(post => post.authorId))];
    
    // Fetch all authors in one query
    const authors = await User.find({ _id: { $in: authorIds } })
      .select('username isVerified')
      .lean()
      .exec();

    // Create a map of author data
    const authorMap = authors.reduce((acc, author) => {
      acc[author._id.toString()] = author;
      return acc;
    }, {} as Record<string, any>);

    // Add verification status to posts
    const formattedPosts = posts.map(post => ({
      ...post,
      isVerified: authorMap[post.authorId.toString()]?.isVerified || false
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Get user's information
    const user = await User.findOne({ username: body.username });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Extract hashtags from content
    const hashtags = body.content.match(/#[\w]+/g)?.map((tag: string) => tag.slice(1)) || [];

    // Create post data
    const postData = {
      authorId: user._id,
      username: user.username,
      content: body.content,
      tags: hashtags,
      userAvatarUrl: user.avatarUrl,
      userAvatarType: user.avatarType,
      likesCount: 0,
      commentsCount: 0,
      isDeleted: false
    };
    
    const post = await Post.create(postData);
    
    // Return the post with verification status
    return NextResponse.json({
      success: true,
      post: {
        ...post.toJSON(),
        isVerified: user.isVerified
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
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