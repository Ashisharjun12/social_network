import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const username = url.searchParams.get('username');

    if (!username) {
      return NextResponse.json([]);
    }

    // Get current user
    const currentUser = await User.findOne({ username });
    if (!currentUser) {
      return NextResponse.json([]);
    }

    // Get all users except current user
    const query = {
      username: { $ne: username },
      _id: { $ne: currentUser._id }
    };

    // Get all users
    const allUsers = await User.find(query)
      .select('username avatarUrl avatarType college isVerified')
      .limit(20)
      .lean();

    // Sort users based on college match
    const sortedUsers = allUsers.sort((a, b) => {
      // Users from same college come first
      if (a.college?.id === currentUser.college?.id && b.college?.id !== currentUser.college?.id) return -1;
      if (b.college?.id === currentUser.college?.id && a.college?.id !== currentUser.college?.id) return 1;
      
      // Then verified users
      if (a.isVerified && !b.isVerified) return -1;
      if (!a.isVerified && b.isVerified) return 1;

      // Random order for remaining
      return Math.random() - 0.5;
    });

    const suggestions = sortedUsers.map(user => ({
      ...user,
      isSameCollege: user.college?.id === currentUser.college?.id
    }));

    return NextResponse.json(suggestions);

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
} 