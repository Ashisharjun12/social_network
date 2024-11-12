import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Reply from '@/lib/models/Reply';
import Comment from '@/lib/models/Comment';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

export async function GET(
  req: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    await connectDB();
    const { commentId } = params;

    // Use aggregation to get user info
    const replies = await Reply.aggregate([
      {
        $match: {
          commentId: new mongoose.Types.ObjectId(commentId),
          isDeleted: false
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $addFields: {
          isVerified: '$author.isVerified',
          userAvatarUrl: '$author.avatarUrl'
        }
      },
      {
        $project: {
          _id: 1,
          content: 1,
          username: 1,
          createdAt: 1,
          likesCount: 1,
          userAvatarUrl: 1,
          isVerified: 1
        }
      },
      {
        $sort: { createdAt: 1 }
      }
    ]);

    return NextResponse.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    await connectDB();
    const { commentId } = params;
    const { content, username } = await req.json();

    // Get user with verification status
    const user = await User.findOne({ username }).select('_id avatarUrl isVerified');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create reply with user info
    const reply = await Reply.create({
      commentId,
      authorId: user._id,
      username,
      content,
      userAvatarUrl: user.avatarUrl,
      isVerified: user.isVerified
    });

    // Update comment replies count
    await Comment.findByIdAndUpdate(commentId, {
      $inc: { repliesCount: 1 }
    });

    return NextResponse.json({
      ...reply.toObject(),
      userAvatarUrl: user.avatarUrl,
      isVerified: user.isVerified
    });
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    );
  }
} 