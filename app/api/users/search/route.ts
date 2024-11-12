import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('q');

    if (!searchQuery || searchQuery.length < 2) {
      return NextResponse.json([]);
    }

    // Search users by username and college
    const users = await User.find({
      $or: [
        // Search by username
        { username: { $regex: searchQuery, $options: 'i' } },
        // Search by college name
        { 'college.name': { $regex: searchQuery, $options: 'i' } },
        // Search by college location
        { 'college.location': { $regex: searchQuery, $options: 'i' } }
      ]
    })
      .select('username avatarUrl college isVerified')
      .limit(10)
      .lean();

    // Sort results to prioritize username matches
    const sortedUsers = users.sort((a, b) => {
      const aUsernameMatch = a.username.toLowerCase().includes(searchQuery.toLowerCase());
      const bUsernameMatch = b.username.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (aUsernameMatch && !bUsernameMatch) return -1;
      if (!aUsernameMatch && bUsernameMatch) return 1;
      
      // If both match or don't match username, sort by college match
      const aCollegeMatch = a.college?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const bCollegeMatch = b.college?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (aCollegeMatch && !bCollegeMatch) return -1;
      if (!aCollegeMatch && bCollegeMatch) return 1;
      
      return 0;
    });

    return NextResponse.json(sortedUsers);

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }
} 